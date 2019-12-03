# client-form-input

This usage example is intended to include the functionality for the `Redmine` tecket/issue

## Build for Redmine

Create source/entry with [client-form-input](https://github.com/janusky/client-form-input) for site [Redmine](http://demo.redmine.org).

1. [Add URL/Site/Page](#add-url)

1. [Incorporate forms](#edit-url)

### Add URL

Page / URL

    http://demo.redmine.org/.*?issues/([0-9]+|new)

Script JS

```js  
setInterval(function(){$('#issue_tracker_id').off('change').on('change', function(evt){setTimeout(function(){$.formInput.reload();},200);})},300);  
```

At the end of the load, indicate `Create`

![](img/fi-add-01.png)

After adding/creating the site ([Agregar URL](#agregar-url)) you can see in Redmine the button ![](img/fi-icon.png) appears

![](img/redmine-btn-01.png)

### Edit URL

Access module `Admin` to add the forms

![](img/fi-admin-01.png)

Identifier

    enableService

Type (text to display)

    Enable Service

Form (Form JSON)

> Build the form with [Survey Builder](https://surveyjs.io/Survey/Builder/)/[Survey Create](https://surveyjs.io/create-survey)

```json
{
  "locale":"es",
  "pages":[
    {
      "name":"service",
      "elements":[
        {
          "type":"paneldynamic",
          "name":"Indicate service data",
          "isRequired":true,
          "templateElements":[
            {
              "type":"text",
              "name":"service",
              "title":"Service Identifier",
              "isRequired":true
            },
            {
              "type":"dropdown",
              "name":"type",
              "title":"Type",
              "choices":[
                {"value":"item1","text":"web"},
                {"value":"item2","text":"mobile"},
                {"value":"item3","text":"otro"}
              ]
            },
            {
              "type":"dropdown",
              "name":"ambient",
              "startWithNewLine":false,
              "title":"Ambient",
              "choices":[
                {"value":"item1","text":"production"},
                {"value":"item2","text":"development"}
              ]
            },
            {"type":"text","name":"protal","title":"Portal"},
            {
              "type":"text",
              "name":"group",
              "startWithNewLine":false,
              "title":"Group"
            },
            {"type":"text","name":"description","title":"Description"},
            {
              "type":"dropdown",
              "name":"level",
              "title":"Level",
              "choices":[
                {"value":"item1","text":"1"},
                {"value":"item2","text":"2"},
                {"value":"item3","text":"3"}
              ]
            },
            {
              "type":"dropdown",
              "name":"authorization",
              "startWithNewLine":false,
              "title":"Authorization",
              "choices":[
                {"value":"item1","text":"Department"},
                {"value":"item3","text":"Office"}
              ]
            },
            {
              "type":"multipletext",
              "name":"autorizante",
              "title":"Indicar Autorizante",
              "items":[
                {"name":"autorizante_tipo","title":"Tipo"},
                {"name":"autorizante_ultimo","title":"Último"}
              ]
            },
            {
              "type":"text",
              "name":"rules",
              "title":"Rules Administrator",
              "placeHolder":{"default":"System Departament ...","es":"Dpto. Sistemas"}
            }
          ],
          "panelCount":1
        }
      ],
      "questionTitleLocation":"left",
      "questionsOrder":"initial"
    }
  ],
  "showCompletedPage":false
}
```

Other examples of Form

programming_languages

```json
{
	"questions": [
		{
			"addRowText": "Add language",
			"columns": [
				{
					"cellType": "dropdown",
					"choices": [
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
					"choicesOrder": "asc",
					"hasOther": true,
					"isRequired": true,
					"name": "Language"
				},
				{
					"cellType": "dropdown",
					"choices": [
						"One year or less",
						"From one two three years",
						"From three to five years",
						"More then five years"
					],
					"isRequired": true,
					"name": "Experience"
				}
			],
			"isRequired": true,
			"name": "languages",
			"rowCount": 1,
			"title": "What programming languages do you know?",
			"type": "matrixdynamic"
		}
	]
}
```

By simply entering the data and pressing `enter` they are saved

![](img/fi-admin-addform-01.png)

### Use forms

After adding/creating the form press the button ![](Img/fi-icon.png) and the form will appear

![](img/redmine-btn-03.png)

Image after indicating complete data

![](img/redmine-btn-04.png)

When the ticket/issue is saved, it can also be viewed as read-only.

![](img/redmine-btn-05.png)

See ticket/issue

![](img/redmine-btn-06.png)


## Conclusión

You can see the potential that allows to normalize/standardize information that aims to specify what is needed.
