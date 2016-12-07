angular.module('ElasticSearch.controllers', ['ElasticSearch.services']).
controller('ElasticSearchController', function($scope,$window,esearch) {
    
	esearch.getApps($scope);
	
	$scope.pushHealthRules = function(template, application, overwrite) {
		deployTemplates.deployHealthRules(template,application,overwrite);
	};
	
	$scope.pushDashboards = function(template, application, dashboardName) {
		deployTemplates.deployDashboards(template,application,dashboardName);
	};
	
	$scope.updateDashName = function(scope){
		scope.dashName = scope.selectedApp.name + ' - OPs';
	};
	
	$scope.deploySampleHR = function(scope){
		deployTemplates.deploySampleHR($scope.sampleId,$scope.selectedApp.id);
	};
	
	$scope.deploySampleDashboard = function(scope){
		deployTemplates.deploySampleDashboard($scope.sampleId,$scope.selectedApp);
	};
	
	$scope.applicationChanged = function(){
		esearch.getTiers($scope,$scope.selectedApp);
		$scope.selectedTier = null;
	};
	
	$scope.tierChanged = function(){
		console.log(this.selectedTier);
		if(this.selectedTier){
			esearch.getNodes(this,$scope.selectedApp,this.selectedTier);
		}
	};
	
});