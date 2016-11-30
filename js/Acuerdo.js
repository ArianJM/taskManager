/* exported Acuerdo */
'use strict';

/**
    Define el objeto {Acuerdo}.
    @class Acuerdo
*/
class Acuerdo {

    /**
        @constructor
        @param {Number} id Identificador.
        @param {String} responsable Responsable del acuerdo.
        @param {String} decision La decision tomada.
        @param {String} fecha Puede ser {Number}. La fecha de la decision en formato aammdd o aaaammdd. Ex: 161122 o 20161122 (22 de noviembre de 2016).
        @param {String} email Si el acuerdo viene de un email, de que cadena.
        @param {String} urgencia Puede ser {Number}. El nivel de urgencia del acuerdo.
        @param {String} comentarios Los comentarios que haya en el acuerdo.
        @param {Boolean} [completado=false] Si el acuerdo ha sido completado o no.
    */
    constructor(id, responsable, decision, fecha, email, urgencia, comentarios, completado = false) {   // eslint-disable-line max-params
        this.id = id;
        this.responsable = responsable;
        this.decision = decision;
        this.setDate(fecha);
        this.email = email;
        this.urgencia = urgencia;
        this.comentarios = comentarios;
        this.completado = completado;
        this.isExpanded = false;
    }

    setDate(date) {
        if (!date || ((date.length !== 6) && (date.length !== 8))) {        // eslint-disable-line no-magic-numbers
            this.fecha = '';
        }
        else {
            const year = date.length < 8 ? 2000 + parseInt(date.substr(0, 2), 10) : parseInt(date.substr(0, 4), 10);    // eslint-disable-line no-magic-numbers
            const month = date.length < 8 ? parseInt(date.substr(2, 2) - 1, 10) : parseInt(date.substr(4, 2) - 1, 10);  // eslint-disable-line no-magic-numbers
            const day = date.length < 8 ? parseInt(date.substr(4, 2), 10) : parseInt(date.substr(6, 2), 10);            // eslint-disable-line no-magic-numbers

            this.fecha = new Date(year, month, day);
        }
    }

    getHTML() {
        return `<tr class="acuerdo-fila acuerdo-fila-id${this.id}">
    <td class="identificador">${this.id}</td>
    <td class="responsable">${this.responsable}</td>
    <td class="decision">${this.decision}</td>
    <td class="fecha">${this.getDate8DigitFormat()}</td>
    <td class="email">${this.email}</td>
    <td class="urgencia">${this.urgencia}</td>
</tr>\n`;
    }

    getDate8DigitFormat() {
        let stringDate = '';

        if (typeof this.fecha === 'object') {
            const year = this.fecha.getFullYear().toString();
            let month = (this.fecha.getMonth() + 1).toString();
            let date = this.fecha.getDate().toString();

            if (month.length === 1) {
                month = `0${month}`;
            }
            if (date.length === 1) {
                date = `0${date}`;
            }
            stringDate += `${year}${month}${date}`;
        }
        else {
            stringDate = this.fecha;
        }
        return stringDate;
    }

    getSelectors() {
        return { main: $(`.acuerdo-fila-id${this.id}`),
                 modal: $('div#acuerdo-modal'),
                 modalId: $('h3.modal-id'),
                 modalResponsable: $('h3.modal-responsable'),
                 modalFecha: $('h3.modal-fecha'),
                 modalEmail: $('h3.modal-email'),
                 modalUrgencia: $('h3.modal-urgencia'),
                 modalDecision: $('div.modal-decision'),
                 modalComentarios: $('div.modal-comentarios'),
                 modalEditButton: $('button.modal-edit'),
                 modalCompleteButton: $('button.modal-complete'),
                 modalText: $('.modal-text'),
                 modalInput: $('.modal-input'),
                 responsableInput: $('input[name="responsable"]'),
                 emailInput: $('input[name="email"]'),
                 urgenciaInput: $('input[name="urgencia"]'),
                 fechaInput: $('input[name="fecha"]'),
                 decisionInput: $('textarea[name="decision"]'),
                 comentariosInput: $('textarea[name="comentarios"]'),
             };
    }

    showDetails() {
        const selectors = this.getSelectors();

        selectors.modal.modal();

        selectors.modalResponsable.text(`Responsable: ${this.responsable}`);
        selectors.modalDecision.text(`${this.decision}`);
        selectors.modalComentarios.text(`${this.comentarios}`);

        if (this.id !== '') {
            selectors.modalId.text(`ID: ${this.id}`);
            selectors.modalId.hide();
        }

        if (this.email === '') {
            selectors.modalEmail.hide();
        }
        else {
            selectors.modalEmail.text(`Email: ${this.email}`);
            selectors.modalEmail.show();
        }

        if (this.urgencia === '') {
            selectors.modalUrgencia.hide();
        }
        else {
            selectors.modalUrgencia.text(`Urgencia: ${this.urgencia}`);
            selectors.modalUrgencia.show();
        }
        if (this.fecha === '') {
            selectors.modalFecha.text('(sin fecha)');
        }
        else if (typeof this.fecha === 'object') {
            selectors.modalFecha.text(`Fecha: ${this.fecha.toLocaleDateString()}`);
        }
        else {
            selectors.modalFecha.text(`Fecha: ${this.fecha}`);
        }

        selectors.modalEditButton.click(() => {
            document.location.href = `editar-acuerdo.html?acuerdoId=${this.id}`;
        });
    }
}
