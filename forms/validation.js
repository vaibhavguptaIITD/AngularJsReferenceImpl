
angular.module('hcValidation', [])
.directive('hcEqual', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.hcEqual) {
                console.error('hcEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.hcEqual, function (value) {
                model.$setValidity('hcEqual', value === model.$viewValue);
            });
            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.hcEqual);
                model.$setValidity('hcEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
})
.directive("hcMmddyyyy", function(){
	var dateRegex = /^(?=\d)(?:(?:(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})|(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2}))($|\ (?=\d)))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\ [AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
  return {
    require : "ngModel",
    link: function(scope, elem, attrs, model){
      model.$parsers.push(function(value){
      	var isValid = (! value) || value.match(dateRegex) != null;
      	model.$setValidity('hcMmddyyyy', isValid);
        return isValid ? value : undefined;
      });
    }
  }
});