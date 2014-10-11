angular.module('initializationApp', [])
.controller("EmployeeFormController",[function($scope){
}])
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
});
