import { i18n } from "../../shell/helper.js";

export function toggle() {
  $('[data-toggle="tooltip"]').tooltip({
    placement: "right"
  });
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
    html: true,
    container: "body",
    placement: "top"
  });
}

/**
 * Busca el atributo data-i18n y permite configurar el valor como clave o objeto.
 * 
 * Clave: Indicar String o { key: 'key_In_Messages.json'}
 * Objeto: Indicar { key: 'key_In_Messages.json', params: Object}
 * i18n-config: Atributo opcional con configuraciones.
 * 
 * Ejemplo (data-i18n o data-i18n-title comportamiento similar)
 *    
 *    data-i18n="extensionName"
 *    data-i18n="{'key':'enterField','params':'javascript'}"
 * 
 *    //messages.json
 *    "extensionName": {
 *      "message": "Formulario de Ingreso",
 *    },
 *    "enterField": {
 *      "message": "Enter $1"
 *    },
 *    "enterFieldHtml": {
 *      "message": "Enter <strong>Negrita</strong>"
 *    }
 */
export function i18nLoad() {
  $("[data-i18n]").each(function() {
    var el = $(this);
    var i18nValue = resolveI18nValue(el, el.data("i18n"));

    if (el.is("input") || el.is("textarea")) {
      el.attr("placeholder", i18n.getMessage(i18nValue.key, i18nValue.params));
    } else {
      var msg = i18n.getMessage(i18nValue.key, i18nValue.params);
      if (i18nValue.config.html === true) {
        el.html(msg);
      } else {
        el.text(msg.replace(/<.*?>/g, ""));
      }
    }
  });

  $("[data-i18n-title]").each(function() {
    var el = $(this);
    var i18nValue = resolveI18nValue(el, el.data("i18n-title"));

    var msg = i18n.getMessage(i18nValue.key, i18nValue.params);
    el.attr("title", msg.replace(/<.*?>/g, ""));
  });

  function resolveI18nValue(el, i18nValue) {
    var key = i18nValue;
    var params = null;
    var json = null;

    if (
      i18nValue.charAt(0) === "{" &&
      i18nValue.charAt(i18nValue.length - 1) === "}"
    ) {
      json = $.parseJSON(i18nValue.replace(/'/g, '"'));
      key = json.key;
      params = json.params;
    }
    return { key: key, params: params, config: resolveI18nConfig(el) };
  }

  function resolveI18nConfig(el) {
    var attrConfig = el.attr("i18n-config");
    var config = {
      html: false
    };
    if (attrConfig) {
      var html = attrConfig.indexOf("html") != -1 ? true : false;
      config.html = html;
    }
    return config;
  }
}

/**
 * Remplaza el valor de Target por el de Source para las claves de Source.
 * 
 * @param {Object} obj Target
 * @param {Object} src Source
 */
export function extend(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });
  return obj;
}

export function currentLanguage() {
  var lang = chrome.i18n.getUILanguage();
  return lang;
}

export function getAcceptLanguages(callback) {
  chrome.i18n.getAcceptLanguages(callback);
}
