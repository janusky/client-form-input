/*
 * https://github.com/FezVrasta/snackbarjs
 */
/**
 * Muestra el mensaje en ventana emergente temporal.
 * 
 * @param {Error/String} err 
 */
export function showMessage(err) {
  //style: toast, snackbar, container
  var options = {
    content: err.message || err, // text of the snackbar
    style: "toast", // add a custom class to your snackbar
    timeout: 4000, // time in milliseconds 0 is disabled
    htmlAllowed: true // allows HTML as content value
  };
  $.snackbar(options);
}
