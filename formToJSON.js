var formToJSON=
{
	// Default config, can be overridden per-form or globally
	config:
	{
		formSelector:"form.to_json", // a valid CSS selector to identify the form(s) to process
		ignoreEmptyFields:true, // Boolean. Whether (true) to skip inclusion of fields which have no value - may be useful in saving bandwidth
		ignoreEmptyDOMProperties:true, // Boolean. Whether (true) to skip inclusion of field attributes which have no value - may be useful in saving bandwidth
		submitHandlerFunction:function sh(data){alert("Form submitted. You should replace this handler with your own so it actually does something.")}, // Very simple (and useless) placeholder function
		addFormAttributes:{}, // An object (key/value pairs) of attributes to add to the form element(s)
		removeFormAttributes:{}, // An array of attributes to remove from the form element
		includeFormFieldTypes: // HTML element types within the form(s) to include in the JSON data. All other types will be ignored
		[
			"input",
			"select",
			"textarea",
			"output"
		],
		outputDOMProperties: // HTML DOM properties to include in JSON data
		[
			"value"
		]
	},
	apply: function apply(options)
	{
		// Declare vars
		var formSelector, formConfig={}, i, j, forms, fields;
		
		
		// A couple of very basic checks which should hopefully weed out crappy old browsers
		if(!document.querySelectorAll)
		{
			alert("Your browser is old/crap and doesn't support the necessaries for this script");
			return false;
		}
		
		// allow users tonot pass in an options object
		options=options || {};
		 
		// Namespace the config so we can have multiple different forms on one page
		formSelector=options.formSelector || this.config.formSelector;
		formConfig[formSelector]={};
		 
		// override any options the user has provided. Any options not present in this.config will be ignored.
		if(typeof(options)=="object")
		{
			for(i in this.config)
				formConfig[formSelector][i]=options[i] || this.config[i];
		}
		
		
		// Find the form(s)
		forms=document.querySelectorAll(formSelector);
		
		// Check we have >=1 form
		if(forms)
		{
			// Iterate through matched forms - note that the form effectively becomes the namespace we operate in
			for(i in forms)
			{
				if(typeof(forms[i])=="object") // Might be better to check nodeName=="form"
				{		
					// Set any defined attributes on the form
					if(typeof(formConfig[formSelector].addFormAttributes)=="object")
					{
						for(j in formConfig[formSelector].addFormAttributes)
						{
							forms[i].setAttribute(j, formConfig[formSelector].addFormAttributes[j]);
						}
					}
					
					// remove any defined attributes from the form
					if(typeof(formConfig[formSelector].removeFormAttributes)=="object")
					{
						for(j in formConfig[formSelector].removeFormAttributes)
							forms[i].removeAttribute(formConfig[formSelector].removeFormAttributes[j]);
					}
					
					// Set the submit handler based on supplied config
					this.setSubmitHandler(forms[i], formConfig[formSelector]);
				}
			}
		}
		else
			return false;
	},
	setSubmitHandler: function setSubmitHandler(formObj, formConfig)
	{
		// Make sure we're looking at a form object
		if(formObj.nodeName.toString().toLowerCase()=="form")
		{
			// Prevent the form from submitting via POST/GET - is this the best way?
			formObj.setAttribute("onsubmit","return false;");
						
			// Add the submit event listener
			formObj.addEventListener("submit", function()
			{
				var i, j, k, m, t, data={}, fields, fieldData;
				
				// Process only field types as defined in config/options
				for(i in formConfig.includeFormFieldTypes)
				{
					fields=formObj.querySelectorAll(formConfig.includeFormFieldTypes[i]);
					
					if(fields.length)
					{
						for(j in fields)
						{
							// Ignore some spurious elements, make sure we're  looking at genuine HTML elements
							if(fields[j].nodeName)
							{			
								fieldData={};								
								t=fields[j].type.toLowerCase();
								n=fields[j].nodeName.toLowerCase();
								
								// Radio buttons are a bit of a pain, this line allows us to handle them with no special rules and also allows other field types through
								if( (t=="radio" && fields[j].checked) || t!="radio")
								{
									// If configured, ignore empty/unset fields
									if( (!formConfig.ignoreEmptyFields && !fields[j].value) || fields[j].checked || fields[j].value)
									{
										// Add only the defined field attributes to the output
										for(k in formConfig.outputDOMProperties)
										{
											if(formConfig.ignoreEmptyDOMProperties==false || fields[j][formConfig.outputDOMProperties[k]])
												fieldData[formConfig.outputDOMProperties[k]]=fields[j][formConfig.outputDOMProperties[k]];
										}

										// Custom handler for inputs with "multiple" attribute
										if(fields[j].multiple)
										{
											fieldData["multivalues"]=[];

											// Bit tricky to handle everything in one go(?) so splitting for now at least
											
											// Selects - "value" will only hold the 1st selected option value								
											if(t=="select-multiple" || n=="select") // Webkit at least uses an internal type attribute of select-mutliple, not sure if all do
											{
												for(m in fields[j].options)
												{
													if(fields[j].options[m].selected)
														fieldData["multivalues"].push(fields[j].options[m].value);
												}
											}
											else if(t=="email")
											{
												// Multiple email addresses are comma separated (the value attribute has that raw value in it - this is provided for convenience)
												fieldData["multivalues"]=fields[j].value.split(",");
											}
											else if(t=="file")
											{
									// This isn't a lot of use really - need a more complete solution for files												
												// Multiple filenames are in an array called files
												for(m in fields[j].files)
												{
													if(typeof(fields[j].files[m])=="object") // actual file items are objects (there's also a length int and a prototype
														fieldData["multivalues"].push(fields[j].files[m].name);
												}
											}
										}

										// Add the retrieved data to the data object
										data[fields[j].name]=fieldData;
										
										delete(fieldData); // Probably not necessary
									}
								}
							}
						}
					}
				}
				
				// Pass the formed data object to the handler method the user defined
				formConfig.submitHandlerFunction(data);				
			});
		}
		else
			return false;
	}
}


// Examples - the below would normally be applied via a dedicated asset/file or block of code

//function handleFormJSON(data)  
//{  
//	console.dir(data);
//}  
//
//formToJSON.config.formSelector="#form1";  
//formToJSON.config.submitHandlerFunction=function(data){console.dir(data);};
//formToJSON.config.addFormAttributes={novalidate:"novalidate",class:"some_class"};  
//formToJSON.config.outputDOMProperties=["value","id"];  
//formToJSON.apply();


//formToJSON.config.formSelector="#form1";  
//formToJSON.config.submitHandlerFunction=function(data){console.dir(data);};
//formToJSON.config.addFormAttributes={novalidate:"novalidate",class:"some_class"};  
//formToJSON.config.outputDOMProperties=["value","id"];  
//formToJSON.apply();


//function handleFormJSON(data)  
//{  
//	console.dir(data);  
//}  
//
//formToJSON.apply({  
//	formSelector:"#form1",  
//	submitHandlerFunction:handleFormJSON,  
//	addFormAttributes:{novalidate:"novalidate",class:"some_class"},  
//	outputDOMProperties:["value","id"]  
//});

formToJSON.apply({  
	formSelector:"#form1",  
	submitHandlerFunction:function(data){console.dir(JSON.stringify(data));},  
	addFormAttributes:{novalidate:"novalidate",class:"some_class"},  
	outputDOMProperties:["value","id"]  
}); 