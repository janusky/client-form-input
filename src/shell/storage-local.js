"use strict";

import { Source } from "./model.js";
import { largeSync } from "../vendor/chrome-storage-largeSync.js";
import ChromeStoragePromise from "../vendor/chrome-storage-promise.js";
import { Storage, SCHEMA_DATA } from "./connector.js";
import { utils as Utils, uuid as UUID } from "./helper.js";

/**
 * Representa el almacenamiento local.
 * 
 * Utiliza como clave principal el valor provisto por this.keyData (SCHEMA_DATA).
 * Dentro de la cave almacena objetos cuya clave es el identificador único.
 * 
 * INFO
 *  https://developer.chrome.com/apps/storage
 *  https://developer.chrome.com/extensions/storage
 *  https://github.com/akiomik/chrome-storage-promise
 */
//TODO 2019/10/21 - Utilizar otro medio de almacenamiento que sea más limpio/claro.
export default class StorageLocal extends Storage {
  storageStrategy;
  countData;
  keyData;

  constructor(strategy, keyData) {
    super();

    this.storageStrategy = new StorageStrategy(strategy);
    this.keyData = keyData || SCHEMA_DATA;
    this.countData = 0;
  }

  setup() {
    let dataInit = {};
    dataInit[this.keyData] = {};
    //DEV: this.storageStrategy.clear();
    // Si no existe la clave principal la crea vacía.
    return this.storageStrategy.get(this.keyData).then(data => {
      if (!data || Object.keys(data).length === 0) {
        return this.storageStrategy.set(dataInit).then(() => {
          return true;
        });
      }
      // Guarda información para el objeto
      this.countData = Object.keys(Object.values(data)[0]).length;
      //DEV: this._initTEST();
      return true;
    });
  }

  //DEV: Datos de prueba
  getHardData() {
    return [
      {
        update_at: new Date(),
        order: 1,
        id: "1-hash",
        active: true,
        // JavaScript que permite reanudar funcionalidad o extenderla.
        js:
          "setInterval(function(){$('#issue_tracker_id').off('change').on('change', function(evt){setTimeout(function(){$.formInput.reload();},200);})},300);",
        // Sitio donde aplicar.
        url: "http://demo.redmine.org/.*?issues/([0-9]+|new)",
        // JavaScript que devuelve los elementos HTML donde incluir funcionalidad. Por defecto toma los textarea.
        finderTagHtml: "",
        // Formularios disponibles en el sitio.
        forms: [
          {
            id: "enableService",
            type: "Enable Service",
            lock: 0,
            meta: {
              locale: "es",
              pages: [
                {
                  name: "service",
                  elements: [
                    {
                      type: "paneldynamic",
                      name: "Indicate service data",
                      isRequired: true,
                      templateElements: [
                        {
                          type: "text",
                          name: "service",
                          title: "Service Identifier",
                          isRequired: true
                        },
                        {
                          type: "dropdown",
                          name: "type",
                          title: "Type",
                          choices: [
                            {
                              value: "item1",
                              text: "web"
                            },
                            {
                              value: "item2",
                              text: "mobile"
                            },
                            {
                              value: "item3",
                              text: "otro"
                            }
                          ]
                        },
                        {
                          type: "dropdown",
                          name: "ambient",
                          startWithNewLine: false,
                          title: "Ambient",
                          choices: [
                            {
                              value: "item1",
                              text: "production"
                            },
                            {
                              value: "item2",
                              text: "development"
                            }
                          ]
                        },
                        {
                          type: "text",
                          name: "protal",
                          title: "Portal"
                        },
                        {
                          type: "text",
                          name: "group",
                          startWithNewLine: false,
                          title: "Group"
                        },
                        {
                          type: "text",
                          name: "description",
                          title: "Description"
                        },
                        {
                          type: "dropdown",
                          name: "level",
                          title: "Level",
                          choices: [
                            {
                              value: "item1",
                              text: "1"
                            },
                            {
                              value: "item2",
                              text: "2"
                            },
                            {
                              value: "item3",
                              text: "3"
                            }
                          ]
                        },
                        {
                          type: "dropdown",
                          name: "authorization",
                          startWithNewLine: false,
                          title: "Authorization",
                          choices: [
                            {
                              value: "item1",
                              text: "Department"
                            },
                            {
                              value: "item3",
                              text: "Office"
                            }
                          ]
                        },
                        {
                          type: "checkbox",
                          name: "filters",
                          startWithNewLine: false,
                          title: "has filters",
                          choices: [
                            {
                              value: "Yes",
                              text: "Yes"
                            },
                            {
                              value: "No",
                              text: "No"
                            }
                          ]
                        },
                        {
                          type: "multipletext",
                          name: "autorizante",
                          title: "Indicar Autorizante",
                          items: [
                            {
                              name: "autorizante_tipo",
                              title: "Tipo"
                            },
                            {
                              name: "autorizante_ultimo",
                              title: "Último"
                            }
                          ]
                        },
                        {
                          type: "text",
                          name: "rules",
                          title: "Rules Administrator",
                          placeHolder: {
                            default: "System Departament ...",
                            es: "Dpto. Sistemas"
                          }
                        }
                      ],
                      panelCount: 1
                    }
                  ],
                  questionTitleLocation: "left",
                  questionsOrder: "initial"
                }
              ],
              showCompletedPage: false
            }
          },
          {
            id: "feedback",
            type: "Feedback",
            lock: 0,
            meta: {
              title: "Product Feedback Survey Example",
              showProgressBar: "top",
              pages: [
                {
                  questions: [
                    {
                      type: "matrix",
                      name: "Quality",
                      title:
                        "Please indicate if you agree or disagree with the following statements",
                      columns: [
                        {
                          value: 1,
                          text: "Strongly Disagree"
                        },
                        {
                          value: 2,
                          text: "Disagree"
                        },
                        {
                          value: 3,
                          text: "Neutral"
                        },
                        {
                          value: 4,
                          text: "Agree"
                        },
                        {
                          value: 5,
                          text: "Strongly Agree"
                        }
                      ],
                      rows: [
                        {
                          value: "affordable",
                          text: "Product is affordable"
                        },
                        {
                          value: "does what it claims",
                          text: "Product does what it claims"
                        },
                        {
                          value: "better then others",
                          text:
                            "Product is better than other products on the market"
                        },
                        {
                          value: "easy to use",
                          text: "Product is easy to use"
                        }
                      ]
                    },
                    {
                      type: "rating",
                      name: "satisfaction",
                      title: "How satisfied are you with the Product?",
                      mininumRateDescription: "Not Satisfied",
                      maximumRateDescription: "Completely satisfied"
                    },
                    {
                      type: "rating",
                      name: "recommend friends",
                      visibleIf: "{satisfaction} > 3",
                      title:
                        "How likely are you to recommend the Product to a friend or co-worker?",
                      mininumRateDescription: "Will not recommend",
                      maximumRateDescription: "I will recommend"
                    },
                    {
                      type: "comment",
                      name: "suggestions",
                      title:
                        "What would make you more satisfied with the Product?"
                    }
                  ]
                },
                {
                  questions: [
                    {
                      type: "radiogroup",
                      name: "price to competitors",
                      title:
                        "Compared to our competitors, do you feel the Product is",
                      choices: [
                        "Less expensive",
                        "Priced about the same",
                        "More expensive",
                        "Not sure"
                      ]
                    },
                    {
                      type: "radiogroup",
                      name: "price",
                      title:
                        "Do you feel our current price is merited by our product?",
                      choices: [
                        "correct|Yes, the price is about right",
                        "low|No, the price is too low for your product",
                        "high|No, the price is too high for your product"
                      ]
                    },
                    {
                      type: "multipletext",
                      name: "pricelimit",
                      title: "What is the... ",
                      items: [
                        {
                          name: "mostamount",
                          title:
                            "Most amount you would every pay for a product like ours"
                        },
                        {
                          name: "leastamount",
                          title:
                            "The least amount you would feel comfortable paying"
                        }
                      ]
                    }
                  ]
                },
                {
                  questions: [
                    {
                      type: "text",
                      name: "email",
                      title:
                        "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the Submit button."
                    }
                  ]
                }
              ]
            }
          },
          {
            id: "programming_lang",
            type: "Programming languages",
            lock: 0,
            meta: {
              questions: [
                {
                  type: "matrixdynamic",
                  addRowText: "Add language",
                  columns: [
                    {
                      name: "Language",
                      choices: [
                        "Javascript",
                        "Java",
                        "Python",
                        "CSS",
                        "PHP",
                        "Ruby",
                        "C++",
                        "C",
                        "Shell",
                        "C#",
                        "Objective-C",
                        "R",
                        "VimL",
                        "Go",
                        "Perl",
                        "CoffeeScript",
                        "TeX",
                        "Swift",
                        "Scala",
                        "Emacs List",
                        "Haskell",
                        "Lua",
                        "Clojure",
                        "Matlab",
                        "Arduino",
                        "Makefile",
                        "Groovy",
                        "Puppet",
                        "Rust",
                        "PowerShell"
                      ],
                      cellType: "dropdown",
                      isRequired: true,
                      hasOther: true,
                      choicesOrder: "asc"
                    },
                    {
                      name: "Experience",
                      choices: [
                        "One year or less",
                        "From one two three years",
                        "From three to five years",
                        "More then five years"
                      ],
                      cellType: "dropdown",
                      isRequired: true
                    }
                  ],
                  isRequired: true,
                  name: "languages",
                  rowCount: 1,
                  title: "What programming languages do you know?"
                }
              ]
            }
          }
        ]
      }
    ];
  }

  /**
   * Devuelve todos los valores para la clave principal (this.keyData).
   */
  getAll() {
    return this.storageStrategy.get(this.keyData).then(data => {
      return Object.values(data)[0];
    });
  }

  /**
   * Creación de un objeto fuente de datos (nuevo formulario).
   * 
   * @param {Source} data 
   */
  persist(data) {
    if (!data) {
      throw new Error("Error: No value 'data' specified");
    }
    var saveObj = {};
    var objValue = Object.values(data)[0];
    if (
      Utils.isEmpty(data.id) &&
      (Utils.isEmpty(objValue) || Utils.isEmpty(objValue.id))
    ) {
      //Create
      this.countData++;
      data.id = this.countData + "-" + UUID.create();
      saveObj[data.id] = data;
    }
    return this._saveImpl(saveObj);
  }

  /**
   * Actualiza el objeto interpretando que ya fue alterado y identificado.
   * 
   * @param {Source} updateObj 
   */
  update(updateObj) {
    if (!updateObj) {
      throw new Error("Error: No value 'data' specified");
    }
    //TODO: Chequeo de actualización.
    return this._saveImpl(updateObj);
  }

  /**
   * Identifica el objeto y impacta los cambios recibidos.
   * 
   * @param {Source} data 
   */
  merge(data) {
    if (!data) {
      throw new Error("Error: No value 'data' specified");
    }
    var objId = data.objectId || data.id;
    return this.get(objId).then(find => {
      if (Object.keys(find).length > 1) {
        throw new Error("Fail: Many to row id=" + objId);
      }
      if (find == null || Object.values(find).length === 0) {
        throw new Error("Fail: Not found data for id=" + objId);
      }
      var findValues = Object.values(find)[0];
      if (data.form) {
        if (!data.formId) {
          findValues.forms.push(data.form);
        } else {
          var formEdit = findValues.forms.find(f => {
            return f.id === data.formId;
          });
          this.extend(formEdit, data.form);
        }
      } else if (data.source) {
        this.extend(findValues, data.source);
      } else {
        this.extend(findValues, data);
      }
      return this._saveImpl(find);
    });
  }

  /**
   * Recupera los datos para la clave principal (this.keyData) y filtra 
   * por key (obj.id==keyId).
   * 
   * @param {String} keyId 
   */
  get(keyId) {
    if (!keyId) {
      throw new Error("Error: No value 'keyId' specified");
    }
    return this.storageStrategy.get(this.keyData).then(data => {
      let dataValue = Object.values(data)[0];
      let resp = null;
      if (dataValue) {
        resp = {};
        resp[keyId] = dataValue[keyId];
      }
      return resp;
    });
  }

  // Recupera por schema y luego impacta los cambios en la clave adecuada.
  _saveImpl(saveObj) {
    let keyData = this.keyData;
    return this.storageStrategy.get(keyData).then(data => {
      if (!data || Object.keys(data).length === 0) {
        throw new Error(`"Not data found for key ${keyData}"`);
      }
      // Procede a impactar el cambio.
      let dataValue = Object.values(data)[0];
      dataValue[Object.keys(saveObj)[0]] = Object.values(saveObj)[0];
      return this.storageStrategy.set(data).then(resp => {
        this.countData = Object.keys(Object.values(data)).length;
        return true;
      });
    });
  }

  /**
   * Actualiza las claves del objeto Destino según las claves indicadas en 
   * el objeto Origen.
   * 
   * @param {Object} obj Destino para actualizar
   * @param {*} src Origen de datos
   */
  extend(obj, src) {
    Object.keys(src).forEach(function(key) {
      obj[key] = src[key];
    });
    return obj;
  }

  _initTEST() {
    var self = this;
    var data = self.getHardData();
    var process = [];

    data.forEach(function(ele, index) {
      var s = {};
      s[ele.id] = ele;
      process.push(self._saveImpl(s));
    });
    return Promise.all(process);
  }
}

/**
 * Tipos de almacenamiento.
 */
export const StrategyDB = Object.freeze({
  SYNC: "sync",
  LOCAL: "local",
  MANAGED: "managed",
  LARGE_SYNC: "largeSync"
});

/**
 * Interface de estrategia de almacenamiento.
 */
export class StorageStrategy {
  /**
   * Constructor con estrategia.
   * 
   * @param {StrategyDB} strategy 
   */
  constructor(strategy = StrategyDB.SYNC) {
    this.strategy = strategy;
    this.storage = null;

    this.setup();
  }

  static strategyDefault() {
    return StrategyDB.SYNC;
  }

  setup() {
    switch (this.strategy) {
      case StrategyDB.SYNC:
        this.storage = ChromeStoragePromise.sync;
        break;
      case StrategyDB.LOCAL:
        this.storage = ChromeStoragePromise.local;
        break;
      case StrategyDB.managed:
        this.storage = ChromeStoragePromise.local;
        break;
      //TODO 2019/10/30 - LARGE_SYNC No sé si funciona.
      case StrategyDB.LARGE_SYNC:
        //this.storage = window.chrome.storage.largeSync;
        this.storage = largeSync;
        break;
      default:
        this.storage = ChromeStoragePromise.sync;
        this.strategy = StrategyDB.SYNC;
        break;
    }
  }

  get(keys) {
    return this.storage.get(keys);
  }
  set(items) {
    return this.storage.set(items);
  }
  getBytesInUse(keys) {
    return this.storage.getBytesInUse(keys);
  }
  remove(keys) {
    return this.storage.remove(keys);
  }
  clear() {
    return this.storage.clear();
  }

  /*
  //SOLVE: QUOTA_BYTES_PER_ITEM
  function syncSet(key, objectToStore, callback) {
    var jsonstr = JSON.stringify(objectToStore);
    var i = 0;
    var storageObj = {};

    // split jsonstr into chunks and store them in an object indexed by `key_i`
    while(jsonstr.length > 0) {
        var index = key + "_" + i++;

        // since the key uses up some per-item quota, see how much is left for the value
        // also trim off 2 for quotes added by storage-time `stringify`
        var valueLength = chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 2;

        // trim down segment so it will be small enough even when run through `JSON.stringify` again at storage time
        var segment = jsonstr.substr(0, valueLength);           
        while(JSON.stringify(segment).length > valueLength)
            segment = jsonstr.substr(0, --valueLength);

        storageObj[index] = segment;
        jsonstr = jsonstr.substr(valueLength);
    }
    // store all the chunks
    chrome.storage.sync.set(storageObj, callback);
  }
  */
}
