export function editorJS(ele, ctx) {
  if (!ctx) {
    ctx = document;
  }
  $(ele, ctx).each(function(index) {
    var input = this;

    var editor = ace.edit(input);

    /*
    // replace input with ace
    editor.container.style.height = "100px";
    //editor.session.setValue(input.value);
    editor.session.setValue("function() { return 'x'; }");
    input.parentNode.insertBefore(editor.container, input);
    input.style.display = "none";
    */

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
      $(input).val(valueStr);
    });
  });
  return ele;
}

export function editorJSON(ele, ctx) {
  if (!ctx) {
    ctx = document;
  }
  $(ele, ctx).on("focus", function(evt) {
    var input = evt.target;
    var editor = null;

    if (typeof input.value === "object") {
      $(input).val(JSON.stringify(input.value, null, "\t"));
    } else if (isJSON(editable.value)) {
      $(input).val(JSON.stringify($.parseJSON(input.value), null, "\t"));
    }

    editor = ace.edit(input);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    //editor.setAutoScrollEditorIntoView(true);
    editor.setOptions({
      minLines: 5,
      maxLines: 30
    });
    editor.getSession().setTabSize(2);
    //editor.getSession().setUseWrapMode(true);
    //editor.getSession().setValue(JSON.stringify($(that).data().value, null, '\t'));
    editor.getSession().on("change", function() {
      var valueStr = editor.getSession().getValue();
      //CASI ok: $(input).val(valueStr);
      if (isJSON(valueStr)) {
        $(input).val(JSON.stringify($.parseJSON(valueStr)));
      } else {
        $(input).val(valueStr);
      }
    });
  });
  return ele;
}
