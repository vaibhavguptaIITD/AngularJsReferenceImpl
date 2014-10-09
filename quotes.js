angular.module('quotesPageApp', [])
.controller("QuotesController",['$scope','quotesService',function($scope, quotesService){
	$scope.quotes = quotesService.getQuotes();
	$scope.filters = quotesService.getFilters();
}])
.factory("quotesService",function(){
	var data = 
	{
		quotes: [
			{
				planId : "1",
				planName : "Plan 1",
				price: "56",
				carrier: "Carrier 1"
			},
			{
				planId : "2",
				planName : "Plan 2",
				price: "10",
				carrier: "Carrier 2"
			},
			{
				planId : "3",
				planName : "Plan 3",
				price: "20",
				carrier: "Carrier 1"
			},
			{
				planId : "4",
				planName : "Plan 4",
				price: "30",
				carrier: "Carrier 2"
			}
		],
		filters:{
			sliders : [
				{
					name: "Price",
					min: "0",
					max: "50"
				}
			],
			checkboxGroups: [
				{
					name: "carriers",
					group: ["Carrier 1", "Carrier 2"]
				}
			]
		}
	},
	getQuotes = function(){
		return data.quotes;
	},
	getFilters = function(){
		return data.filters;
	}
	return {
		getQuotes: getQuotes,
		getFilters: getFilters
	}

})
.directive("quotes",function(){
	return {
      templateUrl: "/templates/quotes.html"
    };
})
.directive("sliderFilter", function(){
	var controller = function($scope){
		$scope.min = $scope.min || 0;
		$scope.max = $scope.max || 100;
		this.setMin = function(min){
			$scope.min = min;
		}
		this.setMax = function(max){
			$scope.max = max;
		}
	}

	var linker = function(scope, element, attrs){
		var $sliderControl = $(element[0]).find(".sliderControl"),
		min = scope.min, 
		max = scope.max,
		type = scope.type,
		sliderOpts = {min: min, max: max};
		if(type == "range"){
			sliderOpts.range = true;
			sliderOpts.slide = function(event, ui){
				scope.interimValues = ui.values;
				scope.$apply();
			}
			sliderOpts.change = function(event, ui){
				scope.values = ui.values;
				scope.$apply();
			}
		}
		else{
			sliderOpts.slide = function(event, ui){
				scope.interimValue = ui.value;
				scope.$apply();
			}
			sliderOpts.change = function(event, ui){
				scope.value = ui.value;
				scope.$apply();
			}
		}
		$sliderControl.slider(sliderOpts);
	}
	return {
		scope : {
			"type" : "@"
		},
		templateUrl: "/templates/slider.html",
		link : linker,
		controller: controller
	}
})
.directive("price", ['quotesService',function(quotesService){
	var filter = {min:10, max:100},
	linker = function(scope, element, attrs, sliderFilterCtrl){
		sliderFilterCtrl.setMin(filter.min);
		sliderFilterCtrl.setMax(filter.max);
	};
	return {
		require: "sliderFilter",
		link : linker,
		scope: true
	};
}]);