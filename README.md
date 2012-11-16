#formToJSON#
=======
##Overview##
formToJSON is a native javascript class which offers a simple way to automatially convert HTML form input values/data to JSON and attach a custom onsubmit event handler function which receives the JSON-ified data, allowing you to, for example, send it via AJAX or websockets.

formToJSON can be simultaneously used with any number of forms on an HTML page, either using the same or different configurations (e.g. input element types, DOM properties, submit handler functions) for each.

There are many other form to JSON methods/implementations available but I needed one for a specific project so wrote this, maybe it will be useful to someone.

##Status##
This is a very early stage, think of it as alpha - I need your help to test so please provide feedback via bug reports. Bug fixes and suggestions are also very welcome.

##Requirements##
Javascript requirements are minimal, any reasonably modern browser should be fine. Probably the most exotic requirement is [`document.querySelectorAll`](http://caniuse.com/#feat=queryselector) (fully supported in IE 8+, Fx 15+, Chr 22+, Saf 5.1+, Op 12+, iOS 3.2+ etc.).

formToJSON intentionally does not require any javascript frameworks (e.g. jQuery, MooTools, Prototype etc.). 

formToJSON requires that all form input elements are enclosed in a `<form>` element & have a valid `name` attribute - obvious and necessary but stated for clarity.

##Configuration options##
There are only a small number of configuration options. These options can either be globally set on the formToJSON object or passed in as JSON to the `apply()` method.

**formSelector** (String)  
A valid CSS selector (used in document.querySelectorAll) to identify the form(s) to process/apply to.    
Default: `"form.to_json"` (any form element with CSS classname "to_json")

**ignoreEmptyFields** (Boolean)  
Whether or not to skip inclusion of fields which have no value - may be useful in saving bandwidth.    
Default: `true`
		
**ignoreEmptyDOMProperties** (Boolean)  
Whether (true) to skip inclusion of field attributes which have no value. This means you avoid ending up with JSON elements in the output of e.g. "src":"".   
Default: `true`

**submitHandlerFunction** (Function - referenced or directly passed)  
A function, either referenced or directly passed which takes exactly one parameter - the JSON object of the form element data.  
Default (useless): `function sh(data){alert("Form submitted. You should replace this handler with your own so it actually does something.")}`

**addFormAttributes** (JSON)  
A JSON object (key/value pairs) of attributes to add to the form element(s). Attributes adds/removes are applied in the order add then remove.   
Default: `{}`

**removeFormAttributes** (JSON)  
A JSON object (key/value pairs) of attributes to remove from the form element(s). Attributes adds/removes are applied in the order add then remove.  
Default: `{}`

**includeFormFieldTypes** (Array)  
HTML element types within the form(s) to include in the JSON data. All other types will be ignored.    
Default: `["input","select","textarea","output"]`

**outputDOMProperties** (Array)  
An array of HTML DOM properties to include in JSON data. Any DOM property should work, if not, let me know!  
Default: `["value"]`

##Usage##
Usage is very simply, just include the javascript file, either in the page `<head>` with the `defer` attribute or just before the `</body>` tag then configure/apply in the format of the examples below (making the necessary adjustments for your HTML):

##Examples##
###Globally set options inc. submit handler function reference###
function handleFormJSON(data)  
{  
console.dir(data);  
}  

formToJSON.config.formSelector="#form1";  
formToJSON.config.submitHandlerFunction=handleFormJSON;  
formToJSON.config.addFormAttributes={novalidate:"novalidate",class:"some_class"};  
formToJSON.config.outputDOMProperties=["value","id"];  
formToJSON.apply();

###Globally set options inc. direct submit handler function###
formToJSON.config.formSelector="#form1";  
formToJSON.config.submitHandlerFunction=function(data){console.dir(data);};
formToJSON.config.addFormAttributes={novalidate:"novalidate",class:"some_class"};  
formToJSON.config.outputDOMProperties=["value","id"];  
formToJSON.apply();

###Pass options inc. submit handler function reference to apply()###
function handleFormJSON(data)  
{  
console.dir(data);  
}  

formToJSON.apply({  
	formSelector:"#form1",  
	submitHandlerFunction:handleFormJSON,  
	addFormAttributes:{novalidate:"novalidate",class:"some_class"},  
	outputDOMProperties:["value","id"]  
});  

###Pass options inc. direct submit handler function to apply()###
formToJSON.apply({  
	formSelector:"#form1",  
	submitHandlerFunction:function(data){console.dir(data);},  
	addFormAttributes:{novalidate:"novalidate",class:"some_class"},  
	outputDOMProperties:["value","id"]  
}); 

##Output format##
Output is a native javscript JSON object. The format of the JSON object is:  
{  
"inputNameA":{"propertya1":"valuea1","propertya2":"valuea2"},  
"inputNameB":{"propertyb1":"valueb1","propertyb2":"valueb2"},  
"inputNameC":{"propertyc1":"valuec1","propertyc2":"valuec2"}  
}  

For example:  
{  
"plain_text":{"value":"Plain text","id":"plaintext"},  
"cb":{"value":"This is the value the server will receive","id":"cb"},  
"color":{"value":"#b01600","id":"color"},  
"number":{"value":"15","id":"number"},  
"range":{"value":"100","id":"range"},  
"ofr1":{"value":"Range: 100","id":"outputForRange1"},  
"ofr2":{"value":"Number * range: 1500",  
"id":"outputForRange2"}  
}

##To do list##
* Testing - particularly across platforms and browsers
* Bug fixes
* Performance improvements
* Work more file inputs and useful functionality around this
* More…