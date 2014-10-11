angular.module('formApp', ["hcValidation", "maskingApp"])
.controller("EmployeeFormController",['$scope',function($scope){
  //will probably find a cleaner way to add the pattern. This is not reusable code
	$scope.pattern = {
    email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  };
}]);