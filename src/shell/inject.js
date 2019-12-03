"use strict";

import Renderer from "./renderer.js";
import TypeForm from "./type-form.js";

/**
 * Incorpora la funcionalidad en el tag indicado.
 * Permite mostrar los tipos de formularios.
 */
export default class Inject {
  /**
   * HTML donde se encontrará el formulario.
   */
  readForm;

  /**
   * HTML donde escribir HTML this.surveyOut.
   */
  writeForm;

  /**
   * Formularios posibles a ser inyectados.
   */
  forms;

  typeForm = {};
  currentRenderer = {};

  /**
   * Muestra el formulario tipo Survey.
   */
  selectedCallback = (function(self) {
    return function(form) {
      self.currentRenderer = new Renderer(
        self.readForm,
        self.writeForm,
        form,
        self.readForm
      );
      self.currentRenderer.show();
    };
  })(this);

  showForms = (function(self) {
    return function() {
      self.typeForm.showHide();
    };
  })(this);

  // clear Elimina todo lo relacionado con esta instancia.
  clear = (function(self) {
    return function() {
      $(self.readForm).empty();
    };
  })(this);

  constructor(tagReadForm, tagWriteForm, forms) {
    this.readForm = tagReadForm;
    this.writeForm = tagWriteForm;
    this.forms = forms;

    this.setup();
  }

  /**
   * Prepara la instancia.
   */
  setup() {
    this.typeForm = new TypeForm(
      this.writeForm,
      this.readForm,
      this.selectedCallback,
      this.forms
    );
    //TODO 2019/01/31 - Detectar existente leyendo el contenido y permitir la edición.
  }
}
