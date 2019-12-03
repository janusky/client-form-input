"use strict";

class UUID {
  create() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = ((dt + Math.random() * 16) % 16) | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
}
export const uuid = new UUID();

class Utils {
  isEmpty(o) {
    if (typeof o === "object") {
      return this.isEmptyObject(o);
    }
    return o === undefined || o === null || $.trim(o) === "";
  }

  isEmptyObject(o) {
    //if ($.isBlank(o)) { return true; }
    if (Object.keys(o).length < 1) {
      return true;
    }
    for (var p in o) {
      var propValue = o[p];
      if (typeof propValue != "boolean" && $.isEmptyObject(propValue)) {
        return true;
      }
    }
    return false;
  }

  isJSON(data) {
    var isJson = false;
    try {
      var json = $.parseJSON(data);
      isJson = typeof json === "object";
    } catch (ex) {
      console.debug("data is not JSON");
    }
    return isJson;
  }

  stringFun(fun) {
    var string = fun.toSource ? fun.toSource() : "(" + fun.toString() + ")";
    return string;
  }
}
export const utils = new Utils();

class I18n {
  getMessage(key, params) {
    return chrome.i18n.getMessage(key, params);
  }
}
export const i18n = new I18n();

export class SurveyOut {
  /**Texto de comienzo Objeto resultado*/
  startObj = "\n```suvery\n";
  regexObj = /\n```suvery\n.*\n```/;

  /**
   * Devuelve Objeto resultante de la operación realizada en formulario.
   * 
   * @param {String} id Identificador del formulario utilizado.
   * @param {Object} data Datos ingresados en formulario.
   */
  write(id, data) {
    var suveryData = "";
    suveryData += this.startObj;
    suveryData += '{"id": "' + id + '",';
    suveryData += '"data":' + JSON.stringify(data) + "}";
    suveryData += "\n```";
    return suveryData;
  }

  /**
   * Lee el Objeto tipo Survey escrito en el texto recibido.
   * 
   * @param {String} value Texto donde puede existir el Objeto SuerveyOut
   */
  read(value) {
    if (value && value !== "") {
      //var regExp = /```suvery\n.*```/ig;
      var regExp = /```suvery\n.*\n?```/;
      var matches = regExp.exec(value);
      if (matches != null && matches[0]) {
        var json = matches[0].substring(10, matches[0].length - 3);
        return JSON.parse(json);
      }
    }
    return null;
  }
}
export const surveyOut = new SurveyOut();