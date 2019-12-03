"use strict";

/**
 * Objeto almacenado.
 * 
 * {
 *   "id": "1-hash",
 *   "active": true,
 *   // JavaScript que permite reanudar funcionalidad o extenderla.
 *   "js": "setInterval(function(){$(\'#issue_tracker_id\').off(\'change\').on(\'change\', function(evt){setTimeout(function(){$.formInput.reload();},200);})},300);",
 *   // Sitio donde aplicar.
 *   "url": "http://redmine-ejemplo/./issues/(new)|[0-9]+",
 *   // JavaScript que devuelve los elementos HTML donde incluir funcionalidad. Por defecto toma los textarea.
 *   "finderTagHtml": "",
 *   // Formularios disponibles en el sitio.
 *   "forms": [
 *      { id: String único,
 *        type: String display,
 *        lock: Number Determina si puede ser borrado o no (indica la cantidad de veces utilizado),
 *        meta: Objeto Json de Survey
 *      }
 *   ]
 * }
 */
export class Source {
  /**Identificador univoco.*/
  id;

  /**Disponible o no.*/
  active = true;

  /**JavaScript que permite reanudar funcionalidad o extenderla. */
  js;

  /**Sitio/URL donde aplicar*/
  url;

  /**
   * JavaScript que devuelve los elementos HTML donde incluir funcionalidad.
   * Por defecto toma los textarea.
   */
  finderTagHtml;

  /**Formularios disponibles en el sitio (Array[SourceForm]).*/
  forms = [];
}

export class SourceForm {
  /**Identificador univoco.*/
  id;

  /**Etiqueta representativa del formulario.*/
  type;

  /**Determina si puede ser borrado o no (indica la cantidad de veces utilizado).*/
  lock = 0;

  /**Objeto Json de Survey.*/
  meta;
}
