var async = require("async");
var log4js = require('log4js');
var log = log4js.getLogger("RestManager");
//var https = require("http-debug").https;
var https = require("https");
//var http = require("http-debug").http;
var http = require("http");
var querystring = require('querystring');
var request = require("request");
var needle = require("needle");
var fs = require('fs');

var HttpsProxyAgent = require('https-proxy-agent');
var HttpProxyAgent  = require('http-proxy-agent');

var configManager = require("./ConfigManager");
var config = configManager.getConfig();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

http.debug = 2;
http.globalAgent.maxSockets = 20;
minErrorCode = 400;

var getAuthString = function(){
	return 'Basic '+ new Buffer(config.restuser +":"+ config.restpassword).toString('base64');
}


var addproxy = function(options){
	var proxy = config.proxy;
	if(config.https && proxy){
		var agent = new HttpsProxyAgent(proxy)
		options.agent = agent;
	}
	if(!config.https && proxy){
		var agent = new HttpProxyAgent(proxy)
		options.agent = agent;
	}
}


var fetch = function(controller,url, parentCallBack){
	var str = "";
	
	var options = {
		host : controller,
		port : getPort(),
		method : "GET",
		path : url,
		rejectUnauthorized: false,
		headers : {
			"Authorization" : getAuthString(),
		}
	};
	
	addproxy(options);

	var callback = function(response) {
		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('error', function(err) {
			parentCallBack(err,null);
		})

		response.on('end', function() {
			if(config.restdebug){
				log.debug("statusCode :"+response.statusCode);
				log.debug("response :");
				log.debug(str);
			}
			if(response.statusCode >= minErrorCode){
				parentCallBack(str,null);
			}else{
				parentCallBack(null,str);
			}
		});
	}.bind(this)

	if(config.https){
		var req = executeRequest(controller,https,options,callback);
	}else{
		var req = executeRequest(controller,http,options,callback);
	}
}

var fetchJSessionID = function(controller,parentCallBack){
	var str = "";
	
	var options = {
		host : controller,
		port : getPort(),
		method : "GET",
		path : "/controller/auth?action=login",
		rejectUnauthorized: false,
		headers : {
			"Authorization" : getAuthString(),
		}
	};
	
	addproxy(options);

	var callback = function(response) {
		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('error', function(err) {
			parentCallBack(err,null);
		})

		response.on('end', function() {
			if(response.statusCode >= minErrorCode){
				parentCallBack(response,null);
			}else{
				parentCallBack(null,response);
			}
		});
	}.bind(this);

	if(config.https){
		var req = https.request(options,callback).end();
	}else{
		var req = http.request(options,callback).end();
	}
}

var parseCookies  = function (response) {
    var rc = response.headers['set-cookie'];
    var jsessionid = null;
    rc.forEach(function( parts ) {
    	parts.split(";").forEach(function(cookieStr){
    		if (cookieStr.indexOf("JSESSIONID") == 0){
    			jsessionid = cookieStr;
    		}
    	});
    });
    return jsessionid;
}

var executeRequest = function(controller,protocol,options,callback){
	if(config.restdebug){
		log.debug("options :"+JSON.stringify(options));
	}
	if(config.saml){
		fetchJSessionID(controller,function(err,response){
			var jsessionId = parseCookies(response);
			options.headers = {"Cookie":jsessionId}
			return protocol.request(options, callback).end();
		})
	}else{
		return protocol.request(options, callback).end();
	}
}


var getProtocol = function(){
	var url;
	if(config.https){
		url = "https://";
	}else{
		url = "http://";
	}
	return url;
}

var getPort = function(){
	var port = 8080;
	if (config.port){
		port = config.port;
	}else{
		if(config.https){
			port = 443;
		}
	}
	return port;
}

/**
 * API for custom event : https://docs.appdynamics.com/display/PRO41/Use+the+AppDynamics+REST+API#UsetheAppDynamicsRESTAPI-CreateEvents
 * 
 */
exports.postEvent = function (app,metric,dataRecord,callback){
	var postData = {};
	postData.summary = "Metric "+ metric.metricName +" is Trending. Trend Factor is "+dataRecord.factor+" Trend Threshold is "+config.factor_threshold;
	postData.eventtype = "CUSTOM";
	postData.customeventtype = "TREND";
	postData.severity = "ERROR";
	postData.comment = "Metric Path "+metric.metricPath;
	var url = "/controller/rest/applications/"+metric.appid+"/events";
	postJSON(app.controller,url,postData,callback);
}


var post = function(controller,postUrl,postData,contentType,parentCallBack) {
	
	var url = getProtocol() + controller +":"+getPort()+postUrl;
	var options = {
		  method: 'POST',
		  multipart : true,
		  rejectUnauthorized: false,
		  headers:{
			  'Content-Type': contentType,
			  "Authorization" : getAuthString()
		  }
	};

	if(!postData.file){
		postData = {body:postData};
	}
	needle.post(url, postData, options, function(err, resp) {
		if(config.restdebug){
			log.debug("statusCode :"+resp.statusCode);
			log.debug("response :");
			log.debug(resp);
		}
		handleResponse(err,resp,parentCallBack);
	});
}

var handleResponse = function(err,resp,parentCallBack){
	if (err) {
		parentCallBack(err,null);
	} else {
		if(resp.statusCode >= minErrorCode){
			parentCallBack(resp,null)
		}else{
			parentCallBack(null,resp);
		}
	}
}

var postUICall = function(controller,postUrl,postData,contentType,parentCallBack) {
	
	fetchJSessionID(controller,function(err,response){
	
		var jsessionId = parseCookies(response);
		var url = getProtocol() + controller +":"+getPort()+postUrl;
		var options = {
			  method: 'POST',
			  rejectUnauthorized: false,
			  headers:{
				  "Content-Type": contentType,
				  "Cookie" : jsessionId
			  }
		};

		needle.post(url, postData, options, function(err, resp) {
			if(config.restdebug){
				log.debug("statusCode :"+resp.statusCode);
				log.debug("response :");
				log.debug(resp);
			}
			handleResponse(err,resp,parentCallBack);
		});
	});
}

var postJSON = function(controller,postUrl,postData,parentCallBack) {
	post(controller,postUrl,postData,'application/json',parentCallBack);		
}


var getTempPath = function(){
	return configManager.getTempPath();
}

var postFile = function(controller,postUrl,postData,parentCallBack) {
	
	var filename = getTempPath()+'temp-dash.json';
	fs.writeFileSync(filename, JSON.stringify(postData));
	
	var data = {
		file: { file: filename, content_type: 'application/json'}
	}
		
	post(controller,postUrl,data,'application/json',parentCallBack);
}

var postXmlFile = function(controller,postUrl,postData,parentCallBack) {
	
	var filename = getTempPath()+'temp.xml';
	fs.writeFileSync(filename, postData);
	
	var data = {
		file: { file: filename, content_type: 'text/xml'}
	}
		
	post(controller,postUrl,data,'text/xml',parentCallBack);
}

var postXml = function(controller,postUrl,postData,parentCallBack) {
	post(controller,postUrl,postData,"text/xml",parentCallBack);
}


var makeFetch = function(controller,url,callback){
	fetch(controller,url,function(err,response){
		if(err){
			callback(err,null);
		}else{
			callback(null,JSON.parse(response));
		}
	});
}


exports.fetchDashboard = function(dashboardId,callback){
	var url = "/controller/CustomDashboardImportExportServlet?dashboardId="+dashboardId;
	makeFetch(config.controller,url,callback);
}

exports.fetchHealthRules = function(appID, callback){
	var url = "/controller/healthrules/"+appID;
	fetch(config.controller,url,function(err,response){
		if(err){
			callback(err,null);
		}else{
			callback(null,response);
		}
	});
}

exports.postHealthRules = function(appID,xmlData,forceHealthRules,callback){
	var url = "/controller/healthrules/"+appID;
	if(forceHealthRules){
		url = url+"?overwrite=true";
	}
	postXml(config.controller,url,xmlData,callback);
}

exports.postDashboard = function(dashboard,callback){
	var url = "/controller/CustomDashboardImportExportServlet";
	postFile(config.controller,url,dashboard,callback);
}

exports.postCustomMatchRules = function(applicationID,customMatchRules,entryPointType,callback){
	var url = "/controller/transactiondetection/"+applicationID+"/custom/"+entryPointType+"?overwrite=true";
	postXmlFile(config.controller,url,customMatchRules,callback);
}

exports.getAppJson = function(callback) {
	var url = "/controller/rest/applications?output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.getTiersJson = function(app,callback) {
	var url = "/controller/rest/applications/"+app+"/tiers?output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.getNodesJson = function(app,tier,callback) {
	var url = "/controller/rest/applications/"+app+"/tiers/"+tier+"/nodes?output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.getBTList = function(appName,callback) {
	var url = "/controller/rest/applications/" + encodeURIComponent(appName) + "/business-transactions?output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.getBTCallsPerMinute = function(appName,tierName,btName,timeFrame,callback) {
	var url = "/controller/rest/applications/" + encodeURIComponent(appName) + "/metric-data?metric-path=Business%20Transaction%20Performance|Business%20Transactions|" + tierName + "|" + btName + "|Calls%20per%20Minute&time-range-type=BEFORE_NOW&duration-in-mins=" + timeFrame + "&output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.getBTAverageResponseTime = function(appName,tierName,btName,timeFrame,callback) {
	var url = "/controller/rest/applications/" + encodeURIComponent(appName) + "/metric-data?metric-path=Business%20Transaction%20Performance|Business%20Transactions|" + tierName + "|" + btName + "|Average%20Response%20Time%20%28ms%29&time-range-type=BEFORE_NOW&duration-in-mins=" + timeFrame + "&output=JSON";
	makeFetch(config.controller,url,callback);
}

exports.deleteBTs = function (deleteBTList,callback){
	var url = "/controller/restui/bt/deleteBTs";
	postUICall(config.controller,url,JSON.stringify(deleteBTList),"application/json",callback);
}

exports.updateConfiguration = function(){
	config = configManager.getConfig();
}
