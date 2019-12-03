"use strict";

import { utils as Utils } from "./helper.js";
import { Source, SourceForm } from "./model.js";

/**
 * Identificador de almacenamiento.
 */
export const SCHEMA_DATA = "form-imput_web";

/**
 * Administra los datos con la abstracción de la implementación de almacenamiento.
 */
export default class Connector {
  constructor(storage) {
    if (!storage instanceof Storage) {
      throw new Error(`"${storage}" is not a Storage`);
    }
    this.storage = storage;
  }

  setup() {
    let self = this;
    return this.storage.setup().then(resp => {
      return self;
    });
  }

  /**
   * Devuelve todos los objetos de negocio.
   */
  list() {
    return this.storage.getAll();
  }

  /**
   * Crea o actualiza el objeto indicado.
   * 
   * NOTA: Si es actualizar tener recaudos para no romper el objeto. 
   * 
   * @param {Source} data 
   */
  save(data) {
    //TODO 2019/04/04 - Chequeo Básico
    //TODO 2019/10/31 -  Utilizar los objetos Source y SourceForm
    if (Utils.isEmpty(data.id) && Utils.isEmpty(Object.values(data)[0])) {
      // Crea el objeto fijando un identificador
      return this.storage.persist(data);
    } else {
      // Asume que solo debe impactar el objeto recibido (ver: merge()).
      return this.storage.update(data);
    }
  }

  /**
   * Identifica el objeto indicado y combina los valores para luego actualizar.
   */
  merge(data) {
    //TODO 2019/10/31 - Utilizar los objetos Source y SourceForm
    return this.storage.merge(data);
  }

  /**
   * Recupera los datos para la clave indicada (Source.id == id).
   * 
   * @param {String} id 
   */
  getById(id) {
    return this.storage.get(id);
  }

  /**
   * Busca los objetos que retornen igualdad en el valor del atributo URL.
   * 
   * @param {String} url 
   */
  findUrlMatch(url) {
    return this.storage.getAll().then(data => {
      var resp = [];
      if (data) {
        //data.forEach(function(element) {
        $.each(data, function(i, element) {
          if (element.url.toLowerCase() === url.toLowerCase()) {
            resp.push({ id: element.id, url: element.url });
          }
        });
      }
      return resp;
    });
  }

  /**
   * Buscar el Source correspondiente al valor de URL indicado (Source.url test url).
   */
  findByUrl(url) {
    return this.storage.getAll().then(data => {
      var resp = [];
      if (data) {
        //data.forEach(function(element) {
        $.each(data, function(i, element) {
          var regex = new RegExp(element.url);
          if (element.url.toLowerCase() === url.toLowerCase()) {
            resp.push(element);
          } else if (regex.test(url)) {
            resp.push(element);
          }
        });
      }
      return resp;
    });
  }
}

/**
 * Interface de almacenamiento (StorageLocal).
 */
export class Storage {
  constructor() {
    if (new.target === Storage) {
      // throw new Error('Storage cannot be directly constructed.')
      // throw new TypeError('Abstract class "Widget" cannot be instantiated directly.');
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    if (this.persist === undefined) {
      throw new TypeError("Classes extending the widget abstract class");
    }
  }

  setup() {
    return this.setup();
  }

  getAll() {
    return this.getAll();
  }

  persist(data) {
    return this.persist(data);
  }

  update(updateObj) {
    return this.update(updateObj);
  }

  merge(data) {
    return this.merge(data);
  }

  get(keyId) {
    return this.get(keyId);
  }
}
