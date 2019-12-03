"use strict";

import Renderer from "./renderer.js";

/*
 * new Detect()
 * process() - Invocar renderizado de formulario
 *     private Renderer.setData(detected()).show()
 *     private detected() - Detectar inicio y find de formulario
 * active() - Disponibilizar activa/desactivar renderizado
 */
/**
 * Permite mostrar la información renderizada en el formulario correspondiente.
 * 
 * NOTA: Se recomienda tener un comportamiento similar a makdown.
 */
export default class Detect {
  /**
   * Elemento HTML contenedor del formulario detectado.
   */
  tagHtml;

  /**
   * Objeto formulario utilizado.
   */
  form;

  /**
   * Objeto con los valores asignados en el formulario.
   */
  formData;

  /**
   * Mostrarse de modo automático.
   */
  showAuto;

  _renderer = null;

  constructor(tagElement, formRead, formData, showAuto) {
    this.tagHtml = tagElement;
    this.form = formRead;
    this.formData = formData;
    this.showAuto = showAuto || true;
  }

  process() {
    // Busca el div anterior referente a la representación survey.
    var dvParent = $(this.tagHtml)
      .parent()
      .eq(0);

    // Donde existe el contenido survey es referencia para la salida
    // Data & Write (dvParent,dvParent)
    // Tipo readOnly (surveyMode: "display")
    // Data for survey (surveyData: this.formData)
    this._renderer = new Renderer(dvParent, dvParent, this.form, null, {
      surveyMode: "display",
      surveyData: this.formData,
      btnKill: false
    });
    // Si debe mostrarlo por defecto.
    if (this.showAuto) {
      this._renderer.show();
    }
  }

  // clear Elimina todo lo relacionado con esta instancia.
  clear() {
    $(this._renderer.writeForm).empty();
  }
}
