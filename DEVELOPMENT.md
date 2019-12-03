# client-form-input

Useful information to understand the development of this application.

## Files structure

Files within `shell` perform the [objective](./README.md#objective) for which this project exists.

- shell
  - files with processing logic
- options
  - application configuration module (data)
- browser
  - functionalities related to the navigation bar
- _locales
  - multiple languages supported (en,es)
- vendor
  - sources of external suppliers

>NOTA  
>Having your own structure and decoupled from the entire project, allows you to integrate tools such as [webpack](https://webpack.js.org/)

## Tools

- Form construction with [Survey](https://surveyjs.io/create-survey)
  - <https://surveyjs.io/create-survey>
  - <https://github.com/surveyjs/survey-creator>
  - <https://github.com/surveyjs/survey-library>

- Save/Update inline with [X-Editable](https://vitalets.github.io/x-editable/)
  - <https://vitalets.github.io/x-editable/docs.html>

- Editor javascript/json
  - <https://ace.c9.io/>
  - npm <https://www.npmjs.com/package/ace-builds>
  - cdnjs <https://cdnjs.com/libraries/ace/>

- Show Dialog
  - <https://github.com/oRRs/mdl-jquery-modal-dialog>

- Internationalizing

  - <https://developer.chrome.com/apps/i18n>
  - <https://developer.chrome.com/webstore/i18n>

## Design

CSS

> <https://github.com/FezVrasta/bootstrap-material-design>
> <https://fezvrasta.github.io/bootstrap-material-design/docs/4.0/getting-started/introduction/>

[Mdbootstrap](https://mdbootstrap.com) was also tested, it seems to be more appropriate.

Alert Message

>https://github.com/FezVrasta/snackbarjs

### Icons

[Font-awesome](https://www.npmjs.com/package/font-awesome) is used, but should be used  [fontawesome-free](https://www.npmjs.com/package/@fortawesome/fontawesome -free), as indicated in [MDB Icons](https://mdbootstrap.com/docs/jquery/content/icons-usage/)

> npm i font-awesome
>
>TODO: @fortawesome/fontawesome-free

## Reference Docs

Extensions

- <https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/extensions>
- <https://github.com/mdn/webextensions-examples>

JSON lib

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>

Tables & Editor

- <http://tabulator.info/>
- <https://www.sitepoint.com/12-amazing-jquery-tables/>
- <http://js-grid.com/>
- <https://www.dynatable.com/>
- <https://jeditable.elabftw.net/>
- <https://www.omegaweb.com/8-best-edit-in-place-jquery-plugin/>
- <https://medium.com/@krissanawat/best-jquery-editable-plugins-tutorials-with-demo-ec708d853881>