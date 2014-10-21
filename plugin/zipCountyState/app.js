angular.module('zipCountyApp', ["initializationApp"])
.controller("ZipCountyController", function(){

})
.directive("county", ["demographicService", function(demographicService){
	return {
		restrict: "E",
		template: 
		 '	<select id="county" class="_countySelect">'+
          		'<option value="">Select County</option>'+
        	'</select>'+
        	'<input type="hidden" class="_county">'
		,
		require : "ngModel",
		compile: function compile(tElement, tAttrs, transclude) {
	      return {
	        pre: function preLink(scope, iElement, iAttrs, controller) {
	        	iElement.find("._countySelect").attr("ng-model",iAttrs.ngModel).attr("ng-options","county.name as county.value for county in "+iAttrs.ngModel.replace(".","_")+".countyList")
	        	iElement.find("._county").attr("ng-bind",iAttrs.ngModel).attr("name", iAttrs.name);
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
							county = countyList[0].value;
						}
					}
					scope[zipcontrolgroup] = {
						countyList : countyList,
						demographicData : demographicData
					};
					ngModelController.$setViewValue(county);
					ngModelController.$render(function(){
						element.find("._countySelect").val(county);
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
