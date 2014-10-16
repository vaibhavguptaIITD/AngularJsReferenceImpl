angular.module('scopeApp', [])
.controller("ScopController", function(){

})
.directive("zipModel", function(){
	return {
		require : "ngModel",
		link: function(scope, element, attrs, ngModelController){
			scope.$watch(attrs["zipModel"], function(zip){
				if(zip){
					var county = zip + " County"
					ngModelController.$setViewValue(county);
					ngModelController.$render(function(){
						element.val(county);
					});	
				}	
			});
		}
	}
});