import { utils } from "../../shell/helper.js";

export function editable(ele, ctx, saveCallback) {
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
        .find(".editable");
      if (item.length == 0) {
        // check the next row
        item = $(this)
          .closest("tr")
          .next()
          .find(".editable");
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

  $(ele, ctx).on("save", function(e, params) {
    var oldValue = $(this).text();
    if (oldValue !== params.newValue) {
      var field = $(this).attr("data-name");
      var saveObj = {};
      var newValue = params.newValue;

      // Si es un tipo boolean
      if (newValue === "si" || newValue === "no") {
        newValue = newValue === "si" ? true : false;
      } else if (utils.isJSON(newValue)) {
        newValue = $.parseJSON(newValue);
      }

      if (typeof saveCallback === "function") {
        return saveCallback(newValue, this);
      }
      return newValue;
    }
  });

  return ele;
}
