var jp = require('jsonpath');

var appRegex = "{app_name}";
var tierRegex = "{tier}";
var nodeRegex = "{node}";
var clusterRegex = "{cluster}";
var hrRegex = "{hrname}";

function replaceText(text,appName,tierName,nodeName,clusterName){
	if(text){
		text = text.replace(appRegex,appName);
		text = text.replace(tierRegex,tierName);
		text = text.replace(nodeRegex,nodeName);
		text = text.replace(clusterRegex,clusterName);
	}
	return text;
}


exports.updateDashboard = function(configManager,dashboardJsonObj,dashboardName, hrname,appName, appID,tierName, tierID, nodeName,clusterName){
	
	//swap out the application name
	var nodes = jp.apply(dashboardJsonObj, '$..applicationName', function(value) { return appName });
	
	//swap out entityNames
	var nodes = jp.apply(dashboardJsonObj, '$..entityName', function(value) {
		if(value){
			value = value.replace(hrRegex,hrname);
		}
		return replaceText(value,appName,tierName,nodeName,clusterName)
	});
	
	//swap out text
	var nodes = jp.apply(dashboardJsonObj,  '$..text', function(value) {
		return replaceText(value,appName,tierName,nodeName,clusterName)
	});

	//swap out metric Paths
	var nodes = jp.apply(dashboardJsonObj, '$..metricPath', function(value) {
		return replaceText(value,appName,tierName,nodeName,clusterName)
	});
	
	//swap out scopingEntityName
	var nodes = jp.apply(dashboardJsonObj, '$..scopingEntityName', function(value) {
		return replaceText(value,appName,tierName,nodeName,clusterName)
	});
	
	//change the dashboard name
	dashboardJsonObj.name = dashboardName;

	//swap out any deep URLs
	var regex = /application=\d*/;
	nodes = jp.apply(dashboardJsonObj, '$..drillDownUrl', function(value) {
		if(value){
			value = exports.updateServer(congifManager,value);
			return value.replace(regex,"application="+appID);
		}
		return value;
	});	
	nodes = jp.apply(dashboardJsonObj, '$..imageURL', function(value) {
		if(value){
			value = exports.updateServer(configManager,value);
			return value.replace(regex,"application="+appID);
		}
		return value;
	});	
	
	return dashboardJsonObj;
}

exports.updateServer = function(configManager,url){
	var config = configManager.getConfig();
	var server = config.controller;
	if(config.port){
		server = server +":"+config.port
	}
	if(config.https)
		server = "https://"+server;
	else
		server = "http://"+server;
	return url.replace("{server}",server);
}