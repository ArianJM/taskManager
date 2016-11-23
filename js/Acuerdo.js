/* exported Acuerdo */
'use strict';

/**
    Define el objeto acuerdo.
    @class Acuerdo
*/
class Acuerdo {

    /**
        @constructor
        @param {Number} id Identificador.
        @param {String} responsable Responsable del acuerdo.
        @param {String} decision La decision tomada.
        @param {String} fecha Puede ser {Number}. La fecha de la decision en formato aammdd. Ex: 161122 (22 de noviembre de 2016).
        @param {String} email Si el acuerdo viene de un email, de que cadena.
        @param {String} urgencia Puede ser {Number}. El nivel de urgencia del acuerdo.
        @param {String} comentarios Los comentarios que haya en el acuerdo.
        @param {Boolean} [completado=false] Si el acuerdo ha sido completado o no.
    */
    constructor(id, responsable, decision, fecha, email, urgencia, comentarios, completado = false) {   // eslint-disable-line max-params
        this.id = id;
        this.responsable = responsable;
        this.decision = decision;
        this.fecha = fecha;
        this.email = email;
        this.urgencia = urgencia;
        this.comentarios = comentarios;
        this.completado = completado;
        this.isExpanded = false;
    }

    getHTML() {
        return `<tr class="acuerdo-fila acuerdo-fila-id${this.id}">
    <td class="identificador">${this.id}</td>
    <td class="responsable">${this.responsable}</td>
    <td class="decision">${this.decision}</td>
    <td class="fecha">${this.fecha}</td>
    <td class="email">${this.email}</td>
    <td class="urgencia">${this.urgencia}</td>
</tr>
<tr class="acuerdo-fila-content acuerdo-fila-content-id${this.id}"><td colspan="6"><div>
    <h4>Comentarios</h4>
    ${this.comentarios}
</div></td></tr>\n`;
    }

    getSelector() {
        return { main: `.acuerdo-fila-id${this.id}`, body: `.acuerdo-fila-content-id${this.id}` };
    }

    showDetails() {
        $(this.getSelector().body).show();
        this.isExpanded = true;
    }

    hideDetails() {
        $(this.getSelector().body).hide();
        this.isExpanded = false;
    }
}
