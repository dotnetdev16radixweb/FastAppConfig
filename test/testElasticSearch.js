var log4js 			= require('log4js');
var log 			= log4js.getLogger("testElasticSearch");
var assert    		= require("chai").assert;
var sinon      		= require('sinon');
var esearch			= require('../solutions/elasticsearch/esearch.js')
var service			= require('../solutions/elasticsearch/services.js')
var fs 				= require('fs');


describe("ElasticSearch functional Test", function() {
	it('Change dashboard name', function (done) {
		
		fs.readFile('./solutions/elasticsearch/dash.json',function (err, data) {
			dashboardJsonObj = JSON.parse(data);
			dashboardJsonObj = service.updateDashboard(dashboardJsonObj,"4229_NextGen_PRD - ES","4229_NextGen_PRD",15,"Elasticsearch",16,"node","ES_AccentureOnline");
			
			assert.equal(dashboardJsonObj.name,"4229_NextGen_PRD - ES");
			
			
			//console.log(JSON.stringify(dashboardJsonObj,null,4));
			done();
		});
		
		
    });
});

//describe("Functional Testing replacing the application names on the fly", function() {
//	it('Change application name', function (done) {
//		
//		appConfigManager.updateDashboard(dashBoardSample,dashBoardName,appName,20);
//		
//		var nodes = jp.apply(dashBoardSample, '$..applicationName', function(value) { 
//			assert.equal(value, appName);
//			return value; 
//		});
//				
//		//log.debug(JSON.stringify(dashBoardSample,null, 4));
//		
//		done();
//    });
//});
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
