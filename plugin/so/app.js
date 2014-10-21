	angular.module('validationApp', [])
	.controller("ValidationController", function(){

	})
	.directive("customInput", function(){
		return {
			restrict: "E",
			require : "ngModel",
			templateUrl : "/templates/customInput.html",
			scope : {
				id : "@", //bind id to scope
				name : "@", //bind name to scope,
				value : "=ngModel"
			}
		}
	});