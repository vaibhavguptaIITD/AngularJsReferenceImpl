angular.module('formApp', ["hcValidation", "maskingApp"])
.controller("EmployeeFormController",['$scope',function($scope){
  //will probably find a cleaner way to add the pattern. This is not reusable code
	$scope.pattern = {
    email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  };
  $scope.employee = {};
  $scope.addDependent = function(){
    if($scope.employee.dependents){
      $scope.employee.dependents.push({});
    }
    else{
      $scope.employee.dependents = [{}];
    }
  }
  $scope.removeDependent = function(index){
    $scope.employee.dependents.splice(index, 1);
  }
}])
.directive('hcName', function() {
    return {
      restrict: 'A',
      priority: -1,
      require: 'ngModel',
      compile : function(){
        return {
          pre : function(scope, iElement, iAttrs){
            iElement[0].name = iAttrs.hcName;
          },
          post: function (scope, iElement, iAttrs, ngModelCtrl) {
              ngModelCtrl.$name = iAttrs.hcName;
          }
        }
      }
    };
});