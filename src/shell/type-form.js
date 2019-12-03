"use strict";

/**
 * Muestra y ejecuta la carga de los tipos de formularios disponibles.
 */
export default class TypeForm {
  /**
   * Estado acutal de visibilidad.
   */
  isVisible = true;

  /**
   * Objeto de acceso a la selección de tipo.
   */
  display = {};

  /**
   * Ejecuta la función callback de selección.
   */
  selected = (function(self) {
    return function(evt) {
      // Opción seleccionada
      var option = $(self.display, "select")
        .find("option:selected")
        .val();
      if (option) {
        return self.selectedCallback(self.forms[option]);
      } else {
        console.warn("Option not selected");
      }
    };
  })(this);

  constructor(writeForm, readForm, callback, forms) {
    this.tag = readForm;
    this.tagInject = writeForm;
    this.forms = forms;
    this.selectedCallback = callback;

    this.setup();
  }

  /**
   * Muestra o oculta la selección de tipos formularios. 
   */
  showHide() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.display.hide();
    } else {
      this.display.show();
    }
  }

  /**
   * Configura el objeto permitiendo el correcto funcionamiento.
   */
  setup() {
    // Crea HTML que permite seleccionar un tipo de formulario.
    this.display = $("<div/>").css("display", "none");
    var cbo = $("<select/>");
    this.forms.forEach(function(form, index) {
      var op = $("<option/>", {
        text: form.type,
        value: index
      });
      cbo.append(op);
    }, this);
    this.display.append(cbo);

    var btn = $('<button type="button">');
    btn.click(this.selected);
    btn.html("➪");
    this.display.append(btn);

    //$(self.tag).append(self.display);
    //var eleParent = $('#'+self.tag).parent().eq(0);
    $(this.tagInject).append(this.display);
  }
}
