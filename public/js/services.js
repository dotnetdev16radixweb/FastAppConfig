angular.module('DeployApp.services',[])
.factory('deployRequest', function() {
	function DeployRequest(){
		this.configId = 1;
		this.targetAppId = 0;
		this.deployDash = false;
		this.newDashName = "";
		this.deployHR = false;
		this.deployHRAndOverWrite=true;
	}
	
	function _deployRequest(){
		this.deployRequest = new DeployRequest();
	}
	
	return new _deployRequest();
})
.factory('deployTemplates', function($http,$location) {
	
	function Templates(){
		this.data = null;
	}
	
	function _templatesService(){
		this.template = new Templates();
	}
	
	_templatesService.prototype.getTemplates = function($scope) {
		$http.get('/templates.json').success(function(result) {
			$scope.templates = result;
		});	
	}
	
	_templatesService.prototype.getApps = function($scope) {
		$http.get('/applications.json').success(function(result) {
			$scope.applications = result;
		});	
	}
	
	_templatesService.prototype.deployHealthRules = function($scope,template,application,overwrite) {
		
		$scope.showSpinner = true;
		var hrRequest = [];
		hrRequest.push(template);
		hrRequest.push(application);
		hrRequest.push(overwrite);
				
		$http({
		    url: '/copyhealthrules',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		    }).success(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		        alert(data);
		    }).error(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		    });
	}
	
	_templatesService.prototype.deployDashboards = function(template,application,dashboardName) {
		
		var hrRequest = [];
		hrRequest.push(template);
		hrRequest.push(application);
		hrRequest.push(dashboardName);
				
		$http({
		    url: '/copydashboards',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		    }).success(function (data, status, headers, config) {
		        alert(data);
		    }).error(function (data, status, headers, config) {
		    	
		    });
	}
	
	_templatesService.prototype.deploySampleHR = function($scope,sampleId,application) {
		
		$scope.showSpinner = true;
		var hrRequest = [];
		hrRequest.push(sampleId);
		hrRequest.push(application);
				
		$http({
		    url: '/deploySampleHealthRules',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		    }).success(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		        alert(data);
		    }).error(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		    });
	}
	
	_templatesService.prototype.deploySampleDashboard = function($scope,sampleId,application,themeId) {
		
		$scope.showSpinner = true;
		var hrRequest = [];
		hrRequest.push(sampleId);
		hrRequest.push(application);
		hrRequest.push(themeId);

		$http({
		    url: '/deploySampleDashboard',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		    }).success(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		        alert(data);
		    }).error(function (data, status, headers, config) {
		    	$scope.showSpinner = false;
		    });
	}
	
	return new _templatesService();
});
