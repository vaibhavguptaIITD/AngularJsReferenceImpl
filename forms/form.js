angular.module('formApp', [])
.controller("EmployeeFormController",['$scope','demographicService',function($scope, demographicService){
	
}])
.factory("demographicService",function(){
	var data = {},
	getZip = function(zip){
		return data[zip];
	},
	seedzip = 1000;
	for(var i = 0; i < 1000; i++){
		var zip = seedzip + i;
		data[zip] = {
			county: [zip + "c1", zip + "c2"],
			state : zip+"s"
		};
	}
	return {
		getZip: getZip
	}

})
.directive('ngInitial', function($parse) {
    return {
        restrict: "A",
        compile: function($element, $attrs) {
            var initialValue = $attrs.value || $element.val();
            return {
                pre: function($scope, $element, $attrs) {
                    $parse($attrs.ngModel).assign($scope, initialValue);
                }
            }
        }
    }
})
.directive('uiMask', [
  function () {
    return {
      require:'ngModel',
      scope: {
      	type : "@uiMask"
      },
      controller: function($scope){
      	$scope.dob = "99/99/9999";
      	$scope.zip = "99999";
      },
      link:function ($scope, element, attrs, controller) {

      	var $element = $(element[0]);
      	$element.mask($scope.$eval($scope.type));
        /* Add a parser that extracts the masked value into the model but only if the mask is valid
         */
        controller.$parsers.push(function (value) {
          var isValid = value.length && value.indexOf("_") == -1;
          return isValid ? value : undefined;
        });
        /* When keyup, update the view value
         */
        element.bind('keyup', function () {
          $scope.$apply(function () {
            controller.$setViewValue(element.val());
          });
        });
      }
    };
  }
]);