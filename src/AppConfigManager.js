var log4js = require('log4js');
var log = log4js.getLogger("AppConfigManager");
var config = require('../config.json');
var dashsamples = require("../dashsamples.json");
var restManager = require('./RestManager');
var Q = require('q');
var jp = require('jsonpath');
var fs = require('fs');

var host = {};
host.controller = config.controller;

buildMetricPath= function(appID,metricPath,startTime,endTime){
	metricPath = escape(metricPath);
	return  "/controller/rest/applications/"+appID+"/metric-data?metric-path="+metricPath +"&time-range-type=BETWEEN_TIMES&start-time="+startTime+"&end-time="+endTime+"&rollup=false&output=JSON";
}

exports.postEvent = function(metric,trendDataRecord,callback){
	restManager.postEvent(host,metric,trendDataRecord,function(response){
		callback(response);
	});
}

exports.updateDashboard= function(dashboardJsonObj, dashboardName, appName, appID){
	//swap out the application name
	var nodes = jp.apply(dashboardJsonObj, '$..applicationName', function(value) { return appName });
	
	//change the dashboard name
	dashboardJsonObj.name = dashboardName;

	//swap out any deep URLs
	var regex = /application=\d*/;
	nodes = jp.apply(dashboardJsonObj, '$..drillDownUrl', function(value) {
		if(value){
			return value.replace(regex,"application="+appID);
		}
		return value;
	});	
	return dashboardJsonObj;
}

exports.fetchDashboard= function(dashboardId,callback){
	restManager.fetchDashboard(dashboardId, function(response){
		callback(response);
	})	
}

exports.fetchApplications = function(callback){
	restManager.getAppJson(function (result){
		callback(JSON.parse(result));
	});
}

findTemplateById = function(id){
	var templates = config.templates.filter(function(item) {
	    return item.id == id;
	});
	return templates[0];
}

exports.postHealthRules = function(srcAppID,destAppID,forceHealthRules,callback){
	restManager.fetchHealthRules(srcAppID,function(rules){
		restManager.postHealthRules(destAppID,rules,forceHealthRules,function(response){
			callback(response);
		});
	});
}

exports.postHealthRulesToAllApps = function(srcAppID,forceHealthRules,callback){
	restManager.fetchHealthRules(srcAppID,function(rules){
		restManager.getAppJson(function(apps){
			apps.forEach(function(app){
				restManager.postHealthRules(app.id,rules,forceHealthRules,function(response){
					log.info(response);
				});
			});
		});
		callback("Health Rules have been copied");
	});
}

exports.postDashBoard = function(dashboardId,destAppID,destAppName,destDashboardName,callback){
	exports.fetchDashboard(dashboardId,function(customDash){
		
		var newDashBoard = exports.updateDashboard(customDash,destDashboardName,destAppName,destAppID);
		
		restManager.postDashboard(newDashBoard,function(response){
			callback(response);
		});
	});
}

exports.pushConfig = function(templateId, dashboardFlag, healthRuleFlag, forceHealthRules,destAppID, destAppName, destDashboardName,callback){
	var template = findTemplateById(templateId);
	
	if(healthRuleFlag){
		postHealthRules(template.appid,destAppID,forceHealthRules,function(response){
			callback(response);
		});
	}
	if(dashboardFlag){
		postDashBoard(parseInt(template.dashid),destAppID,destAppName,destDashboardName,function(response){
			callback(response);
		});
	}
}

exports.findSampleById = function(id){
	var samples = dashsamples.samples.filter(function(item) {
	    return item.id == id;
	});
	return samples[0];
}


exports.deploySampleHealthRule = function(sampleId,destAppID,forceHealthRules,callback){
	var sample = exports.findSampleById(sampleId);
	var url    = './public'+sample.path+"/hr.xml"; 

	fs.readFile(url, 'utf8', function (err, data) {
		  if (err) throw err;
		  restManager.postHealthRules(destAppID,data,forceHealthRules,function(response){
				callback(response);
		  });
	});
}

exports.updateServer = function(url){
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

exports.updateSampleDashboard= function(dashboardJsonObj, dashboardName, appName, appID){
	//swap out the application name
	var nodes = jp.apply(dashboardJsonObj, '$..applicationName', function(value) { return appName });
	
	//swap out entityNames
	var nodes = jp.apply(dashboardJsonObj, '$..entityName', function(value) {
		if(value == "{app_name}")
			return appName
		else
			return value;
	});
	
	//change the dashboard name
	dashboardJsonObj.name = appName+" "+dashboardName;

	//swap out any deep URLs
	var regex = /application=\d*/;
	nodes = jp.apply(dashboardJsonObj, '$..drillDownUrl', function(value) {
		if(value){
			value = exports.updateServer(value);
			return value.replace(regex,"application="+appID);
		}
		return value;
	});	
	nodes = jp.apply(dashboardJsonObj, '$..imageURL', function(value) {
		if(value){
			value = exports.updateServer(value);
			return value.replace(regex,"application="+appID);
		}
		return value;
	});	
	return dashboardJsonObj;
}

exports.deploySampleDashboard = function(sampleId,destApp,callback){
	
	var sample = exports.findSampleById(sampleId);
	var url    = './public'+sample.path+"/dashboard.json"; 

	fs.readFile(url, 'utf8', function (err, data) {
		  if (err) throw err;
		  
		  var dashObj = JSON.parse(data);
		  dashObj = exports.updateSampleDashboard(dashObj,sample.name,destApp.name,destApp.id);
		  log.debug(JSON.stringify(dashObj));
		  restManager.postDashboard(dashObj,function(response){
				callback(response);
		  });
	});
}


