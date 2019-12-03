"use strict";

import { i18nLoad, getAcceptLanguages, currentLanguage } from "./lib/helper.js";
import { showMessage } from "./lib/notification.js";
import { editable } from "./x-editable/helper.js";
import { Configuration, getStrategyDb } from "./configuration.js";

(function() {
  $.fn.editable.defaults.mode = "inline";

  i18nLoad();

  var avilableLanguages = ["es", "en"];
  var configuration = new Configuration();
  configuration
    .setup()
    .then(() => {
      renderSource(configuration.dataConfig);

      setLanguage();
    })
    .catch(err => {
      setTimeout(function() {
        showMessage(err);
      }, 5);
    });

  // Carga los datos en los elementos HTML.
  function renderSource(dataConfig) {
    let ctx = $("#divDatosExitentes").get(0);

    return new Promise((resolve, reject) => {
      // Recorre las claves del objeto almacenado
      let keysConfig = Object.keys(dataConfig);
      $.each(keysConfig, function(i, key) {
        let tag = $("[data-name='" + key + "']", ctx);
        if (tag.length > 0) {
          tag.attr("data-value", dataConfig[key]);
        }
      });
      // Que busque todos los elementos editables.
      setEditable(".editable", ctx, dataConfig);
    });
  }

  function setEditable(elements, ctx, dataConfig) {
    editable(elements, ctx, function(newValue, ele) {
      let eleKey = $(ele).attr("data-name");
      dataConfig[eleKey] = newValue;
      configuration
        .mergeDataConfig(dataConfig)
        .then(resp => {
          showMessage(`Se actualizó el objeto '${eleKey}'`);
        })
        .catch(err => {
          showMessage(err);
        });
    });
  }

  function setLanguage() {
    var languageCbo = $("#languages");
    var lang = currentLanguage();
    getAcceptLanguages(function(langs) {
      langs.forEach(function(l) {
        var option = new Option(l, l, false, lang.indexOf(l) == 0);
        var find = avilableLanguages.indexOf(l);
        if (find == -1) {
          $(option).attr("disabled", true);
        }
        languageCbo.append(option);
      }, this);
      //languageCbo.attr("disabled", true);
      languageCbo.show();
    });
  }
})();
