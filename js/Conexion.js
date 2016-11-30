/* global gapi */
/* exported Conexion */
'use strict';

/**
    Gestiona la conexion con Google.
    @class Conexion
*/
class Conexion {

    /**
        Constructor de la clase, inicia la conexion
        @constructor
    */
    constructor() {

        // Your Client ID can be retrieved from your project in the Google
        // Developer Console, https://console.developers.google.com
        this.clientId = '620760987090-ncpthf64vkca54210079fvlebpi2jep9.apps.googleusercontent.com';
        this.apiKey = 'AIzaSyDRUtCdJkJ3ARwzSfmpVxyH_0XUxAKxX8g';

        // Read Google Sheets
        this.scopes = [ 'https://www.googleapis.com/auth/spreadsheets.readonly' ];
        this.isSignedIn = false;
    }

    /**
        Initializes the login process
        @method initAuth
        @return {void}
    */
    initAuth() {
        gapi.load('auth2', () => {
            const scope = this.scopes.join(' ');

            gapi.client.setApiKey(this.apiKey);
            gapi.auth2.init({
                client_id: this.clientId,        // eslint-disable-line camelcase
                scope,
            }).then(() => {

                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
                    this.isSignedIn = isSignedIn;
                    this.fireLogChangedEvent();
                });

                // Handle the initial sign-in state.
                this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                this.fireLogChangedEvent();
            });
        });
    }

    /**
        Logs in to Google.
        @method logIn
        @return {void}
    */
    logIn() {
        const auth2 = gapi.auth2.getAuthInstance();

        auth2.signIn();
    }

    /**
        Logs out of Google.
        @method logOut
        @return {void}
    */
    logOut() {
        const auth2 = gapi.auth2.getAuthInstance();

        auth2.signOut();
    }

    /**
        Fires a logChanged event.
        @method fireLogChangedEvent
        @return {void}
    */
    fireLogChangedEvent() {
        const loginEvent = new CustomEvent('logChanged', { detail: this.isSignedIn });

        dispatchEvent(loginEvent);
    }

    /**
        Loads the client library interface to a particular API with discovery document URL or JSON object.
        https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientloadurlorobject
        @method load
        @param {String} urlOrObject The Discovery Document URL or parsed Discovery Document JSON object.
        @param {Function} onLoad The function to execute when loaded.
        @return {goo.Theenable}  The return value is a Promise-like goog.Thenable object that resolves when the API interface is loaded.
    */
    load(urlOrObject, onLoad) {
        gapi.client.load(urlOrObject).then(onLoad);
    }
}
