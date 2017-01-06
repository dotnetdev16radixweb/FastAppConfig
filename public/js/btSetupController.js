angular.module('BTSetupApp.controllers', ['BTSetupApp.services']).
controller('BTSetupController', function($scope,$window,btSetupService) {
    
	btSetupService.getApps($scope);
	$scope.timeFrame = "60";
	$scope.showSpinner = false;
	$scope.btListTopCount = "10";
	$scope.orderBy1 = "oldName";
	$scope.orderByDesc1 = false;
	$scope.orderBy2 = "oldName";
	$scope.orderByDesc2 = false;
	$scope.orderBy3 = "oldName";
	$scope.orderByDesc3 = false;
	$scope.orderBy4 = "oldName";
	$scope.orderByDesc4 = false;

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

  	$scope.sortGrid1 = function(soryByName) {

  		if ($scope.orderBy1 == soryByName)
  		{
  			$scope.orderByDesc1 = !$scope.orderByDesc1;
  		}
  		else
  		{
  			$scope.orderByDesc1 = false;
  		}
  		$scope.orderBy1 = soryByName;
	};

  	$scope.sortGrid2 = function(soryByName) {

  		if ($scope.orderBy2 == soryByName)
  		{
  			$scope.orderByDesc2 = !$scope.orderByDesc2;
  		}
  		else
  		{
  			$scope.orderByDesc2 = false;
  		}
  		$scope.orderBy2 = soryByName;
	};

  	$scope.sortGrid3 = function(soryByName) {

  		if ($scope.orderBy3 == soryByName)
  		{
  			$scope.orderByDesc3 = !$scope.orderByDesc3;
  		}
  		else
  		{
  			$scope.orderByDesc3 = false;
  		}
  		$scope.orderBy3 = soryByName;
	};

  	$scope.sortGrid4 = function(soryByName) {

  		if ($scope.orderBy4 == soryByName)
  		{
  			$scope.orderByDesc4 = !$scope.orderByDesc4;
  		}
  		else
  		{
  			$scope.orderByDesc4 = false;
  		}
  		$scope.orderBy4 = soryByName;
	};					

});

