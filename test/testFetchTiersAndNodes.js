var log4js 			= require('log4js');
var log 			= log4js.getLogger("testFetchTiersAndNodes");
var assert    		= require("chai").assert;
var appConfigManager   	= require("../src/AppConfigManager.js");


describe("Functional Testing fetching applications", function() {
	it('Get Applications', function (done) {
//		appConfigManager.fetchApplications(function(results){
//			assert.isNotNull(results, 'we should have results');
//			done();
//		});
		
		done();
    });
});

describe("Functional Testing fetching tiers", function() {
	it('Get Tiers', function (done) {
//		appConfigManager.fetchTiers(110,function(results){
//			assert.isNotNull(results, 'we should have results');
//			done();
//		});
		
		done();
    });
});

describe("Functional Testing fetching nodes", function() {
	it('Get Nodes', function (done) {
//		appConfigManager.fetchNodes(110,557,function(results){
//			assert.isNotNull(results, 'we should have results');
//			log.debug(JSON.stringify(results));
//			done();
//		});
		
		done();
    });
});

