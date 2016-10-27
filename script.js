/* global gapi */
'use strict';

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
const clientId = '620760987090-ncpthf64vkca54210079fvlebpi2jep9.apps.googleusercontent.com';
const apiKey = 'AIzaSyDRUtCdJkJ3ARwzSfmpVxyH_0XUxAKxX8g';

// View the files in your Google Drive
const scope = 'https://www.googleapis.com/auth/drive.readonly';

const signinButton = document.getElementById('signin-button');
const signoutButton = document.getElementById('signout-button');

/**
    Gets the file.
    @method getFile
    @param {String} [id='1SHx9uEXfIjOqvyMKN9TC1_jTjnTbogCu64VPcyuF_XM'] The id of the file to retrieve.
    @return {void}
*/
function getFile(id = '1SHx9uEXfIjOqvyMKN9TC1_jTjnTbogCu64VPcyuF_XM') {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const oauthToken = user.getAuthResponse().access_token;
    const requestUrl = `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=text/csv&access_token=${oauthToken}`;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', requestUrl);
    xhr.onerror = function() {
        $('#output').html('Ups: parece que se ha producido un error');
    };
    xhr.onload = function() {
        $('#output').html(`Todo bien:\n${xhr.responseText}`);
    };
    xhr.send();
}

/**
    Updates the signin status. Shows or removes the buttons.
    @method updateSigninStatus
    @param {Boolean} isSignedIn Whether the user is signed in or not.
    @return {void}
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
        getFile();
    }
    else {
        signinButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut().then(() => updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()));
}

function handleSigninClick(event) {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        getFile();
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

/**
    Initialize the authorization process.
    @method initAuth
    @return {void}
*/
function initAuth() {
    gapi.client.setApiKey(apiKey);
    gapi.auth2.init({
        client_id: clientId,        // eslint-disable-line camelcase
        scope,
    }).then(() => {

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        signinButton.addEventListener("click", handleSigninClick);
        signoutButton.addEventListener("click", handleSignoutClick);
    });
}

gapi.load('auth2', initAuth);
