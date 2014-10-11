angular.module('employeePageApp', [])
.controller("EmployeeController",['$scope','employeeService',function($scope, employeeService){
	$scope.employees = employeeService.getEmployees();
	$scope.addEmployee = function(){
		$scope.employees.push({});
	};

	$scope.removeEmployee = function(index){
		$scope.employees.splice(index,1);
	};
}])
.factory("employeeService",function(){
	var data = 
	{ 	
		employees: []
	},
	getEmployees = function(){
		return data.employees;
	}

	for(var i = 0; i < 2; i++){
		data.employees.push(
		{
				employeeId : _.random(0, 1000),
			 	name : "Employee "+ _.random(0, 1000),
			 	family: [
			 	{
			 		id: _.random(0,1000),
			 		name: "Dependent " + _.random(0, 1000),
			 		relationship: "Spouse"
			 	},
			 	{
			 		id: _.random(0, 1000),
			 		name: "Dependent " + _.random(0, 1000),
			 		relationship: "Child"
			 	}]
		});
	}
	return {
		getEmployees: getEmployees
	}

});