"use strict";

import { showMessage } from "./lib/notification.js";
import { utils, i18n } from "../shell/helper.js";
import { Source } from "../shell/model.js";

//TODO 2019/10/31 - Migrar a ES6.
/**
 * Administra los datos almacenados en el plugin.
 * 
 * Herramientas que utiliza
 * x-editable
 *  - https://vitalets.github.io/x-editable/docs.html
 * 
 * @param {Connector} connector 
 */
export default function Administrator(connector) {
  this.connector = connector;

  var self = this;

  /**
   * Muestra los datos creando el HTML necesario para trabajar con ellos.
   * 
   * NOTA: Espera recibir un array de objetos tipo Source
   * 
   * @param {Source} source 
   */
  this.renderSource = function(source) {
    return new Promise((resolve, reject) => {
      if (!source) {
        reject("Fail renderSource: Data is null");
      }
      try {
        //FIXME 2019/03/14 - Remplazar combinando con el HTML
        var dataComponets = [];
        $.each(source, function(indexPpal, item) {
          var obj = item;
          var dataTableComponente = [];
          // 1- Datos principales.
          let tablePpal = $("<table />", {
            id: `{"id": "${obj.id}"}`,
            class: "table table-bordered table-striped"
          });
          tablePpal
            .append(
              $("<tr>")
                .append(
                  $("<td>", {
                    html: i18n.getMessage("addFieldUrl"),
                    class: "td-xs"
                  })
                    .append(
                      '<span class="help" data-toggle="popover" data-content="' +
                        i18n.getMessage("sourceFieldUrlH") +
                        '">?</span>'
                    )
                    .append(
                      $("<a>", {
                        id: "delete_doc",
                        class: "btn btn-danger btn-xs float-right",
                        "data-toggle": "tooltip",
                        title: i18n.getMessage("btnDeleteTitle")
                      }).html('<i class="fa fa-trash-o"></i>')
                    )
                )
                .append(
                  $("<td>", {
                    html: $("<a>", {
                      href: "#",
                      class: "myeditable",
                      "data-type": "text",
                      "data-name": "url",
                      "data-value": obj.url,
                      "data-original-title": "Sitio"
                    })
                  })
                )
            )
            .append(
              $("<tr>")
                .append(
                  $("<td>", {
                    html: i18n.getMessage("sourceFieldActive") + " "
                  })
                )
                .append(
                  $("<td>", {
                    html: $("<a>", {
                      href: "#",
                      class: "myeditable",
                      "data-type": "radiolist",
                      "data-value": obj.active ? "si" : "no",
                      "data-name": "active",
                      "data-source":
                        '[{value:"no", text:" ' +
                        i18n.getMessage("dicNo") +
                        '"},{value:"si", text:" ' +
                        i18n.getMessage("dicYes") +
                        '"}]'
                    })
                  })
                )
            )
            .append(
              $("<tr>")
                .append(
                  $("<td>", {
                    html: i18n.getMessage("sourceFieldFinderTagHtml") + " "
                  }).append(
                    '<span class="help" data-toggle="popover" data-content="' +
                      i18n.getMessage("sourceFieldFinderTagHtmlH") +
                      '">?</span>'
                  )
                )
                .append(
                  $("<td>", {
                    html: $("<a>", {
                      href: "#",
                      class: "myeditable script editorJS",
                      "data-type": "text",
                      "data-value": obj.finderTagHtml,
                      "data-name": "finderTagHtml"
                    })
                  })
                )
            )
            .append(
              $("<tr>")
                .append(
                  $("<td>", { html: "Script JS " }).append(
                    '<span class="help" data-toggle="popover" data-content="' +
                      i18n.getMessage("sourceFieldScriptH") +
                      '">?</span>'
                  )
                )
                .append(
                  $("<td>", {
                    html: $("<a>", {
                      href: "#",
                      class: "myeditable script editorJS",
                      "data-type": "textarea",
                      id: obj.id + "-js",
                      "data-value": obj.js,
                      "data-name": "js",
                      "data-original-title": "Enter data"
                    })
                  })
                )
            );

          // 2- Formularios
          if (!utils.isEmpty(obj.forms)) {
            var indexLastComponente = obj.forms.length - 1;
            $.each(obj.forms, function(indexForm, componente) {
              if (componente != null) {
                let newRow = componentAdd(item.id, componente, indexForm);
                tablePpal.append(newRow);
              }
            });
          }

          // 3- Terminar agrega botón de ADD 'form'
          let addRowData = $("<tr>").append(
            $("<td>", { colspan: "2" }).append(
              addContentButton(
                $("<a>", {
                  html: i18n.getMessage("btnAddForm"),
                  id: "add_contenido",
                  class: "float-right btn btn-default btn-raised"
                }),
                { id: obj.id }
              )
            )
          );
          tablePpal.append(addRowData);

          dataComponets.push(Object.assign({}, tablePpal));
        });

        var dataShow = $("#divDatosExitentes");
        dataComponets.forEach(function(ele, index) {
          dataShow.after(ele);
        });

        configureEditable();

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  //FIXME 2019/03/14 - Remplazar combinando con el HTML
  function componentAdd(objectId, componente, rowCount) {
    if ($.isEmptyObject(componente)) {
      componente = {
        id: "",
        type: "",
        meta: ""
      };
    }
    // Objeto con información útil para trabajar con el contenido
    //var contentObject = "'{\"id\":"+objectId+",\"formId\":"+componente.id+",\"rowId\":"+rowId+"}'";
    //var contentObject = "{\"id\":"+objectId+",\"formId\":"+componente.id+",\"rowId\":"+rowId+"}";
    var rowId = objectId + rowCount;
    var contentObject = {
      id: objectId,
      formId: componente.id,
      rowId: rowId,
      rowCount: rowCount
    };
    var contentObjectStr = JSON.stringify(contentObject);
    var btnDelete = deleteContentButton(
      $("<botton>", {
        id: "delete_contenido",
        "data-value": contentObjectStr,
        title: "Eliminar contenido",
        class: "btn btn-xs btn-danger"
      }).html('<i class="fa fa-trash-o"></i>'),
      contentObject
    );

    let fila = $("<tr>", { id: rowId, row: rowCount });
    let tdFirst = $("<td>", { colspan: "2", style: "padding:0px;" });
    fila.append(tdFirst); // Une TR con TD

    let tableFirst = $("<table>", {
      class: "table table-bordered table-hover",
      style: "margin-bottom:0px;",
      id: objectId
    });
    tdFirst.append(tableFirst); // Une TABLE con TD anterior

    let tableFirstTr1 = $("<tr>", { id: "addr0", class: "warning" });
    tableFirst.append(tableFirstTr1); // Une TABLE con TR

    let collapseID = new String("ID" + objectId + "_" + rowId).replace(
      /-|:/g,
      "_"
    );
    let tableFirstTr1Td1 = $('<td style="width:10%;">').append(
      $('<div class="panel-title" style="width:fit-content;">')
        .append(
          $("<a>", {
            "data-toggle": "collapse",
            "data-target": "#" + collapseID,
            class: "btn",
            title: "Hacer clic para ver o ocultar"
          }).html(rowCount)
        )
        .append(btnDelete)
    );

    tableFirstTr1.append(tableFirstTr1Td1); // Une TR con TD

    let tableFirstTr1Td2 = $("<td>", { id: collapseID, class: "collapse" });
    tableFirstTr1.append(tableFirstTr1Td2); // Une TR con segundo TD

    let tableContentTr1Td2 = $("<table>", {
      class: "table table-bordered table-striped",
      style: "margin-bottom:0px;",
      id: contentObjectStr
    });
    tableFirstTr1Td2.append(tableContentTr1Td2); // Une segundo TD con TABLE 2

    // Agrega en TABLE 2 los TR y TD en una sola linea
    tableContentTr1Td2
      .append(
        $("<tr>").append(
          $("<td>").append(
            $("<a>", {
              href: "#",
              class: "myeditable",
              id: contentObjectStr,
              "data-type": "text",
              "data-value": componente.id,
              "data-name": "form.id",
              "data-placeholder": i18n.getMessage("sourceFieldFormId"),
              "data-emptytext": i18n.getMessage("enterField", "ID")
            })
          )
        )
      )
      .append(
        $("<tr>").append(
          $("<td>").append(
            $("<a>", {
              href: "#",
              class: "myeditable",
              id: contentObjectStr,
              "data-type": "text",
              "data-value": componente.type,
              "data-name": "form.type",
              "data-placeholder": i18n.getMessage("sourceFieldFormType"),
              "data-emptytext": i18n.getMessage("enterField")
            })
          )
        )
      )
      .append(
        $("<tr>").append(
          $("<td>").append(
            $("<a>", {
              href: "#",
              class: "myeditable script editorJSON",
              id: contentObjectStr,
              "data-type": "textarea",
              "data-value":
                typeof componente.meta === "object"
                  ? JSON.stringify(componente.meta, null, "\t")
                  : componente.meta,
              "data-name": "form.meta",
              "data-placeholder": i18n.getMessage("enterField", "JSON"),
              "data-emptytext": i18n.getMessage("enterField", "Form JSON")
            })
          )
        )
      );
    return fila;
  }

  function addContentButton(ele, data) {
    $(ele).click(function(ev) {
      var trAdd = $(this)
        .closest("tr")
        .prev("tr");
      var rowId = parseInt(trAdd.attr("row")) + 1;

      var newRow = componentAdd(data.id, null, rowId);

      configureEditable(newRow);

      $(trAdd).after(newRow);
    });
    return ele;
  }

  // Elimina el formulario del objeto indicado.
  function deleteContentButton(ele, data) {
    // $('a[id="'+objId+'"]')
    $(ele).click(function(ev) {
      // Chequea si es un elemento guardado.
      if (data.formId) {
        deleteContentConfirm(data.id, data.formId, data.rowId)
          .then(resp => {
            if (resp === true) {
              deleteContentRow(data.rowId);
            }
          })
          .catch(err => {
            showMessage(err);
          });
      } else {
        deleteContentRow(data.rowId);
      }
    });
    return ele;
  }

  function deleteContentRow(rowId) {
    var trRowId = $("tr#" + rowId);
    if (trRowId.length > 0) {
      $(trRowId).remove();
    }
  }

  function configureEditable(findContext) {
    if (!findContext) {
      findContext = document;
    }

    editableScript(".script", findContext);

    editableEditorJS(".editorJS", findContext);

    editableEditorJSON(".editorJSON", findContext);

    editableDefault(".myeditable", findContext);
  }

  function editableScript(ele, ctx) {
    if (!ctx) {
      ctx = document;
    }
    return $(ele, ctx).editable({
      display: function(value) {
        if (!value) {
          $(this).empty();
          return;
        }
        var valueText = value;
        if (typeof value === "object") {
          valueText = JSON.stringify(value, null, "\t");
        } else if (utils.isJSON(value)) {
          valueText = JSON.stringify($.parseJSON(value), null, "\t");
        }
        var dvEditor = $("<div>");
        var divValue = dvEditor.text(valueText);
        divValue.css("max-height", "65px");
        divValue.css("overflow-y", "overlay");
        $(this).html(divValue);
      }
    });
  }

  function editableEditorJS(ele, ctx) {
    if (!ctx) {
      ctx = document;
    }
    $(ele, ctx).on("shown", function(index, editable) {
      setTimeout(function() {
        var editor = null;
        var inputEditable = editable.input.$input.get(0);

        editor = ace.edit(inputEditable);

        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        //editor.setAutoScrollEditorIntoView(true);
        editor.setOptions({
          minLines: 20,
          maxLines: 35
        });
        editor.getSession().setTabSize(2);
        editor.getSession().on("change", function() {
          var valueStr = editor
            .getSession()
            .getValue()
            .replace(/"/g, "'");
          $(inputEditable).val(valueStr);
        });
      }, 1);
    });
    return ele;
  }

  function editableEditorJSON(ele, ctx) {
    if (!ctx) {
      ctx = document;
    }
    $(ele, ctx).on("shown", function(i, editable) {
      var editor = null;
      var inputEditable = editable.input.$input.get(0);

      if (typeof editable.value === "object") {
        $(inputEditable).val(JSON.stringify(editable.value, null, "\t"));
      } else if (utils.isJSON(editable.value)) {
        $(inputEditable).val(
          JSON.stringify($.parseJSON(editable.value), null, "\t")
        );
      }

      editor = ace.edit(inputEditable);
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/json");
      //editor.setAutoScrollEditorIntoView(true);
      editor.setOptions({
        minLines: 5,
        maxLines: 30
      });
      editor.getSession().setTabSize(2);
      //editor.getSession().setUseWrapMode(true);
      editor.getSession().on("change", function() {
        var valueStr = editor.getSession().getValue();
        if (utils.isJSON(valueStr)) {
          $(inputEditable).val(JSON.stringify($.parseJSON(valueStr)));
        } else {
          $(inputEditable).val(valueStr);
        }
      });
    });
    return ele;
  }

  function editableDefault(ele, ctx) {
    if (!ctx) {
      ctx = document;
    }

    $(ele, ctx).editable({});

    //automatically show next editable
    $(ele, ctx).on("hidden", function(e, reason) {
      if (reason === "save" || reason === "nochange") {
        var item = $(this)
          .closest("td")
          .next()
          .find(".myeditable");
        if (item.length == 0) {
          // check the next row
          item = $(this)
            .closest("tr")
            .next()
            .find(".myeditable");
        }
        if (item.length > 0) {
          if (item.length > 1) {
            item = $(item.get(0));
          }
          setTimeout(function() {
            item.editable("show");
          }, 200);
        }
      }
    });

    /*
      requiredValue('url');
    */

    $(ele, ctx).on("save", function(e, params) {
      var oldValue = $(this).text();
      if (oldValue !== params.newValue) {
        //Se toma el identificador del documento
        var dataFormElement = this;
        var dataFormJson = getDataForm(this);
        var field = $(this).attr("data-name");
        var saveObj = {};
        var newValue = params.newValue;

        // Si es un tipo boolean
        if (newValue === "si" || newValue === "no") {
          newValue = newValue === "si" ? true : false;
        } else if (utils.isJSON(newValue)) {
          newValue = $.parseJSON(newValue);
        }
        // Si es un field contenido
        if (field.indexOf(".") != -1) {
          var objLocation = {};
          var fielLocation = field.split(".");
          objLocation["" + fielLocation[0] + ""] = {};
          for (var i = 1; i < fielLocation.length; i++) {
            if (i + 1 === fielLocation.length) {
              Object.values(objLocation)[0][
                "" + fielLocation[i] + ""
              ] = newValue;
            } else {
              Object.values(objLocation)[0]["" + fielLocation[i] + ""] = {};
            }
          }
          if (fielLocation[0] !== "form") {
            saveObj["source"] = objLocation;
          } else {
            saveObj = objLocation;
          }
        } else {
          var mergeValue = {};
          mergeValue[field] = newValue;
          saveObj["source"] = mergeValue;
        }
        saveObj.objectId = dataFormJson.id;
        saveObj.formId = dataFormJson.formId;

        self.connector
          .merge(saveObj)
          .then(resp => {
            if (resp) {
              // Pone el id en el objeto html
              if (!dataFormJson.formId && saveObj.form) {
                dataFormJson["formId"] = saveObj.form.id;
                setDataForm(dataFormElement, dataFormJson);
              }
              showMessage(i18n.getMessage("notify010", saveObj.objectId));
            }
          })
          .catch(err => {
            showMessage(err);
          });
      }
    });

    return ele;
  }

  function getDataForm(ele) {
    var dataFormJson = null;
    var dataForm = $(ele)
      .parents("table:first")
      .attr("id");
    if (dataForm) {
      dataFormJson = $.parseJSON(dataForm);
    } else {
      dataFormJson = $.parseJSON($(ele).attr("id"));
    }
    return dataFormJson;
  }

  function setDataForm(ele, dataJson) {
    var jsonStr = JSON.stringify(dataJson);
    $(ele)
      .parents("table:first")
      .attr("id", jsonStr);
    $(ele).attr("id", jsonStr);
  }

  function requiredValue(element) {
    //required
    var referencias = $("#divDatosExitentes").find(
      'a[data-name="' + element + '"]'
    );
    $.each(referencias, function(index, item) {
      $(item).editable("option", "validate", function(v) {
        if (typeof v == "object" && utils.isEmpty(v)) {
          return "Required all fields!";
        } else {
          if (typeof propValue != "boolean" && $.isEmptyObject(v)) {
            return "Required field!";
          }
        }
      });
    });
  }

  function deleteContentConfirm(objId, componentId, componentIndex) {
    var title = i18n.getMessage("notifyDeleteTitle");
    var message = i18n.getMessage("notifyDeleteMessage");

    return showModalConfirm(title, message).then(resp => {
      if (resp == true) {
        return deleteContentDao(objId, componentId, componentIndex);
      }
      return Promise.resolve(resp);
    });
  }

  function deleteContentDao(objId, componentId) {
    //1- Recupera el objeto
    //2- Elimina el formulario con 'id' y 'indice'
    return self.connector.getById(objId).then(objFind => {
      var objFindValues = null;
      if (objFind == null) {
        error009;
        return new Error(i18n.getMessage("error009", objId));
      }
      objFindValues = Object.values(objFind)[0];

      var componentIndex = objFindValues.forms.findIndex(f => {
        return f.id === componentId;
      });
      if (componentIndex >= 0) {
        // Si no se puede borrar
        if (isLockForm(objFindValues.forms[componentIndex])) {
          return new Error(i18n.getMessage("error010"));
        }
        objFindValues.forms.splice(componentIndex, 1);
        return self.connector.save(objFind);
      } else {
        return new Error(i18n.getMessage("error011", [componentId, objId]));
      }
    });
  }

  // isLockForm Determina si el formulario está bloqueado por ser utilizado.
  function isLockForm(form) {
    return form.lock > 0;
  }

  /**
     * Muestra un dialogo modal para confirmar.
     * 
     * NOTA: Ver otro ejemplo https://learnersbucket.com/examples/bootstrap4/custom-confirm-box-with-bootstrap/
     * 
     * @param {String} title 
     * @param {String} message 
     * @return Promise : true si clic en Confirmar, false si 'close'
     */
  function showModalConfirm(title, message) {
    var title = title || "Information";
    var message = message || "Indicate if you want to continue";
    var popUp = $("#messageConfirm");
    popUp.on("show.bs.modal", function(event) {
      var modal = $(this);
      modal.find(".modal-title").text(title);
      modal.find(".modal-body").html(message);
    });
    return new Promise((resolve, reject) => {
      popUp.find("#closeBtn").click(function(e) {
        popUp.modal("hide");
        resolve(false);
      });
      popUp.find("#confirmBtn").click(function(e) {
        popUp.modal("hide");
        resolve(true);
      });
      //popUp.on('hidden.bs.modal', function (e) {
      //    resolve(false);
      //});
      popUp.modal("show");
    });
  }
}
