angular.module('zipCountyApp', ["initializationApp"])
.controller("ZipCountyController", ["$scope", function($scope){
	$scope.employee = {
		address: {
			"streetAddress": "Address1"
		}
	}
}])
.directive("zipWidget", ["demographicService", function(demographicService){
	return {
		require: ["ngModel","^form"],
		templateUrl : "/templates/zipWidget.html",
		scope: {
			address: "=ngModel",
			zip: "@",
			county: "@",
			state: "@"
		},
		restrict: "E",
		controller: function($scope){
			$scope.countyList = [];
		},
		link : function($scope, element, attrs, controllers){
			var ngModelController = controllers[0];
			myFormController = controllers[1];
			$scope.address = $scope.address || {};
			var demographicData = null;
			$scope.$watch("zip", function(newZip, oldZip){
				var countyList = null;
				if(newZip.length == 5){
					//fetch data from demographicService
					demographicData = demographicService.getDemographicData(newZip);
					//fetch county list
					countyList = demographicService.getCountiesForZipInDemographicData(zip, demographicData);
				}
				$scope.countyList = countyList;
				$scope.address.zip = newZip;
			});
			$scope.$watchCollection("countyList", function(newCountyList, oldCountyList){
				var county = $scope.county;
				if(newCountyList && newCountyList.length){
					if(newCountyList.length == 1)
						county = newCountyList[0];
					else if($.inArray(county, newCountyList) == -1){
						county = null;
					}
				}
				else{
					county = null;
				}
				$scope.county = county;
			});
			$scope.$watch("county", function(newCounty, oldCounty){
				var state = null;
				if(newCounty){
					state = demographicService.getStateForCountyInDemographicData(newCounty, demographicData);
				}
				$scope.state = state;
				$scope.address.county = newCounty;
			});
			$scope.$watch("state", function(newState, oldState){
				$scope.address.state = newState;
			});
		}
	};
}]);