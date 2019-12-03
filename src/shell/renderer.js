"use strict";

// import Survey from '../vendor/survey/survey.jquery.min.js'
import { surveyOut as SurveyOut } from "./helper.js";

/**
 * Carga el formulario indicado con la información existente o por defecto.
 */
export default class Renderer {
  /**
   * HTML donde se encontrará el formulario.
   */
  readForm;

  /**
   * HTML donde escribir el elemento survey del formulario.
   */
  writeForm;

  /**
   * Objeto formulario {id, meta}.
   */
  form;

  /**
   * HTML donde escribir los datos resultantes del formulario {id, data}.
   * 
   * NOTA: Generalmente es el textarea donde está el formulario (this.readForm)
   */
  formOut;

  /**
   * Configuración del objeto Render.
   */
  settings;

  /**
   * Instancia de survey para uso interno.
   */
  _survey = null;

  constructor(
    elementWithForm,
    elementWriteForm,
    form,
    formSurveyOut,
    settings
  ) {
    this.readForm = elementWithForm;
    this.writeForm = elementWriteForm;
    this.form = form;
    this.formOut = formSurveyOut;
    this.settings = settings || { btnKill: true, surveyDataCheck: true };
  }

  /**
   * Creación y activación de objeto survey para mostrar el formulario.
   * 
   * @param {Object} settings 
   */
  show(settings) {
    let self = this;
    self.settings = Object.assign(self.settings, settings || {});

    // Creación de objeto Survey
    // Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    // Survey.defaultBootstrapCss.progressBar = "bar-green";
    // Survey.Survey.cssType = "bootstrap";
    // Survey.StylesManager.applyTheme("modern");

    var survey = new Survey.Model(self.form.meta);
    self._survey = survey;

    // Modo Edit o No Edit (display)
    if (self.settings.surveyMode) {
      self._survey.mode = self.settings.surveyMode;
    }
    // Si hay datos relacionados con el formulario a crear
    if (self.settings.surveyData) {
      self._survey.data = self.settings.surveyData;
    } else if (self.settings.surveyDataCheck) {
      if (self.formOut) {
        var txt = $(self.formOut).val() || $(self.formOut).text();
        var surveyData = SurveyOut.read(txt);
        if (surveyData && self.form.id == surveyData.id) {
          self._survey.data = surveyData.data;
        }
      }
    }

    /*
     * Creación de elemento donde mostrar el formulario survey.
     * 1 - Botones de manipulación en el formulario survey mostrado.
     */
    var surveyElementId = "surveyElement";
    var surveyElement = $("<div />").attr("id", surveyElementId);
    // Botón para eliminar formulario
    var closeBtn = $(
      '<button type="button" class="suverybtn-close-thik" />'
    ).click(function(evt) {
      $(surveyElement).empty();
    });
    // Botones para expandir o contraer formulario
    var expandBtn = $('<button type="button" class="suverybtn-expand" />');
    var hideBtn = $('<button type="button" class="suverybtn-hide" />');
    expandBtn.click(function(evt) {
      survey.koState("running");
      $(this).hide();
      hideBtn.show();
    });
    expandBtn.hide();
    hideBtn.click(function(evt) {
      survey.koState("completed");
      $(this).hide();
      expandBtn.show();
    });
    hideBtn.hide();
    // Incorpora formulario
    $(self.writeForm).append(surveyElement);
    // Función a ejecutar cuando complete el formulario.
    var complete = function(result) {
      self.bindSurveyOut(self.form.id, result.data);
      expandBtn.show();
      hideBtn.hide();
    };

    var panelRemoved = function(model, options) {
      console.log("Remove panel");
    };

    // jquery
    //$("#surveyElement").SurveyWindow({
    //OK: $("#surveyElement").Survey({
    $(surveyElement).Survey({
      model: survey,
      onComplete: complete,
      onPanelRemoved: panelRemoved
    });

    $(surveyElement).prepend(expandBtn);
    $(surveyElement).prepend(hideBtn);
    if (self.settings.btnKill) {
      $(surveyElement).prepend(closeBtn);
    }
  }

  /**
   * Muestra el resultado de operar en el formulario.
   * 
   * IMPORTANTE: Se debe indicar donde mostrar el resultado en el parámetro
   * de la instancia llamado 'formOut' (this.formOut)
   * 
   * @param {String} id Identificador del formulario utilizado.
   * @param {Object} data Datos ingresados en formulario.
   */
  bindSurveyOut(id, data) {
    var suveryData = SurveyOut.write(id, data);
    // Copia la salida para contar con esta luego.
    this._survey.surveyOut = suveryData;

    if (this.formOut) {
      var text = $(this.formOut).val();
      // if (text.indexOf("```suvery") != -1) {
      if (text.indexOf(SurveyOut.startObj) != -1) {
        text = text.replace(SurveyOut.regexObj, suveryData);
      } else {
        text += suveryData;
      }
      $(this.formOut).val(text);
    }
  }
}
