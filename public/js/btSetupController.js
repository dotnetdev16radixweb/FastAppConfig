angular.module('BTSetupApp.controllers', ['BTSetupApp.services']).
controller('BTSetupController', function($scope,$window,btSetupService) {
    
	btSetupService.getApps($scope);
	$scope.timeFrame = "60";
	$scope.showSpinner = 0;
	$scope.btListTopCount = "10";

	$scope.applicationChanged = function(){
		btSetupService.getBTs($scope);
	};

	$scope.timeFrameChanged = function(){
		if ($scope.selectedApp)
		{
			btSetupService.getBTs($scope);
		}
	};	

	$scope.chooseBtListTopCount = function(){
		if ($scope.selectedApp)
		{
			btSetupService.getBTs($scope);
		}
	};	

	$scope.deleteAll = function(item){

		for (var i = 0; i < $scope.btList.length; i++)
		{
			$scope.btList[i].delete = item.checkAll1;
		}
	};

	$scope.addToList = function(item){

		item.createCMR = true;
	};

	$scope.removeFromList = function(item){

		item.createCMR = false;
	};

	$scope.deleteOne = function(item){

		if (!item.bt.delete)
		{
			item.$parent.checkAll1 = false;
		}
	};

	$scope.delete = function() {
    	
    	if (confirm("Are you sure you want to delete the selected BTs?")) 
    	{
			var deleteList = [];

			for (var i = 0; i < $scope.btList.length; i++)
			{
				if($scope.btList[i].delete)
				{
					deleteList.push($scope.btList[i]);
				}
			}

			if (deleteList.length > 0)
			{
				btSetupService.deleteBTs($scope,deleteList,$scope.timeFrame,$scope.btListTopCount);
			}
	  	}
	};

  	$scope.create = function() {
	
	    if (confirm("Are you sure you want to create the Custom Match Rules below?")) 
	    {
	    	var createList = [];

			for (var i = 0; i < $scope.btList.length; i++)
			{
				if($scope.btList[i].createCMR)
				{
					createList.push($scope.btList[i]);
				}
			}

			btSetupService.createCustomMatchRules($scope,createList);
	  	}
	};
});

