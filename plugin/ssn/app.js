angular.module('ssnApp', ["initializationApp"])
.controller("SSNController", function($scope){

})
.directive("hcSsn", function(){
	 return {
        restrict: "E",
        templateUrl: "/templates/ssn.html",
        require: "ngModel",
        replace: "true",
        scope: {
            name : "@",
            id: "@"
        },
        controller : function($scope){
            $scope.ssnCollection = [];
            $scope.$watchCollection('ssnCollection', function(newValue){
                if(newValue.length == 3 && newValue[0] && newValue[1] && newValue[2]){
                    $scope.ssn = newValue[0] + "-" + newValue[1] + "-" + newValue[2];
                }
                else{
                	$scope.ssn = null;
                }
            });
        },
        link : function(scope, element, attrs, ngModelCtrl){
            scope.$watch('ssn', function(newSSN){
                ngModelCtrl.$setViewValue(newSSN);
            });
            //Assumption is the format has to be xxx-xx-xxxx
            ngModelCtrl.$render = function(){
                var viewValue = ngModelCtrl.$viewValue;
                if(viewValue){
                    var viewValueArr = viewValue.split("-");
                    if(viewValueArr.length == 3){
                    	scope.ssnCollection = viewValueArr;
                    }
                }
            }
        }
    }
})
.directive("hcFocusOn", ["$timeout","$parse", function($timeout, $parse){
    return {
        link : function(scope, element, attrs) {
             var model = $parse(attrs.hcFocusOn);
              scope.$watch(model, function(value) {
                if(value === true) { 
                  $timeout(function() {
                    element[0].focus(); 
                  });
                }
              });
            }
    };
}])
.directive("hcNumeric", function(){
    var linker = function(scope, element, attrs){
        element.numeric();
    }
    return {
        require: "ngModel",
        link : linker
    }
});
