angular.module('BTSetupApp.services',[])
.factory('btSetupService', function($http) {
	
	function BTSetup(){
		this.data = null;
	}
	
	function _btSetupService(){
		this.btSetup = new BTSetup();
	}
	
	function formatBTName(btURI)
	{
		var keepGoing = true;
		var currentIndex = btURI.indexOf("/");
		var replacementString = "";

		if (btURI == "/")
		{
			btURI = "Root"
		}
		else
		{
			while (currentIndex >= 0)
			{
				if (btURI.length > currentIndex)
				{
					btURI = btURI.slice(0,currentIndex) + replacementString + btURI.charAt(currentIndex+1).toUpperCase() + btURI.slice(currentIndex+2)
				}

				currentIndex = btURI.indexOf("/", currentIndex + 1);
				replacementString = ".";

			}
		}
		return btURI;
	}

	function initializeBTList(btList)
	{
		for (var i = btList.length - 1; i >= 0; i--) 
        {
        	var btListItem = btList[i];
        	btListItem.priority = "20";
        	btListItem.uri = btListItem.name;
        	btListItem.criteria = "STARTSWITH";
        	btListItem.oldName = btListItem.name;
        	btListItem.name = formatBTName(btListItem.name);
        }

        return btList;
	}

	_btSetupService.prototype.getBTs = function($scope) {
	
		$scope.showSpinner = 1;
		console.log("getBTs");

		$http.get('/btSetup/bts/'+$scope.selectedApp.name+"/"+$scope.timeFrame+"/"+$scope.btListTopCount).success(function(result) {	
	        $scope.btList = initializeBTList(result);
	        $scope.showSpinner = 0;
		});
	}

	_btSetupService.prototype.getApps = function($scope) {
		$http.get('/applications.json').success(function(result) {
			$scope.applications = result;
		});	
	}

	_btSetupService.prototype.createCustomMatchRules = function($scope,btList) {

		$scope.showSpinner = 1;
		var postData = [];
		postData.push($scope.selectedApp.id);
		postData.push(btList);
				
		$http({
		    url: '/btSetup/bts/createBTs',
		    method: "POST",
		    data: JSON.stringify(postData),
		    headers: {'Content-Type': 'application/json'}
	    }).success(function (result) {

	    	$scope.showSpinner = 0;
			alert("Successfully created " + result + " custom match rules.");
	    }).error(function(result) {
	    	$scope.showSpinner = 0;
	    	alert(result);
	    });
	}

	_btSetupService.prototype.deleteBTs = function($scope,btList,timeFrame,btListTopCount) {

		$scope.showSpinner = 1;
		var postData = [];
		postData.push($scope.selectedApp.name);
		postData.push(btList);
		postData.push(timeFrame);
		postData.push(btListTopCount);

		$http({
		    url: '/btSetup/bts/deleteBTs',
		    method: "POST",
		    data: JSON.stringify(postData),
		    headers: {'Content-Type': 'application/json'}
	    }).success(function (result) {
	    	$scope.showSpinner = 0;
	    	$scope.btList = initializeBTList(result);
	    	alert("Successfully deleted " + btList.length + " business transactions.");
	    }).error(function (result) {
	    	$scope.showSpinner = 0;
	    	alert(result);
	    });
	}

	return new _btSetupService();

});
