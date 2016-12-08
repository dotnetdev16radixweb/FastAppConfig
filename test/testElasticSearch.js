var log4js 			= require('log4js');
var log 			= log4js.getLogger("testElasticSearch");
var assert    		= require("chai").assert;
var sinon      		= require('sinon');
var esearch			= require('../solutions/elasticsearch/esearch.js')
var service			= require('../solutions/elasticsearch/services.js')
var configManager	= require('../src/ConfigManager.js')
var fs 				= require('fs');
var hrManager		= require('../src/HealthRuleManager.js');


var dashboardName = "4229_NextGen_PRD - ES";
var appname = "4229_NextGen_PRD";
var appID = 15;
var tierName = "Elasticsearch";
var tierId = 16;
var nodeName = "node";
var hrName = "New";
var clusterName = "ES_AccentureOnline";

describe("ElasticSearch functional Test", function() {
	it('Change dashboard name', function (done) {
		
		fs.readFile('./solutions/elasticsearch/dash.json',function (err, data) {
			dashboardJsonObj = JSON.parse(data);
			
			dashboardJsonObj = service.updateDashboard(configManager,dashboardJsonObj,dashboardName,appname,appID,tierName,tierId,nodeName,hrName,clusterName);
			
			assert.equal(dashboardJsonObj.name,dashboardName);
			
			var jsonAsString = JSON.stringify(dashboardJsonObj);
			assert.isTrue(jsonAsString.indexOf("{name}")<0," Should not have any references to {name}");
			assert.isTrue(jsonAsString.indexOf("{node}")<0," Should not have any references to {node}");
			assert.isTrue(jsonAsString.indexOf("{tier}")<0," Should not have any references to {tier}");
			assert.isTrue(jsonAsString.indexOf("{cluster}")<0," Should not have any references to {cluster}");
			assert.isTrue(jsonAsString.indexOf("{hrname}")<0," Should not have any references to {hrname}");

			
			//console.log(JSON.stringify(dashboardJsonObj,null,4));
			done();
		});
		
		
    });
});

describe("Functional Testing building the health rules", function() {
	it('Build Health Rules', function (done) {
		
		fs.readFile('./solutions/elasticsearch/hr.xml', 'utf-8', function (err, data) {
  			sourceXMLAsString = data;
  			
  			var mods = service.getMods(clusterName,tierName,nodeName,hrName);
  			
  			hrManager.updateNodeReference(sourceXMLAsString,mods,function(hrxml){
  				
  				assert.isTrue(hrxml.indexOf("{name}")<0," Should not have any references to {name}");
  				assert.isTrue(hrxml.indexOf("{node}")<0," Should not have any references to {node}");
  				assert.isTrue(hrxml.indexOf("{tier}")<0," Should not have any references to {tier}");
  				assert.isTrue(hrxml.indexOf("{cluster}")<0," Should not have any references to {cluster}");
  				done();
  			})	
  		});
				
		
    });
});


//
//describe("Functional Testing replacing the deep URL on the fly", function() {
//	it('Change application id', function (done) {
//		
//		appConfigManager.updateDashboard(dashBoardSample,dashBoardName,appName,20);
//		
//		var nodes = jp.apply(dashBoardSample, '$..drillDownUrl', function(value) { 
//			if (value){
//				assert.isTrue(value.indexOf("application=20") > 0);
//			}
//			return value; 
//		});
//				
//		//log.debug(JSON.stringify(dashBoardSample,null, 4));
//		
//		done();
//    });
//});
