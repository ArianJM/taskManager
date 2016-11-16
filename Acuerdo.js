/* exported Acuerdo */
'use strict';

/**
    Define el objeto acuerdo.
    @class Acuerdo
*/
class Acuerdo {

    /**
        @constructor
        @param {Number} id Identificador
        @param {String} responsable Responsable del acuerdo
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
    }
}
