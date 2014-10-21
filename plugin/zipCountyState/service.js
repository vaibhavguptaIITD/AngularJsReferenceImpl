angular.module('zipCountyApp')
.factory("demographicService", function(){
	var groupDemographicData = {},
	zipCountyState = 
	{	
		"80002":
		[
			{"id":47340,"zipCode":"80002","county":"ADAMS","stateCode":"CO","city":"ARVADA","state":null},
			{"id":47341,"zipCode":"80002","county":"JEFFERSON","stateCode":"CO","city":"ARVADA","state":null}
		],
		"80001":
		[{"id":47339,"zipCode":"80001","county":"JEFFERSON","stateCode":"CO","city":"ARVADA","state":null}]
	},
	getDemographicData = function(zip){
		var demographicData = zipCountyState[zip];
		return demographicData;
	},
	getCountiesForZipInDemographicData = function(zip, demographicData){
		var counties = null;
		if(demographicData && demographicData.length){
			counties = demographicData.map(function(data){
			return data.county;
			});
		}
		return counties;
	},
	getStateForCountyInDemographicData = function(county, demographicData){
		var state;
		for(var i = 0; i < demographicData.length; i++){
			var data = demographicData[i];
			if(county == data.county){
				state = data.stateCode;
				break;
			}
		}
		return state;
	},
	setDemographicDataForGroup = function(demographicData, group){
		groupDemographicData[group] = demographicData;
	},
	getDemographicDataForGroup = function(group){
		return groupDemographicData[group];
	};
	return {
		getDemographicData : getDemographicData,
		getCountiesForZipInDemographicData : getCountiesForZipInDemographicData,
		getStateForCountyInDemographicData : getStateForCountyInDemographicData,
		setDemographicDataForGroup : setDemographicDataForGroup,
		getDemographicDataForGroup : getDemographicDataForGroup
	}
});