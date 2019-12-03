"use strict";

import FormInput from "./form-input.js";
import { newConnector } from "../options/configuration.js";

/**
 * Carga la funcionalidad.
 * 
 * @autor janusky@gmail.com
 */
export function main() {
  var dataByUrl = null;
  var dataWork = null;
  var isActive = false;
  var urlActual = $(location).attr("href");

  try {
    // Chequea la url
    if (top.location && top.location != location) {
      urlActual = top.location.href;
    }
    console.debug("check url", urlActual);
    newConnector()
      .then(connector => {
        connector
          .findByUrl(urlActual)
          .then(dataByUrl => {
            $.each(dataByUrl, function (index, item) {
              if (item.active) {
                isActive = true;
                dataWork = item;
                return false; // Sale de $.each con la primer coincidencia
              }
            });

            // Guardar el objeto FormInput en jquery
            $.formInput = new FormInput();

            if (isActive === false) {
              console.debug("item deactivated");
            } else if (!dataWork) {
              console.debug("not data for the site");
            } else {
              $.formInput.build(dataWork);
            }

            // Carga el js si existe
            if (dataWork && dataWork.js) {
              setTimeout(function () {
                eval(dataWork.js);
              }, 500);
            }
          })
          .catch(err => {
            console.warn("fail findByUrl", urlActual);
            throw err;
          });
      })
      .catch(err => {
        console.warn(err);
      });
  } catch (ex) {
    console.warn(ex);
  }
  console.info("CLIENT-FORM-INPUT: load end");
}
