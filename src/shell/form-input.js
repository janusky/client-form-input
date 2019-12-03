"use strict";

import { utils, surveyOut as SurveyOut } from "./helper.js";
import { Source, SourceForm } from "./model.js";
import Detect from "./detect.js";
import Inject from "./inject.js";

/**
 * Administra el inicio del módulo shell.
 */
export default class FormInput {
  /**Fuente de datos utilizada en construcción.*/
  dataWork = null;

  /**Elementos HTML encontrados como Inject (loadInject(...)).*/
  injectElement = null;

  /**Elementos HTML encontrados como read-only (detectReadOnly(...)).*/
  detectElement = null;

  constructor() {}

  /**
   * Recarga la instancia.
   */
  reload() {
    this.build(this.dataWork);
  }

  /**
   * Detectar formularios y mostrarlos en modo read-only.
   * 
   * @param {SourceForm} forms Tipos de formularios
   * @param {Array} excludeTags Elemento HTML que debe excluir
   */
  detectReadOnly(forms, excludeTags) {
    var self = this;
    self.detectElement = [];

    //var find = $('div:contains("```suvery")');
    var find = [];
    $("*").filter(function() {
      // $(this).children().children()
      if (
        $(this).children().length === 1 &&
        $(this).text().indexOf("suvery") != -1 &&
        $(this).children().children().length === 0
      ) {
        var add = this;
        // Vuelve a chequear si tiene el texto buscado
        // Agrega si no existe
        if ($(add).text().indexOf("suvery") != -1 && find.indexOf(this) == -1) {
          find.push(add);
        }
      }
    });
    
    find.forEach(function(element) {
      // Registra procesados (para evitar repetidos)
      var tagProcess = [];
      var tag = element;
      var tagTextHash = $(tag).text().length;
      if (!exclude(tag) && tagProcess.indexOf(tagTextHash) == -1) {
        var objOut = SurveyOut.read($(tag).text());
        var form = findForm(objOut.id);
        var detect = new Detect(tag, form, objOut.data);

        detect.process();

        self.detectElement.push(detect);

        tagProcess.push(tagTextHash);
      }
    });

    // exclude Si el tag se encuentra cargado por `Inject`
    function exclude(tag) {
      for (var i = 0; i < excludeTags.length; i++) {
        if (excludeTags[i].id === tag.id || excludeTags[i].name === tag.name) {
          return true;
        }
      }
      return false;
    }

    function findForm(id) {
      for (var i = 0; i < forms.length; i++) {
        if (forms[i].id === id) {
          return forms[i];
        }
      }
      return null;
    }
  }

  /**
   * Construye la instancia con los datos recibidos.
   * 
   * @param {Source} dataWork Fuente de datos
   */
  build(dataWork) {
    this.clear();

    this.injectElement = [];
    this.dataWork = dataWork;

    // 1- Permitir incorporar formulario
    // Si hay un javascript para buscar lo ejecuta si no toma los textarea.
    findElements(dataWork.finderTagHtml).then(elements => {
      var excludeTags = loadInject(elements, this);

      this.detectReadOnly(dataWork.forms, excludeTags);
    });

    function loadInject(elements, formInput) {
      // Elementos HTML incorporados como `Inject`.
      var excludeTags = [];

      $.each(elements, function(index, tag) {
        var tagInject = $("<div />");

        excludeTags.push(tag);

        // Busca el div del textarea
        //var tagWrap = $(tag).closest('div');
        var tagWrap = null;
        var tagClosest = tag;
        while (tagWrap == null) {
          var find = $(tag).closest("div");
          var isVisible = find.attr("display");
          if (isVisible !== "none" && isVisible !== "hidden") {
            tagWrap = find;
          } else {
            tagClosest = find;
          }
        }

        // Colocar botón para mostrar tipos de formularios
        var imgURL = chrome.extension.getURL("shell/images/btn.png");
        var btn = $('<button type="button">')
          .css("background-image", "url(" + imgURL + ")")
          .css("background-size", "cover")
          .css("background-repeat", "no-repeat")
          .css("width", "23px")
          .css("height", "25px");
        tagInject.append(btn);

        tagWrap.prepend(tagInject);

        var inject = new Inject(tag, tagInject, dataWork.forms);
        btn.click(inject.showForms);

        formInput.injectElement.push(inject);
      });

      return excludeTags;
    }

    // Busca los elementos HTML textarea o según lo indicado en script finderTagHtml
    function findElements(finderTagHtml) {
      var fn = function() {
        if (finderTagHtml) {
          return eval(finderTagHtml);
        } else {
          return $("textarea");
        }
      };
      var resp = fn();
      // Si no encuentra elementos intenta luego de unos segundos.
      if (resp && resp.length < 1) {
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            resolve(fn());
          }, 2000);
        });
      } else {
        return Promise.resolve(resp);
      }
    }
  }

  /**
   * Limpia la instancia.
   */
  clear() {
    if (this.injectElement) {
      for (i = 0; i < this.injectElement.length; i++) {
        this.injectElement[i].clear();
      }
      this.injectElement = null;
    }
    if (this.detectElement) {
      for (i = 0; i < this.detectElement.length; i++) {
        this.detectElement[i].clear();
      }
      this.detectElement = null;
    }

    this.dataWork = null;
  }
}
