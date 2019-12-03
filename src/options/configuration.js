"use strict";

import ChromeStoragePromise from "../vendor/chrome-storage-promise.js";
import Connector from "../shell/connector.js";
import StorageLocal from "../shell/storage-local.js";
import { StrategyDB } from "../shell/storage-local.js";
import { extend, currentLanguage } from "./lib/helper.js";

export const KEY_DATA_CONFIG = "form-imput_config";
export const defaultDataConfig = {
  strategyDB: StrategyDB.LOCAL
  //configFieldLanguaje: currentLanguage()
};

export class Configuration {
  keyDataConfig = KEY_DATA_CONFIG;
  dataConfig = null;

  constructor() {}

  setup() {
    // Si no hay configuración guarda la por defecto: defaultDataConfig
    return getDataConfig().then(data => {
      if (data) {
        this.dataConfig = data;
      } else {
        return setStore(defaultDataConfig).then(() => {
          this.dataConfig = defaultDataConfig;
        });
      }
    });
  }

  /**
   * Recupera la información de configuración.
   */
  mergeDataConfig(src) {
    var objMerge = extend(this.dataConfig, src);
    return setStore(objMerge);
  }
}

/**
 * Busca según el valor almacenado Storage.
 */
export function getStrategyDb() {
  return getStore("strategyDB").then(data => {
    return (data && data.strategyDB) || StrategyDB.SYNC;
  });
}

/**
 * Recupera la información de configuración.
 */
export function getDataConfig() {
  return getStore();
}

/**
 * Recupera en modo local lo necesario para operar.
 */
function getStore(keyId) {
  return ChromeStoragePromise.sync.get(KEY_DATA_CONFIG).then(data => {
    var dataValue = Object.values(data)[0];
    var resp = dataValue;
    if (dataValue && keyId) {
      resp = {};
      if (dataValue[keyId] === undefined) {
        throw new Error(`"No found 'keyId ${keyId}' specified"`);
      }
      resp[keyId] = dataValue[keyId];
    }
    return resp;
  });
}

/**
 * Guarda en modo local lo necesario para operar.
 * 
 * @param {Object} data
 */
function setStore(data) {
  let objSave = {};
  objSave[KEY_DATA_CONFIG] = data;
  return ChromeStoragePromise.sync.set(objSave);
}

/**
 * Crea un Connector configurado (ejecuta setup()).
 */
export function buildConnector() {
  return newConnector().then(connector => {
    return connector.setup();
  });
}

/**
 * Crea una instancia de Connector.
 */
export function newConnector() {
  return getStrategyDb().then(st => {
    return new Connector(new StorageLocal(st));
  });
}
