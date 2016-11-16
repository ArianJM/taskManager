/* global gapi, Acuerdo */
'use strict';

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
const clientId = '620760987090-ncpthf64vkca54210079fvlebpi2jep9.apps.googleusercontent.com';
const apiKey = 'AIzaSyDRUtCdJkJ3ARwzSfmpVxyH_0XUxAKxX8g';

// Read Google Sheets
const scopes = [ 'https://www.googleapis.com/auth/spreadsheets.readonly' ];

let $signinButton = null;
let $signoutButton = null;

$.getScript('Acuerdo.js');

/**
    Updates the signin status. Shows or removes the buttons.
    @method updateSigninStatus
    @param {Boolean} isSignedIn Whether the user is signed in or not.
    @return {void}
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        $signinButton.hide();
        $signoutButton.show();
    }
    else {
        $signinButton.show();
        $signoutButton.hide();
    }
}

const acuerdosTemporales = [];

/**
    Get all the agreements.
    @method getAgreements
    @return {void}
*/
function getAgreements() {
    const $table = $('table#agreements');
    const $tbody = $('#agreements tbody');
    const $errorDiv = $('div#error-div');

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1CQ6udndHxaDytqub9oGRvppw97FSpYYusnE8SBY9Ixk',
        range: 'Acuerdos temporales!A2:F',
    }).then(response => {
        const range = response.result;

        if (range.values.length > 0) {
            let html = '';

            for (let index = 0; index < range.values.length; index++) {
                const row = range.values[index];
                const responsable = row[0];
                const decision = row[1];
                const fecha = row[2];
                const email = row[3];
                const urgencia = row[4];
                const comentarios = row[5];
                const acuerdo = new Acuerdo(index, responsable, decision, fecha, email, urgencia, comentarios);

                acuerdosTemporales.push(acuerdo);

                html += `<tr>
    <td>${index}</td>
    <td>${responsable}</td>
    <td>${decision}</td>
    <td>${fecha}</td>
    <td>${email}</td>
    <td>${urgencia}</td>
    <td>${comentarios}</td>
</tr>\n`;
            }
            $table.show();
            $tbody.html(html);
            $table.DataTable();         // eslint-disable-line new-cap
        }
        else {
            $table.hide();
            $errorDiv.show();
        }
    }, response => {
        $errorDiv.show().html(`Error: ${response.result.error.message}`);
    });
}

/**
    Initialize the authorization process.
    @method initAuth
    @return {void}
*/
function initAuth() {
    const scope = scopes.join(' ');

    $signinButton = $('#signin-button');
    $signoutButton = $('#signout-button');
    gapi.client.setApiKey(apiKey);
    gapi.auth2.init({
        client_id: clientId,        // eslint-disable-line camelcase
        scope,
    }).then(() => {

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        $signinButton.click(() => {
            gapi.auth2.getAuthInstance().signIn().then(() => {
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        });

        $signoutButton.click(() => {
            gapi.auth2.getAuthInstance().signOut().then(() => updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()));
        });

        const discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

        gapi.client.load(discoveryUrl).then(getAgreements);
    });
}

gapi.load('auth2', initAuth);
