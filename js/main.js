/* global gapi, Conexion, Acuerdo, Responsable */
'use strict';

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

    let table = null;
    const $table = $('table#acuerdos');
    const $tbody = $('#acuerdos tbody');
    const $errorDiv = $('div#error-div');

    /**
        Get all the agreements.
        @method getAgreements
        @return {void}
    */
    function getAgreements() {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1CQ6udndHxaDytqub9oGRvppw97FSpYYusnE8SBY9Ixk',
            range: 'Acuerdos temporales!A2:F',
        }).then(response => {
            const range = response.result;

            if (range.values.length > 0) {
                for (let index = 0; index < range.values.length; index++) {
                    const row = range.values[index];
                    const nombreResponsable = row[0];
                    const decision = row[1];
                    const fecha = row[2];
                    const email = row[3];
                    const urgencia = row[4];
                    const comentarios = row[5];
                    const acuerdo = new Acuerdo(index, nombreResponsable, decision, fecha, email, urgencia, comentarios);

                    if (!responsables.some(responsable => responsable.nombre === nombreResponsable)) {
                        responsables.push(new Responsable(responsables.length, nombreResponsable));
                    }

                    acuerdosTemporales.push(acuerdo);

                    $tbody.append(acuerdo.getHTML());
                    $(acuerdo.getSelectors().main).click(() => {
                        acuerdo.showDetails();
                    });
                }
                $table.show();
                table = $table.DataTable();         // eslint-disable-line new-cap
            }
            else {
                $table.hide();
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

            conexion.load(discoveryUrl, getAgreements);
        }
        else {
            $signinButton.show();
            $signoutButton.hide();

            if (table) {
                table.clear();
                table.destroy();
                $table.hide();
            }
        }
    });
});
