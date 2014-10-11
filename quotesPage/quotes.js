angular.module('quotesPageApp', ['ui.slider'])
.controller("QuotesController",['$scope','quotesService',function($scope, quotesService){
	$scope.quotes = quotesService.getQuotes();
	$scope.filters = quotesService.getFilters();
	$scope.filterCriterias = {
		price : [$scope.filters.sliders[0].min,$scope.filters.sliders[0].max],
		carrier:{}
	}
	$scope.quotesFilter = function(quote){
		var price = quote.price;
		var priceFilterCriteria = $scope.filterCriterias.price;
		var carrierCriteria = $scope.filterCriterias.carrier;
		if(priceFilterCriteria[0] > price || price > priceFilterCriteria[1])
			return false;
		if(! _.isEmpty(carrierCriteria) && ! carrierCriteria[quote.carrier])
			return false;
		return true;
	}
}])
.factory("quotesService",function(){
	var data = 
	{ 	
		quotes: [],
		filters:{
			sliders : [
				{
					name: "Price",
					min: "0",
					max: "60"
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

	for(var i = 0; i < 1; i++){
		data.quotes.push(
		{
				planId : _.random(0, 1000),
				planName : "Plan "+ _.random(0, 1000),
				price: _.random(1, 60),
				carrier: "Carrier 1"
		});
	}
	return {
		getQuotes: getQuotes,
		getFilters: getFilters
	}

})
.directive("quotes",function(){
	return {
      templateUrl: "/templates/quotes.html",
      restrict: 'E'
    };
});