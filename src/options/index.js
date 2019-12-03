"use strict";

import { toggle, i18nLoad } from "./lib/helper.js";
import { buildConnector } from "./configuration.js";
import Connector from "../shell/connector.js";
import StorageLocal from "../shell/storage-local.js";
import Administrator from "./administrator.js";

/**
 * Permite cargar lo necesario para trabajar con la página index.html
 * 
 * x-editable: https://vitalets.github.io/x-editable/docs.html
 */
$(document).ready(function() {
  //$('body').bootstrapMaterialDesign();

  // X-Editable configuración general
  $.fn.editable.defaults.mode = "inline";

  i18nLoad();

  buildConnector()
    .then(connector => {
      var administrator = new Administrator(connector);
      connector
        .list()
        .then(resp => {
          administrator.renderSource(resp).then(() => {
            toggle();
          });
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
});
