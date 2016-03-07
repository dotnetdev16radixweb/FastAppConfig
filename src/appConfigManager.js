var log4js = require('log4js');
var log = log4js.getLogger("appConfigManager");
var config = require('../config.json');
var restManager = require('./restmanager');
var Q = require('q');
var jp = require('jsonpath');

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

postHealthRules = function(srcAppID,destAppID,forceHealthRules,callback){
	restManager.fetchHealthRules(srcAppID,function(rules){
		restManager.postHealthRules(destAppID,rules,forceHealthRules,function(response){
			callback(response);
		});
	});
}

postDashBoard = function(dashboardId,destAppID,destAppName,destDashboardName,callback){
	exports.fetchDashboard(dashboardId,function(customDash){
		
		//log.debug(JSON.stringify(customDash));
		
		var newDashBoard = exports.updateDashboard(customDash,destDashboardName,destAppName,destAppID);
		
		//log.debug(JSON.stringify(newDashBoard));
		
		
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


