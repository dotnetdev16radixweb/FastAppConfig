angular.module('ElasticSearch.controllers', ['ElasticSearch.services']).
controller('ElasticSearchController', function($scope,$window,esearch) {
    
	$scope.selectedNode = null;
	$scope.healthrulename = '';
	
	esearch.getApps($scope);
	
	$scope.deployHR = function(){
		esearch.deployHR($scope.selectedApp,$scope.selectedTier,$scope.selectedNode,$scope.clustername,$scope.healthrulename);
	};
	
	$scope.deployDash = function(){
		esearch.deployDash($scope.selectedApp,$scope.selectedTier,$scope.selectedNode,$scope.clustername,$scope.healthrulename,$scope.dashboardname);
	};
	
	$scope.applicationChanged = function(){
		esearch.getTiers($scope,$scope.selectedApp);
		$scope.selectedTier = null;
		$scope.dashboardname = $scope.selectedApp.name + ' - Elastic Search';
	};
	
	$scope.tierChanged = function(){
		console.log(this.selectedTier);
		if(this.selectedTier){
			esearch.getNodes(this,$scope.selectedApp,this.selectedTier);
		}
	};
	
});