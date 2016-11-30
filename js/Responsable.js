/* exported Responsable */
'use strict';

/**
    Define el objeto {Responsable}, que almacena informacion sobre quien esta a cargo de un acuerdo.
    @class Responsable
*/
class Responsable {

    /**
        @constructor
        @param {Number} id Identificador unico del responsable en cuestion.
        @param {String} nombre Nombre del responsable.
    */
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.acuerdos = [];
    }

    /**
        Anade un {Acuerdo} al {Responsable}.
        @method addAcuerdo
        @param {Acuerdo} acuerdo El acuerdo que hay que anadir al responsable.
        @return {void}
    */
    addAcuerdo(acuerdo) {
        this.acuerdos.push(acuerdo);
    }

    /**
        Devuelve la lista de {Acuerdo} de este {Responsable}.
        @method getAcuerdos
        @return {Array}  Lista de objetos {Acuerdo} de los que este {Responsable} se encarga.
    */
    getAcuerdos() {
        return this.acuerdos;
    }
}
