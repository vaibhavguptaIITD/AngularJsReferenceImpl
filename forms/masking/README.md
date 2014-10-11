Reference Implementation
========================
Masking demo
-----------------------------------------
This demo shows how to create masking on inputs.

	<input type="text" class="form-control" id="dob" name="dob" 
	placeholder="Date of Birth" **ui-mask="dob"** ng-model="employee.dob" 
	ng-initial value="11/11/1989">