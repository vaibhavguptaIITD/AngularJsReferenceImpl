angular.module('zipCountyApp', ["initializationApp"])
.controller("ZipCountyController", function(){

})
.directive("county", ["demographicService", function(demographicService){
	return {
		restrict: "E",
		template: 
		 '	<select id="county">'+
          		'<option value="">Select County</option>'+
        	'</select>'
		,
		require : "ngModel",
		replace: "true",
		compile: function compile(tElement, tAttrs, transclude) {
	      return {
	        pre: function preLink(scope, iElement, iAttrs, controller) {
	        	iAttrs.ngOptions = "county for county in "+iAttrs.ngModel.replace(".","_")+".countyList";
	        },
	        post: function(scope, element, attrs, ngModelController){
				var zipcontrolgroup = attrs.ngModel.replace(".","_");
				scope.$watch(attrs["hcZip"], function(zip){
					var countyList = null,
					county = null,
					demographicData = null;
					if(zip){
						demographicData = demographicService.getDemographicData(zip);
						countyList = demographicService.getCountiesForZipInDemographicData(zip, demographicData);
						if(countyList && countyList.length == 1){
							county = countyList[0];
						}
					}
					scope[zipcontrolgroup] = {
						countyList : countyList,
						demographicData : demographicData
					};
					ngModelController.$setViewValue(county);
					ngModelController.$render(function(){
						element.val(county);
					});	
				});
			}
	      }
	    }
	}
}])
.directive("hcCounty", ["demographicService",function(demographicService){
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ngModelController){
			var zipcontrolgroup = attrs.hcCounty.replace(".","_");
			scope.$watch(attrs["hcCounty"], function(county){
				var state = null;
				var demographicData = (scope[zipcontrolgroup]) ? scope[zipcontrolgroup].demographicData : null;
				if(demographicData) {
					if(county) {
						state = demographicService.getStateForCountyInDemographicData(county, demographicData);
					}
					else {
						state = null;
					}
				}
				ngModelController.$setViewValue(state);
				ngModelController.$render(function(){
					element.val(county);
				});	
			});
		}
	}
}])
.factory("demographicService", function(){
	var groupDemographicData = {},
	zipCountyState = 
	{	
		"80002":
		[
			{"id":47340,"zipCode":"80002","county":"ADAMS","stateCode":"CO","city":"ARVADA","state":null},
			{"id":47341,"zipCode":"80002","county":"JEFFERSON","stateCode":"CO","city":"ARVADA","state":null}
		],
		"80001":
		[{"id":47339,"zipCode":"80001","county":"JEFFERSON","stateCode":"CO","city":"ARVADA","state":null}]
	},
	getDemographicData = function(zip){
		var demographicData = zipCountyState[zip];
		return demographicData;
	},
	getCountiesForZipInDemographicData = function(zip, demographicData){
		var counties = null;
		if(demographicData && demographicData.length){
			counties = demographicData.map(function(data){
			return data.county;
			});
		}
		return counties;
	},
	getStateForCountyInDemographicData = function(county, demographicData){
		var state;
		for(var i = 0; i < demographicData.length; i++){
			var data = demographicData[i];
			if(county == data.county){
				state = data.stateCode;
				break;
			}
		}
		return state;
	},
	setDemographicDataForGroup = function(demographicData, group){
		groupDemographicData[group] = demographicData;
	},
	getDemographicDataForGroup = function(group){
		return groupDemographicData[group];
	};
	return {
		getDemographicData : getDemographicData,
		getCountiesForZipInDemographicData : getCountiesForZipInDemographicData,
		getStateForCountyInDemographicData : getStateForCountyInDemographicData,
		setDemographicDataForGroup : setDemographicDataForGroup,
		getDemographicDataForGroup : getDemographicDataForGroup
	}
});