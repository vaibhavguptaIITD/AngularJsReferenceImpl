Reference Implementation
========================
Validation demo
-----------------------------------------
This demo has custom validation using directives. 

	<input type="text" class="form-control" id="dob" name="dob" placeholder="Date of Birth" 
	ui-mask="dob" ng-model="employee.dob" ng-initial value="11/11/1989" hc-mmddyyyy ng-required="true">
    <span ng-show="employeeForm.dob.$error.hcMmddyyyy">Invalid dob format</span>
    <span ng-show="employeeForm.dob.$error.required">DOB is required</span>

For further reference see [https://docs.angularjs.org/guide/forms](https://docs.angularjs.org/guide/forms)