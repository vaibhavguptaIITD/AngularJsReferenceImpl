angular.module('employeeApp', ["initializationApp"])
.controller("EmployeeFormController",[function($scope){
}])
//Directive for masking inputs in form.
.directive('uiMask', [
  function () {
    return {
      require:'ngModel',
      scope: {
      	type : "@uiMask"
      },
      controller: function($scope){
        //Masking types are defined here. This will be shared across the application. To create a new masking,
        //add it as a property of scope here. Since this is isolated scope, it will not mess with parent scope.
      	$scope.dob = "99/99/9999";
      	$scope.zip = "99999";
      },
      link:function ($scope, element, attrs, ngModelCtrl) {

      	var $element = $(element[0]);
      	$element.mask($scope.$eval($scope.type));
        /* Add a parser that extracts the masked value into the model but only if the mask is valid
         */
        ngModelCtrl.$parsers.push(function (value) {
          var isValid = value.length && value.indexOf("_") == -1;
          return isValid ? value : undefined;
        });
        /* When keyup, update the view value. I am not 100% percent convinced on this.
        Asked a question on (stack overflow)[http://stackoverflow.com/questions/26310408/integrate-jquery-masked-input-as-angularjs-directive]
         */
        element.bind('keyup', function () {
          $scope.$apply(function () {
            ngModelCtrl.$setViewValue(element.val());
          });
        });
      }
    };
  }
]);