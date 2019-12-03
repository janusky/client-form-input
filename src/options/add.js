"use strict";

import { i18nLoad } from "./lib/helper.js";
import { showMessage } from "./lib/notification.js";
import { Source } from "../shell/model.js";
import { buildConnector } from "./configuration.js";
import Connector from "../shell/connector.js";

class SourceManager {
  constructor(connector) {
    this.connector = connector;
  }

  create(source) {
    return this.validate(source).then(err => {
      if (err && err.length !== undefined && err.length > 0) {
        throw new Error(err.join("<br/>"));
      }
      return this.connector.save(source);
    });
  }

  existUrl(url) {
    return this.connector.findUrlMatch(url).then(resp => {
      if (resp && resp.length !== undefined) {
        return resp.length > 0;
      }
      return resp !== null;
    });
  }

  existId(id) {
    return this.connector.getById(id).then(resp => {
      return id !== null;
    });
  }

  validate(source) {
    var errors = [];
    var promises = [];
    if (!source.url || source.url.length <= 6) {
      errors.push("Url is requerid");
    } else {
      promises.push(
        this.existUrl(source.url).then(exist => {
          if (exist) {
            errors.push("Url exists (duplicate)");
          }
        })
      );
    }
    if (source.id) {
      promises.push(
        this.existId(source.id).then(exist => {
          if (exist) {
            errors.push("Id exists (duplicate)");
          }
        })
      );
    }
    return Promise.all(promises).then(() => {
      return errors;
    });
  }
}

(function() {
  // $(document).ready(function() {});
  i18nLoad();

  buildConnector()
    .then(conn => {
      load(new SourceManager(conn));
    })
    .catch(err => {
      showMessage(err);
    });

  function load(sourceManager) {
    var form = $("#crearForm").get(0);
    var createBtn = $("#create", form);
    var msgForm = $("#msgForm");

    createBtn.click(function(evt) {
      var source = new Source();
      source.url = form.page.value;
      if (form.script.value) {
        source.js = form.script.value.replace(/"/g, "'");
      }
      if (form.finderTagHtml.value) {
        source.finderTagHtml = form.finderTagHtml.value.replace(/"/g, "'");
      }
      source.active = $(form.active).is(":checked");

      sourceManager
        .create(source)
        .then(() => {
          showMessage(`"Creación ${source.id}"`);
        })
        .catch(err => {
          msgForm.html(err.message);
          showMessage("FAIL<br/>" + err.message);
        });
    });
  }

  function clearForm() {
    var form = $("#crearForm").get(0);
    form.page.value = "";
    form.script.value = "";
    form.finderTagHtml.value = "";
    $(form.active).checked();
  }
})();
