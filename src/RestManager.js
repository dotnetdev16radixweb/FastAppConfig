var async = require("async");
var log4js = require('log4js');
var log = log4js.getLogger("RestManager");
var https = require("https");
var http = require("http");
var querystring = require('querystring');
var request = require("request");
var needle = require("needle");
var fs = require('fs');

var HttpsProxyAgent = require('https-proxy-agent');
var HttpProxyAgent  = require('http-proxy-agent');

http.globalAgent.maxSockets = 20;
var configManager = require("./ConfigManager");
var config = configManager.getConfig();
var proxy = config.proxy;

var weekDuration = parseInt(config.trending_use_number_of_weeks) * (7*24*60);
var minDuration = parseInt(config.trending_use_number_of_mins);
var btMinDuration = config.bt_use_last_mins;
var errorCodeSnapshotsDuration = config.error_code_fetch_snapshots;

var auth =  'Basic '+ new Buffer(config.restuser +":"+ config.restpasswrd).toString('base64');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var fetch = function(controller,url, parentCallBack){
	var str = "";
	
	var options = {
		host : controller,
		port : getPort(),
		method : "GET",
		path : url,
		rejectUnauthorized: false,
		headers : {
			"Authorization" : auth,
		}
	};

    //log.debug("fetch options :"+JSON.stringify(options));
	
	var callback = function(response) {
		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('error', function(err) {
			log.debug("Rest Error : "+err);
			parentCallBack(err,null);
		})

		response.on('end', function() {
			//log.debug("url :"+url);
			//log.debug("status "+response.statusCode);
			//log.dbug("response :"+str);
			if(response.statusCode > 400){
				parentCallBack(str,null);
			}else{
				parentCallBack(null,str);
			}
		});
	}.bind(this)

	if(config.https){
		if(proxy){
			var agent = new HttpsProxyAgent(proxy)
			options.agent = agent;
		}
		var req = https.request(options, callback).end();
	}else{
		if(proxy){
			var agent = new HttpProxyAgent(proxy)
			options.agent = agent;
		}
		var req = http.request(options, callback).end();
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
			  'Content-Type': "multipart/form-data'",
			  "Authorization" : auth
		  }
	};

	if(postData.file){
		needle.post(url, postData, options, function(err, resp) {
			if (err) {
				parentCallBack(err,null);
			} else {
				if(resp.statusCode > 400){
					parentCallBack(resp,null)
				}else{
					parentCallBack(null,resp);
				}
			}
		});
	}else{
		needle.post(url, {body:postData}, options, function(err, resp) {
			if (err) {
				parentCallBack(err,null);
			} else {
				if(resp.statusCode > 400){
					parentCallBack(resp,null)
				}else{
					parentCallBack(null,resp);
				}
			}
		});
	}
	
}

var postJSON = function(controller,postUrl,postData,parentCallBack) {
	post(controller,postUrl,postData,'application/json',parentCallBack);		
}

var postFile = function(controller,postUrl,postData,parentCallBack) {
	
	var filename = 'temp-dash.json';
	fs.writeFileSync(filename, JSON.stringify(postData));
	
	var data = {
			file: { file: filename, content_type: 'application/json'}
	}
		
	post(controller,postUrl,data,'application/json',parentCallBack);		
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



