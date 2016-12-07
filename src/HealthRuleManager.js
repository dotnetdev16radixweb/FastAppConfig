var async 	= require("async");
var log4js 	= require('log4js');
var log 	= log4js.getLogger("HealthRuleManager");
var xmldom 	= require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

var regex = "{node}";

exports.matchNames = function(containsText,sourceXML,destinationXML,callback) {
	var srcDoc 	= new xmldom().parseFromString(sourceXML, 'application/xml');
	var destDoc = new xmldom().parseFromString(destinationXML, 'application/xml');
	
	//get all names
	var destNames = [];
	var thishr;
	hrs = destDoc.getElementsByTagName('health-rule');	
	for (hr in hrs) {
		thishr = hrs[hr];
		if(thishr.childNodes && thishr.childNodes.length > 1){
			//log.debug(thishr.firstChild.nodeValue);
		}
	}
	
	callback(sourceXML);
}

exports.updateNodeReference = function(sourceXML,mods,callback){
	var srcDoc 	= new xmldom().parseFromString(sourceXML, 'application/xml');
	var serializer = new XMLSerializer();
	
	for(mod in mods){
		exports.updateTextElement(srcDoc,mods[mod].element,mods[mod].regexs);
	}
	callback(serializer.serializeToString(srcDoc));
}

exports.updateTextElement = function (doc,element,regexs) {
	
	var nodes = doc.getElementsByTagName(element);
	for (node in nodes){
		var thisNode = nodes[node];
		if(thisNode.childNodes && thisNode.childNodes.length > 0){
			var text = thisNode.firstChild.textContent;
			if(text){
				for(regex in regexs){
					text = text.replace(regexs[regex].regex,regexs[regex].value);
				}
				thisNode.firstChild.data = text;
			}
		}
	}
}





