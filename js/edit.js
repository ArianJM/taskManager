/* global gapi, Conexion, Acuerdo, Responsable */
/* exported getParameterByName */
'use strict';

/**
    Gets the URL parameters by name.
    @method getParameterByName
    @param {String} name The name of the parameter to search for.
    @param {String} url The url to search parameters from.
    @return {String}  The parameter value.
*/
function getParameterByName(name, url = window.location.href) {
    const newName = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${newName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);

    let result = null;

    if (!results) {
        result = null;
    }
    else if (!results[2]) {     // eslint-disable-line no-negated-condition
        result = '';
    }
    else {
        result = decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    return result;
}


$(document).ready(() => {
    const acuerdosTemporales = [];
    const responsables = [];
    const $signinButton = $('button#signin-button');
    const $signoutButton = $('button#signout-button');
    const conexion = new Conexion();

    conexion.initAuth();

    $signinButton.click(() => {
        conexion.logIn();
    });
    $signoutButton.click(() => {
        conexion.logOut();
    });

    const $responsable = $('input#responsable');
    const $fecha = $('input#fecha');
    const $email = $('input#email');
    const $urgencia = $('input#urgencia');
    const $decision = $('textarea#decision');
    const $comentarios = $('textarea#comentarios');
    const $errorDiv = $('div#error-div');

    /**
        Get one agreement.
        @method getAgreement
        @return {void}
    */
    function getAgreement() {
        const id = getParameterByName('acuerdoId');

        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1CQ6udndHxaDytqub9oGRvppw97FSpYYusnE8SBY9Ixk',
            range: 'Acuerdos temporales!A2:F',
        }).then(response => {
            const range = response.result;

            if (range.values.length > 0) {
                const row = range.values[id];
                const nombreResponsable = row[0];
                const decision = row[1];
                const fecha = row[2];
                const email = row[3];
                const urgencia = row[4];
                const comentarios = row[5];
                const acuerdo = new Acuerdo(id, nombreResponsable, decision, fecha, email, urgencia, comentarios);

                for (let index = 0; index < range.values.length; index++) {
                    if (!responsables.some(responsable => responsable.nombre === range.values[index][0])) {
                        responsables.push(new Responsable(responsables.length, range.values[index][0]));
                    }
                }

                $responsable.val(nombreResponsable);
                $fecha.val(fecha);
                $email.val(email);
                $urgencia.val(urgencia);
                $decision.val(decision);
                $comentarios.val(comentarios);

                const nombresResponsables = responsables.filter(responsable => Boolean(responsable.nombre))
                                                        .map(responsable => responsable.nombre);

                $responsable.autocomplete({ source: nombresResponsables });
                $fecha.datepicker();
            }
            else {
                $errorDiv.show();
            }
        }, response => {
            $errorDiv.show().html(`Error: ${response.result.error.message}`);
        });


        // const values = [ [ ], [ 'Holaa' ] ];
        //
        // gapi.client.sheets.spreadsheets.values.update({ spreadsheetId: '1SHx9uEXfIjOqvyMKN9TC1_jTjnTbogCu64VPcyuF_XM',
        //                                                 range: 'A1',
        //                                                 valueInputOption: 'RAW',
        //                                                 values }).then(response => {
        //                                                     console.log(response.body);
        //                                                 });
    }

    // Listens to login changes.
    addEventListener('logChanged', event => {
        if (event.detail) {
            $signinButton.hide();
            $signoutButton.show();

            const discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

            conexion.load(discoveryUrl, getAgreement);
        }
        else {
            $signinButton.show();
            $signoutButton.hide();
        }
    });
});
