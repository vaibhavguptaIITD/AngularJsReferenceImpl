angular.module('datePickerApp', ["initializationApp"])
.controller("DatePickerController",[function($scope){
}])
.directive('hcDate', function() {
    return {
        restrict: "E",
        templateUrl: "/templates/date.html",
        require: "ngModel",
        replace: "true",
        scope: {
            name : "@",
            id: "@"
        },
        controller : function($scope){
            $scope.dateCollection = {};
            //If any of month, day, year changes change the hidden date field
            $scope.$watchCollection('dateCollection', function(newValue){
                if(newValue.month && newValue.day && newValue.year){
                    $scope.date = newValue.month + "/" + newValue.day + "/" + newValue.year;
                }
            });

            function getDays(){
                var days =[];
                for(var i = 1; i < 32; i++){
                    if(i < 10){
                        days.push("0"+i);
                    }
                    else{
                        days.push(i);
                    }
                }
                return days;
            }

            function getYears(){
                var years = [],
                currentYear = new Date().getFullYear();
                for(var i = 0; i < 100 ; i++){
                    years.push(currentYear - i + "");
                }
                return years;
            }
           
            $scope.days = getDays();
            $scope.years = getYears();

        },
        link : function(scope, element, attrs, ngModelCtrl){
            scope.$watch('date', function(newDate){
                ngModelCtrl.$setViewValue(newDate);
            });
            
            ngModelCtrl.$render = function(){
                var viewValue = ngModelCtrl.$viewValue;
                if(viewValue){
                    var viewDateStr = viewValue.split("/");
                    if(viewDateStr.length == 3){
                        var month = viewDateStr[0],
                        year = viewDateStr[2],
                        day = viewDateStr[1];
                        scope.dateCollection.month = month;
                        scope.dateCollection.day = day;
                        scope.dateCollection.year = year;
                    }
                }
            }
        }
    }
})
.filter("range", function(){
     return function(val, range) {
            var rangeArray = range.split(","),
            rangeMin, rangeMax;
            if(rangeArray.length == 2){
                rangeMin = parseInt(rangeArray[0]);
                rangeMax = parseInt(rangeArray[1]);
            }
            else{
                rangeMin = 0;
                rangeMax = parseInt(rangeArray[0]);
            }
            for (var i=rangeMin; i<rangeMax; i++)
              val.push(i);
            return val;
          };
});

