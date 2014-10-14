angular.module('datePickerApp', ["initializationApp"])
.controller("DatePickerController",[function($scope){
}])
.directive('hcDate', function() {
    return {
        restrict: "EA",
        templateUrl: "/templates/dob.html",
        require: "?ngModel",
        replace: "true",
        scope: {
            name : "@",
            format: "@"
        },
        priority: -1,
        controller : function($scope){
            $scope.dateCollection = [];
            function updateValueInScope(index, value){
                $scope.$apply(function(){
                    $scope.dateCollection[index] = value;    
                });
            }
            $scope.updateMonthInScope = function(month){
                updateValueInScope(0, month);
            };
            $scope.updateYearInScope = function(year){
                 updateValueInScope(2, year);
            };
            $scope.updateDayInScope = function(day){
                updateValueInScope(1, day);
            };

            //If any of month, day, year changes change the hidden date field
            $scope.$watchCollection('dateCollection', function(newValue){
                if(newValue.length == 3){
                 var newDate = moment(
                         {
                             month: newValue[0],
                             day: newValue[1], 
                             year: newValue[2]
                         });
                     if(newDate.isValid()){
                        $scope.date=  newDate.format($scope.format);
                     }
                     else {
                         $scope.date = undefined;
                     }
                }
            });
        },
        link : function(scope, element, attrs, ngModelCtrl){
            var $month = element.find(".month"),
            $day = element.find(".day"),
            $year = element.find(".year");
            $month.change(function(){
                scope.updateMonthInScope($month.val());
            });
            $year.change(function(){
                scope.updateYearInScope($year.val());
            });
            $day.change(function(){
                scope.updateDayInScope($day.val());
            });
            //If hidden date changes, change the main model
            scope.$watch('date', function(newDate){
                ngModelCtrl.$setViewValue(newDate);
            });
            
            ngModelCtrl.$render = function(){
                var viewValue = ngModelCtrl.$viewValue;
                if(viewValue){
                    var viewDate = moment(viewValue, scope.format);
                    if(viewDate.isValid()){
                        var month = viewDate.month(),
                        year = viewDate.year(),
                        day = viewDate.date();
                        scope.dateCollection[0] = month;
                        scope.dateCollection[1] = day;
                        scope.dateCollection[2] = year;
                    }
                }
            }
        }
    }
});

