angular.module('ElasticSearch.services',[])
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
.factory('esearch', function($http,$location) {
	
	function _eSearchService(){
		
	}
	
	_eSearchService.prototype.getApps = function($scope) {
		$http.get('/applications.json').success(function(result) {
			$scope.applications = result;
		});	
	}
	
	_eSearchService.prototype.getTiers = function($scope,app) {
		$http.get('/tiers/'+app.id).success(function(result) {
			$scope.tiers = result;
		});	
	}
	_eSearchService.prototype.getNodes = function($scope,app,tier) {
		$http.get('/nodes/'+app.id+"/"+tier.id).success(function(result) {
			$scope.$parent.selectedTier = tier;
			$scope.$parent.nodes = result;
			$scope.$parent.$apply;
		});	
	}
	
	_eSearchService.prototype.deployHR = function(app,tier,node,cluster,hrname) {
		
		var hrRequest = [];
		hrRequest.push(app.id);
		hrRequest.push(app.name);
		hrRequest.push(tier.id);
		hrRequest.push(tier.name);
		hrRequest.push(node.name);
		hrRequest.push(cluster);
		hrRequest.push(hrname);
				
		$http({
		    url: '/elasticsearch/postpackage-hr',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		}).success(function (data, status, headers, config) {
		    alert(data);
	    }).error(function (data, status, headers, config) {
	    	alert(data);
	    });
	}
	
	_eSearchService.prototype.deployDash = function(app,tier,node,cluster,hrname,dashboardname) {
		
		var hrRequest = [];
		hrRequest.push(app.id);
		hrRequest.push(app.name);
		hrRequest.push(tier.id);
		hrRequest.push(tier.name);
		hrRequest.push(node.name);
		hrRequest.push(cluster);
		hrRequest.push(hrname);
		hrRequest.push(dashboardname);
				
		$http({
		    url: '/elasticsearch/postpackage-dash',
		    method: "POST",
		    data: JSON.stringify(hrRequest),
		    headers: {'Content-Type': 'application/json'}
		}).success(function (data, status, headers, config) {
		    alert(data);
	    }).error(function (data, status, headers, config) {
	    	alert(data);
	    });
	}
	
	return new _eSearchService();
});
