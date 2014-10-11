$.validator.addMethod("expiryDate", function(value, element, params) {
	var re = new RegExp("^(0[1-9]|1[012])/([0-9])([0-9])$");
	return this.optional(element) || re.test(value);
}, jQuery.validator.format("Please enter valid Expiry Date"));

$.validator.addMethod("require_from_cbgroup", function(value, element, options) {
	var selector = options[1];
	var validOrNot = $(selector, element.form).filter(function() {
		return $(this).attr("checked");
	}).length >= options[0];
	return validOrNot;
}, jQuery.validator.format("Please fill at least {0} of these fields."));

$.validator.addMethod("require_from_group", function(value, element, options) {
	var selector = options[1];
	var validOrNot = $(selector, element.form).filter(function() {
		return $(this).val().replace(/^\s+|\s+$/g, "") != "" ;
	}).length >= options[0];
	return validOrNot;
}, jQuery.validator.format("Please fill at least {0} of these fields."));

$.validator.addMethod("alphaNumSpecialChars", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z0-9.,_ \\-']+$");
	return this.optional(element) || re.test(value);
}, "Only alphanumeric and special characters(.-, ) are allowed");

$.validator.addMethod("alphaNumericWithSpace", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z0-9 ']+$");
	return this.optional(element) || re.test(value);
}, "Only alphanumeric are allowed");

$.validator.addMethod("nameWithSpecialChars", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z][a-zA-Z\\s\\-']*$");
	return this.optional(element) || re.test(value);
}, "Only alphanumeric, whitespaces and special characters(-') are allowed");


$.validator.addMethod("reqMask", function(value, element, params) {
	// console.log("condition: "+params);
	if(!params) {
		return true;
	}

	if(value.indexOf("_") !== -1) {
		value = '';
	}
	return $.trim(value).length > 0;
}, "This is required Mask Field");

$.validator.addMethod("reqHint", function(value, element, params) {
	// console.log("condition: "+params);
	if(!params) {
		return true;
	}
	var oelement = $(element);
	if(oelement.hasClass("blur") || oelement.val() === "") {
		return false;
	}
	return true;
}, "This is required Hint Field");

$.validator.addMethod("mmddyyyyDate", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id");
	var dirty = $(err_div).html() !== '' ? true : false;
	if((this.optional(element) || (value.indexOf("_") !== -1)) && !dirty) {
		return true;
	}

	if(!$(element).hasClass("mreq") && ((value.indexOf("_") !== -1) || (value === ''))) {
		return true;
	}

	return Utils.validateDate(value);
}, "Please enter valid Date.");
$.validator.addMethod("mmyyyyDate", function(value, element, params) {
	var err_div = "#err_"+$(element).attr("id");
	var dirty = $(err_div).html() != '' ? true : false;
	if ((this.optional(element) || (value.indexOf("_") !=-1)) && !dirty)
		return true;
	if ( !$(element).hasClass("mreq") && ((value.indexOf("_") !=-1) ||  (value=='')))
		return true;
	return Utils.validateDateMMyyyy(value);
}, "Please enter valid Date.");
$.validator.addMethod("ssn", function(value, element, params) {
	if(!params)
		return true;
	
	if(value === "") {
		return true;
	}
	var regex = new RegExp("^\\d{3}" + params.separator + "\\d{2}" + params.separator + "\\d{4}$");
	return regex.test(value);
}, "Please enter valid ssn");

$.validator.addMethod("telephoneExt", function(value, element, params) {
	if(!params)
		return true;
	
	if(value === "") {
		return true;
	}
	var regex = new RegExp("^\\d{10}" + params.separator + "\\d{3}$");
	return regex.test(value);
}, "Please enter valid phone number");

$.validator.addMethod("mmddyyyyDateOptional", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id");
	var dirty = $(err_div).html() !== '' ? true : false;

	if((value.indexOf("_") !== -1) && !dirty) {
		return true;
	}

	if(!$(element).hasClass("mreq") && ((value.indexOf("_") !== -1) || (value === ''))) {
		return true;
	}

	return Utils.validateDate(value);
}, "Please enter valid Date.");

$.validator.addMethod("atLeastOneContribution", function(value, element, params) {

	var name = element.name,
	absoluteName = name.replace('contriEmployeePercentage', 'contriEmployeeAbsolute'),
	absolute = $("input[name="+ absoluteName.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.')+"]").val();
	
	if(value === "" && absolute === "") {
		return false;
	}
	
	if(value === "" && absolute == null) {
		return false;
	}

	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid employee contribution");

$.validator.addMethod("atLeastOneDependentsContribution", function(value, element, params) {

	var name = element.name,
	absoluteName = name.replace('contriDependentsPercentage', 'contriDependentsAbsolute'),
	absolute = $("input[name="+ absoluteName.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.')+"]").val();
	
	if(value === "" && absolute === "") {
		return false;
	}
	
	if(value === "" && absolute == null) {
		return false;
	}

	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid employee contribution");

$.validator.addMethod("atLeastOneSpouseContribution", function(value, element, params) {

	var name = element.name,
	absoluteName = name.replace('contriSpousePercentage', 'contriSpouseAbsolute'),
	absolute = $("input[name="+ absoluteName.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.')+"]").val();
	
	if(value === "" && absolute === "") {
		return false;
	}

	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid employee contribution");

$.validator.addMethod("validAbsoluteContribution", function(value, element, params) {

	var name = element.name,
	absoluteName = element.name,
	absolute = $("input[name="+ absoluteName.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.')+"]").val();
	
	
	if(absolute !== "" && absolute > 9999.99 ){
		return false;
	}

	return true;

}, "Please enter valid absolute contribution");
$.validator.addMethod("greaterThan50", function(value, element, params) {


	if(value !== "" && value < 50 ) {
		return false;
	}

	return true;

}, "Employer must contribute at least 50% towards employee premium.");

$.validator.addMethod("employeeContribution", function(value, element, params) {


	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid employee contribution");

$.validator.addMethod("spouseContribution", function(value, element, params) {


	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid spouse contribution");


$.validator.addMethod("dependentsContribution", function(value, element, params) {

	if(value !== "" && value > 100) {
		return false;
	}

	return true;

}, "Please enter valid depenedents contribution");

$.validator.addMethod("zip", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id");
	var dirty = $(err_div).html() !== '' ? true : false;

	if((this.optional(element) || (value.indexOf("_") !== -1)) && !dirty) {
		return true;
	}
	if(!$(element).hasClass("mreq") && (value.indexOf("_") !== -1)) {
		return true;
	}

	return Utils.isValidZip(value);
}, "Please enter  valid Zip.");


$.validator.addMethod("mreq", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id");
	var dirty = $(err_div).html() !== '' ? true : false;
	if(((this.optional(element) || value.indexOf("_") !== -1) && !dirty) || value.indexOf("_") === -1) {
		return true;
	}
	return false;
}, "Invalid masking error.");

$.validator.addMethod("greaterThanToday", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	return !Utils.isDateGreaterThanTodaysDate(value);
}, jQuery.validator.format("Please enter a date in the past"));

$.validator.addMethod("futureDate", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	return moment().diff(moment(value)) <= 0;
}, jQuery.validator.format("Please enter a date greater than today"));

$.validator.addMethod("currentOrFutureDate", function(value, element, params) {
	if(this.optional(element) || params == false) {
		return true;
	}
	
	var month, day, year;
	month = value.substring(0, 2);
	day = value.substring(3, 5);
	year = value.substring(6, 10);
	var date = new Date();
	date.setFullYear(year, month - 1, day);
	return(date >= new Date());
}, jQuery.validator.format("Please enter a date equal to or greater than today"));

$.validator.addMethod("regex", function(value, element, regexp) {
	var re = new RegExp(regexp);
	return this.optional(element) || re.test(value);
}, "Please check your input.");

$.validator.addMethod("customEmail", function(value, element) {
	var re = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return this.optional(element) || re.test(value);
}, "Please enter valid Email Id");

$.validator.addMethod("userName", function(value, element, regexp) {
	var re = new RegExp(/^[a-zA-Z0-9_.@]+$/i);
	return this.optional(element) || re.test(value);
}, "Please enter valid User Name");

$.validator.addMethod("multiemail", function(value, element) {

	var i, emails = value.replace(';', ',').split(','),
		valid = true;
	for(i in emails) {
		value = emails[i];
		valid = jQuery.validator.methods.customEmail.call(this, value, element);
		if(!valid) {
			break;
		}
	}
	return valid;

}, 'One or more email addresses are invalid');

$.validator.addMethod("notEqualTo", function(value, element, param) {
	return value !== $(param).val();
}, "Please enter different value.");

$.validator.addMethod("alpha", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z. \\-']+$");
	return this.optional(element) || re.test(value);
}, "Only alphabets are allowed");

$.validator.addMethod("alphaOptional", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z. \\-']+$");
	return value === "" || re.test(value);
}, "Only alphabets are allowed");

$.validator.addMethod("partialEmail", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z. \\-.0-9.@.\\_.\\.']+$");
	return this.optional(element) || re.test(value);
}, "Check Email Field");

$.validator.addMethod("alphaWithSpace", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z ]+$");
	return this.optional(element) || re.test(value);
}, "Only alphabets and spaces are allowed.");

$.validator.addMethod("alphaWithSpaceDot", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z \\'-]+$");
	return this.optional(element) || re.test(value);
}, "Only alphabets, spaces and specialcharacters(-') are allowed.");


$.validator.addMethod("alphaWithoutSpace", function(value, element, regexp) {
	var re = new RegExp("^[a-zA-Z]+$");
	return this.optional(element) || re.test(value);
}, "Only alphabets are allowed.");
$.validator.addMethod("uniqueSSN", function(value, element, params) {
	var ssnObj = $("#" + params.parentDiv).find("input.ssn"),
		ssnMap = $.map(ssnObj, function(val, i) {
			var currentVal = $(val).val();
			if(currentVal === value) {
				return currentVal;
			}
		});

	if(ssnMap.length > 1) {
		return false;
	} else {
		return true;
	}
});
$.validator.addMethod("numbers", function(value, element, regexp) {
	var re = new RegExp("^[0-9]+$");
	return this.optional(element) || re.test(value);
}, "Only numbers are allowed.");

$.validator.addMethod("customPassword", function(value, element, regexp) {
	return this.optional(element) || (/(?!.*[\s])+^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).test(value);
}, "Password must contain at least one uppercase and one lowercase letter and at least one numerical digit.Space allowed.");

$.validator.addMethod("numbersWithDecimals", function(value, element, regexp) {
	var re = new RegExp("^[0-9]+(.[0-9]{1,5})?$");
	return this.optional(element) || re.test(value);
}, "Only numbers are allowed.");

$.validator.addMethod("phoneUS", function(phone_number, element) {
	phone_number = phone_number.replace(/\s+/g, "");
	return this.optional(element) || (phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/));
}, "Please specify a valid US phone number");


$.validator.addMethod("dob", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	return !Utils.isDateGreaterThanTodaysDate(value);
}, "Please enter a valid Date of Birth");

$.validator.addMethod("dobOptional", function(value, element, params) {
	if(value === "") {
		return true;
	}
	return !Utils.isDateGreaterThanTodaysDate(value);
}, "Please enter a valid Date of Birth");

$.validator.addMethod("dobr", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id"),
		dirty = $(err_div).html() !== '' ? true : false;

	if((this.optional(element) || (value.indexOf("_") !== -1)) && !dirty) {
		return true;
	}
	if(!$(element).hasClass("mreq") && (value.indexOf("_") !== -1)) {
		return true;
	}

	var month, day, year;
	month = value.substring(0, 2);
	day = value.substring(3, 5);
	year = parseInt(value.substring(6, 10), 10);
	var maxDob = new Date();
	var minDob = new Date();
	var minAge = parseInt(params[0], 10);
	var maxAge = parseInt(params[1], 10);
	maxDob.setFullYear(year + maxAge, month - 1, day);
	minDob.setFullYear(year + minAge, month - 1, day);
	var currDate = new Date();
	if(maxDob <= currDate || currDate < minDob) {
		return false;
	}
	return true;
}, jQuery.validator.format("Age must lie between {0} and {1}"));

$.validator.addMethod("effdobr", function(value, element, params) {
	var err_div = "#err_" + $(element).attr("id");
	var dirty = $(err_div).html() !== '' ? true : false;

	if((this.optional(element) || (value.indexOf("_") !== -1)) && !dirty) {
		return true;
	}
	if(!$(element).hasClass("mreq") && (value.indexOf("_") !== -1)) {
		return true;
	}
	var effDateObj = $("#effDD");
	if(effDateObj.length !== 0 && effDateObj.val().indexOf("/") !== -1) {
		var month, day, year, eMonth, eDay, eYear;
		month = value.substring(0, 2);
		day = value.substring(3, 5);
		year = parseInt(value.substring(6, 10), 10);
		var maxDob = new Date();
		var minDob = new Date();
		var minAge = parseInt(params[0], 10);
		var maxAge = parseInt(params[1], 10);
		maxDob.setFullYear(year + maxAge, month - 1, day);
		minDob.setFullYear(year + minAge, month - 1, day);
		var currDate = new Date();
		var effDateArray = effDateObj.val().split("/");
		eMonth = parseInt(effDateArray[0], 10);
		eDay = parseInt(effDateArray[1], 10);
		eYear = parseInt(effDateArray[2], 10);
		currDate.setFullYear(eYear, eMonth - 1, eDay);
		if(params[2] !== null) {
			params[2] = "according to the effective date";
		} else {
			params.push("according to the effective date");
		}
		if(maxDob <= currDate || currDate < minDob) {
			return false;
		}

	}
	return true;
}, jQuery.validator.format("Age must lie between {0} and {1} {2}")

);

$.validator.addMethod("selectNone", function(value, element, params) {
	if(params) {
		var elementObj = $(element);
		if(elementObj.css("visibility") === 'hidden' || elementObj.css("display") === "none") {
			return true;
		}
		if(element.value === "none" || element.value === "0" || element.value === "") {
			return false;
		}
	}
	return true;
}, jQuery.validator.format("Please select a value"));
$.validator.addMethod("dob65", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	return Utils.isDateWithinDays(value, 65);
}, jQuery.validator.format("Age must be less than 65 years"));

$.validator.addMethod("dob100", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	return Utils.isDateWithinDays(value, parseInt(150, 10));
}, jQuery.validator.format("Age must be less than " + 150 + " years"));

$.validator.addMethod("dobNoDay100", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	var strs = value.split("/");
    var latestDate = strs[0]+ "/01/" + strs[1];
    value =  latestDate;
	return (Utils.isDateWithinDays(value, parseInt(150, 10)) && !Utils.isDateGreaterThanTodaysDate(value));
}, jQuery.validator.format("Age must be less than " + 150 + " years"));

$.validator.addMethod("dateGreaterThan", function(value, element, params) {
	var targetDate = $(params).val();
	if(value && value.indexOf("_") === -1 && targetDate && targetDate.indexOf("_") === -1) {
		return moment(value).diff(moment(targetDate)) > 0;
	}
	return true;
});

$.validator.addMethod("splitDate", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}
	var sep = "/",
		dateString = $("#" + params + "_MM").val() + sep + $("#" + params + "_DD").val() + sep + $("#" + params + "_YYYY").val();
	return Utils.validateDate(dateString);
}, jQuery.validator.format("Please enter valid Date"));

$.validator.addMethod("routingNum", function(value, element, params) {
	if(this.optional(element)) {
		return true;
	}

	var i, n, t, c;
	// First, remove any non-numeric characters.
	t = "";
	for(i = 0; i < value.length; i++) {
		c = parseInt(value.charAt(i), 10);
		if(c >= 0 && c <= 9) {
			t = t + c;
		}
	}

	// Check the length, it should be nine digits.
	if(t.length !== 9) {
		return false;
	}

	// Now run through each digit and calculate the total.
	n = 0;
	for(i = 0; i < t.length; i += 3) {
		n += parseInt(t.charAt(i), 10) * 3 + parseInt(t.charAt(i + 1), 10) * 7 + parseInt(t.charAt(i + 2), 10);
	}

	// If the resulting sum is an even multiple of ten (but not zero),
	// the aba routing number is good.
	if(n !== 0 && n % 10 === 0) {
		return true;
	} else {
		return false;
	}
}, jQuery.validator.format("Please enter valid routing number"));

$.validator.addMethod("validHourFormat", function(value, element, params) {
	var hasError = true;
	var hourValue = element.value;
	if(hourValue.substring(0, 2) > 23 || hourValue.substring(3, 5) > 59) {
		hasError = false;
	}
	return(hasError);
});
$.validator.addMethod("userNameValidation", function(value, element, regexp) {
    var re = new RegExp(/^[a-zA-Z0-9_.@)-\\!]+$/i);
    return this.optional(element) || re.test(value);
}, "Please enter a valid User ID");

$.validator.addMethod("expiryDateWithMonthYear", function(value, element, params) {
	
	return Utils.isMonthYearGreaterThanTodaysDate(value);
}, "Please enter Valid Future Date");

$.validator.addMethod("futureDate", function(value, element, params) {
	if(this.optional(element)) return true;
	return !Utils.isDateGreaterThanTodaysDate(value);
}, "Please enter a valid date");
$.validator.addMethod('positiveNumber',  function (value)
		{ 
			return Number(value) > 0;
		},'Enter a positive number.');