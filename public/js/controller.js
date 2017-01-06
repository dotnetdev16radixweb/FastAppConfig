angular.module('DeployApp.controllers', ['DeployApp.services']).
controller('DeployController', function($scope,$window,deployTemplates) {
    
	deployTemplates.getTemplates($scope);
	deployTemplates.getApps($scope);
	
	$scope.owHR = "true";	
	$scope.copy = "true";
	$scope.sampleId = $window.sampleId;
	$scope.themeId = $window.selectedTheme;
	$scope.showSpinner = false;

	$scope.pushHealthRules = function(template, application, overwrite) {
		deployTemplates.deployHealthRules($scope,template,application,overwrite);
	};
	
	$scope.pushDashboards = function(template, application, dashboardName) {
		deployTemplates.deployDashboards(template,application,dashboardName);
	};
	
	$scope.updateDashName = function(scope){
		scope.dashName = scope.selectedApp.name + ' - OPs';
	}
	
	$scope.deploySampleHR = function(scope){
		deployTemplates.deploySampleHR($scope,$scope.sampleId,$scope.selectedApp.id);
	}
	
	$scope.deploySampleDashboard = function(scope){
		deployTemplates.deploySampleDashboard($scope,$scope.sampleId,$scope.selectedApp,$scope.themeId);
	}
	
});