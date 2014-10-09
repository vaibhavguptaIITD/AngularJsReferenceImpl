/*
 * Copyright (c) 2009 - 2012 hCentive Inc. All rights reserved.
 */
var tableMap = {}; //Holds all the table objects in a page
var filterMap = {};
var sortMap = {};
var cookieObject = {};
var filterInCookie = false;
var filterCriteria = [],
	sortCriteria = {},
	cookieName = null;

/**
Constructs a new Table. The table will use 'PURE' to render the data
@tableObj: object containing following parameters
@tableId: id of the data container
@tableData: json object containing the data
@tableDir: PURE template
@loadingDiv: id of div to be used for colorbox blocking frame
@selector: a selector which will return array of data rows.
**/

function Table(tableObj) {
	this.tableId = tableObj.tableId;
	this.tableData = tableObj.tableData;
	this.tableDir = tableObj.tableDir;
	this.loadingDiv = tableObj.loadingDiv;
	this.loadingDivOpen = false;
	this.selector = tableObj.selector;
	this.getRowId = tableObj.getRowId;
	this.defaultSort = tableObj.defaultSort;
	this.sortAscClass = tableObj.sortAscClass;
	this.sortDscClass = tableObj.sortDscClass;
	this.paginationObj = tableObj.paginationObj;
	this.sortInactiveClass = tableObj.sortInactiveClass;
	this.drawTable = tableObj.drawTable;
	this.hideFrame = tableObj.hideFrame;
	this.showFrame = tableObj.showFrame;
	this.filterStack = new Stack(); // filter stack for holding filters 
	this.quickSearchStack = []; //quick search stack
	this.init(this.tableId);
}
//Initialization function for a table
Table.prototype.init = function(tableId) {
	if(!tableMap[tableId]) {
		tableMap[tableId] = this; //Store table in table array
	}
	this.filterStack = new Stack(); //reInitialize filter stack
	if(this.paginationObj) {
		drawTable(tableId, this.tableData);
	} else {
		drawTable(tableId, this.tableData);
	}
	if(this.defaultSort) {
		Sort.sortData({
			tableName: tableId,
			sortName: this.defaultSort
		});
	}
};

Table.reInitializeTable = function(tableId, tableData, totalRows, sortingCallBack, retainFilters, callBack) {
	var tableObj = tableMap[tableId];

	if(tableObj) {
		tableObj.tableData = tableData;
		if(!retainFilters) {
			tableObj.filterStack = new Stack();
		}

		if(tableObj.paginationObj) {
			if(totalRows !== null) {
				tableObj.paginationObj.totalRecords = totalRows;
			}
			drawTable(tableId, tableData, callBack);
		} else {
			drawTable(tableId, tableData, callBack);
		}
		if(sortingCallBack) {
			sortingCallBack();
		} else if(tableObj.defaultSort) {
			Sort.sortData({
				tableName: tableId,
				sortName: tableObj.defaultSort
			});
		}
		if(retainFilters) {
			Filter.applyFilter(tableId);
		}
	}
};

/**
Filter constructor.
@filterObj: Filter object contains filterName and tableName it is associated with.
**/
function Filter(filterObj) {
	this.name = filterObj.filterName;
	this.applied = false;
	//this.criteria = new Stack();
	this.updateFieldMap = {};
	var tableName = filterObj.tableName;
	var tableFilterMap = filterMap[tableName];
	if(!tableFilterMap) {
		tableFilterMap = {};
		filterMap[tableName] = tableFilterMap;
	}
	tableFilterMap[this.name] = this;
}

Filter.returnFilterMap = function(tableId) {

	return filterMap[tableId];
};

Filter.pushInStack = function(tableId, filter) {
	Filter.popFromStack(tableId, filter.name);
	var table = tableMap[tableId];
	table.filterStack.pushInStack(filter);
	var tableCookie = null;
	if(cookieObject[tableId]) {
		tableCookie = cookieObject[tableId];
	} else {
		tableCookie = {};
		cookieObject[tableId] = tableCookie;
	}
	var filterCookie = tableCookie.filter;
	if(!filterCookie) {
		filterCookie = {};
		tableCookie.filter = filterCookie;
	}
	if(filter.criteria) {
		filterCookie[filter.name] = filter.criteria;
	} else {
		filterCookie[filter.name] = " ";
	}
	var cookieString = JSON.stringify(cookieObject);
	setCookie(cookieString);
};
/**
Finds the already constructed filter corresponding to the table in the filter map
**/
Filter.findFilter = function(tableId, filterName) {
	var tableFilterMap = filterMap[tableId];
	return tableFilterMap[filterName];
};

Filter.popFromStack = function(tableId, filterName) {
	var table = tableMap[tableId];
	var filterStack = table.filterStack;
	filterStack.popFromStack(filterName, "name");
	var tableCookie = cookieObject[tableId];
	if(tableCookie) {
		var filterCookie = tableCookie.filter;
		if(filterCookie && filterCookie[filterName]) {
			delete filterCookie[filterName];
		}
		if(isEmpty(filterCookie)) {
			filterCookie = null;
		}
		if(isEmpty(tableCookie)) {
			tableCookie = null;
		}
	}
	var cookieString = JSON.stringify(cookieObject);
	setCookie(cookieString);
};

Filter.prototype.apply = function(rowData) {
	/**
	This function needs to be overriden by filter objects.
**/
	return true;
};
/**
	applyFilter method iterates over the table rows applying filters from
	filter stack on each row. Rows not satisfying the condition are hidden.
**/

Filter.prototype.resetFilterCriteria = function() {


};
Filter.prototype.defaultFilterCriteria = function() {


};
Filter.applyDefault = function(tableId) {
	var tableFilterMap = filterMap[tableId];
	var f, filter;
	var cookieString = getCookieString();
	if(cookieString && cookieString !== ' ') {
		cookieObject = JSON.parse(cookieString);
		var cookieFilterMap = cookieObject[tableId].filter;
		if(cookieFilterMap) {
			for(f in tableFilterMap) {
				if(tableFilterMap.hasOwnProperty(f)) {
					filter = tableFilterMap[f];
					var filterCriteria = cookieFilterMap[f];
					if(filterCriteria) {
						if(filterCriteria !== " ") {
							if(filter.criteria instanceof Stack) {
								filter.criteria = new Stack(filterCriteria.stack);
							} else {
								filter.criteria = filterCriteria;
							}
							filter.reconfigure(filter.criteria);
						} else {
							filter.reconfigure();
						}
						Filter.pushInStack(tableId, filter);
						filterInCookie = true;
					} else {
						filter.resetFilterCriteria();
					}


				}
			}
		}
	} else {
		for(f in tableFilterMap) {
			if(tableFilterMap.hasOwnProperty(f)) {
				filter = tableFilterMap[f];
				filter.resetFilterCriteria();
			}
		}
	}
	Filter.applyFilter(tableId);

};
Filter.applyFilter = function(tableId) {
	hideFrame(tableId);
	setTimeout(function() {
		var table = tableMap[tableId],
			filterStack = table.filterStack,
			quickSearchStack = table.quickSearchStack,
			tableData = table.tableData,
			selector = table.selector,
			tableObj = $("#" + tableId),
			tableRows = tableObj.find(selector),
			i;
		Filter.resetUpdateFields(tableId);
		for(i = 0; i < tableData.length; i++) {
			var rowData = tableData[i];
			var row = tableRows[i];
			var conflictF = null;
			var hideRow = false,
				j;
			for(j = 0; j < filterStack.length(); j++) {
				var filter = filterStack.get(j);
				if(!filter.apply(rowData)) {
					hideRow = true;
					if(j === filterStack.length() - 1) {
						conflictF = filter.name;
					}
					break;
				}
			}
			if(hideRow) {
				$(row).addClass('hideRow');
				if(conflictF) {
					Filter.updateFieldsCurrent(rowData, tableId, conflictF);
				}
			} else {
				$(row).removeClass('hideRow');
				Filter.updateFields(rowData, tableId);
			}
		}
		Filter.renderUpdateFields(tableId);
		if(tableMap[tableId].paginationObj) {
			applyPagination(0, tableMap[tableId].paginationObj, true);
		}
		QuickSearch.trigger(quickSearchStack);
		tableObj.trigger("filterApplied");
		showFrame(tableId);
	}, 100);

};

Filter.resetUpdateFields = function(tableId) {

	var tableFilterMap = filterMap[tableId];
	var f;
	for(f in tableFilterMap) {
		if(tableFilterMap.hasOwnProperty(f)) {
			var filter = tableFilterMap[f];
			filter.resetUpdateFieldMap(filter.updateFieldMap);
		}
	}
};

Filter.prototype.resetUpdateFieldMap = function(updateFieldMap) {
	var c;
	for(c in updateFieldMap) {
		updateFieldMap[c] = 0;

	}
};

Filter.updateFields = function(rowData, tableId) {
	var tableFilterMap = filterMap[tableId];
	var f;
	for(f in tableFilterMap) {
		if(tableFilterMap.hasOwnProperty(f)) {
			tableFilterMap[f].updateField(rowData);
		}
	}
};
Filter.updateFieldsCurrent = function(rowData, tableId, filterName) {
	var tableFilterMap = filterMap[tableId];
	var f;
	for(f in tableFilterMap) {
		if(tableFilterMap.hasOwnProperty(f)) {
			if(f === filterName) {
				tableFilterMap[f].updateField(rowData);
				break;
			}
		}
	}

};
Filter.renderUpdateFields = function(tableId) {
	var tableFilterMap = filterMap[tableId];
	var f;
	for(f in tableFilterMap) {
		if(tableFilterMap.hasOwnProperty(f)) {
			tableFilterMap[f].renderField();
		}
	}


};
Filter.prototype.updateField = function(rowData) {
	//To be implemented
};

Filter.prototype.renderField = function() {
	//To be implemented
};

//Sort constructor


function Sort(sortObj) {
	this.name = sortObj.sortName;
	var tableName = sortObj.tableName;
	this.sortElement = sortObj.sortElement;
	if(sortObj.orderType) {
		this.orderType = sortObj.orderType;
	}
	if(sortObj.server) {
		this.server = true;
		this.url = sortObj.url;
	}

	var tableSortMap = sortMap[tableName];
	if(!tableSortMap) {
		tableSortMap = {};
		sortMap[tableName] = tableSortMap;
	}
	tableSortMap[this.name] = this;
}

Sort.prototype.asc = function(obj1, obj2) {
	//This function needs to be overriden by sort objects.
	return 1;
};

Sort.prototype.desc = function(obj1, obj2) {

	return -1;
};

/**
sortData calls 'sort' call back function and then applies existing filters
on the sorted data
**/
Sort.sortData = function(sortDataObj) {
	hideFrame(sortDataObj.tableName);
	setTimeout(function() {
		var table = tableMap[sortDataObj.tableName];
		var tableData = table.tableData;
		var quickSearchStack = table.quickSearchStack;
		var sortObj = Sort.findSortObj(sortDataObj.tableName, sortDataObj.sortName);
		var sortedData = null,
			order;
		if(sortObj.server) {
			sortedData = null, sortData = constructSortFilterCriteria();
			$.ajax({
				type: 'POST',
				url: sortObj.url,
				data: sortData,
				async: false,
				success: function(jsonData) {
					data = jsonData; //This is done for changing the json data reference for other elements to use. 
					sortedData = jsonData.searchResponse.results;
					Table.reInitializeTable(sortDataObj.tableName, sortedData, jsonData.searchResponse.rowsAvailable);
				}
			});

		} else {
			var sortElemObj = $(sortDataObj.sortElement);
			order = (sortElemObj.hasClass(table.sortDscClass) || sortElemObj.hasClass(table.sortInactiveClass)) ? "asc" : "desc";
			if(sortObj.orderType) {
				if(sortObj.orderType === "asc") {
					sortedData = tableData.sort(sortObj.asc);
				} else {
					sortedData = tableData.sort(sortObj.desc);
				}
			} else {
				if(order === "asc") {
					sortedData = tableData.sort(sortObj.asc);
				} else {
					sortedData = tableData.sort(sortObj.desc);
				}
			}
			Sort.reorderTable(sortedData, table);
		}
		if(sortDataObj.sortElement) {
			Sort.changeClass(order, sortDataObj.sortElement, table);
		}
		var tableCookie = cookieObject[sortDataObj.tableName];
		if(!tableCookie) {
			tableCookie = {};
		}
		var sortCookie = {};
		tableCookie.sort = sortCookie;
		sortCookie[sortDataObj.sortName] = order;
		cookieObject[sortDataObj.tableName] = tableCookie;
		var cookieString = JSON.stringify(cookieObject);
		setCookie(cookieString);

		Filter.applyFilter(sortDataObj.tableName);
		QuickSearch.trigger(quickSearchStack);
	}, 100);
};

Sort.changeClass = function(order, sortElement, table) {
	var ascClass = table.sortAscClass;
	var dscClass = table.sortDscClass;
	var inactiveClass = table.sortInactiveClass;
	$('.' + ascClass).removeClass(ascClass).addClass(inactiveClass);
	$('.' + dscClass).removeClass(dscClass).addClass(inactiveClass);
	$(sortElement).removeClass(inactiveClass);
	if(order === 'asc') {
		$(sortElement).removeClass(dscClass);
		$(sortElement).addClass(ascClass);
	} else {
		$(sortElement).removeClass(ascClass);
		$(sortElement).addClass(dscClass);
	}
	$("#" + table.tableId).trigger("sorting", sortElement);

};

Sort.findSortObj = function(tableName, sortName) {
	return sortMap[tableName][sortName];

};

Sort.applyDefault = function(tableName, defaultSort) {
	var cookieString = getCookieString();
	var sortingFound = false;
	if(cookieString && cookieString !== " ") {
		cookieObject = JSON.parse(cookieString);
		var cookieSortMap = cookieObject[tableName].sort;
		if(cookieSortMap) {
			var s;
			for(s in cookieSortMap) {
				if(cookieSortMap.hasOwnProperty(s)) {
					sortingFound = true;
					var sortOrder = cookieSortMap[s];
					var sortElem = $("#" + s);
					Sort.sortData({
						tableName: tableName,
						sortName: s,
						order: sortOrder,
						sortElement: sortElem
					});

				}
			}
		}
	}
	if(!sortingFound) {
		Sort.sortData({
			tableName: tableName,
			sortName: defaultSort,
			order: "asc",
			sortElement: $("#" + defaultSort)
		});
	}
};

/**
Reorder the existing table depending on the data object. This function needs to be optimised.
For data more than 1000 appending of row in the existing container becomes slow. As a result, mapping between 
json object and rendered table gets messed up.
**/
Sort.reorderTable = function(sortedData, table) {
	var tableId = table.tableId;
	var domTable = $('#' + tableId);
	var children = [],
		i;
	for(i = 0; i < sortedData.length; i++) {
		var rowData = sortedData[i];
		var corresRow = null;
		corresRow = $('#' + table.getRowId(rowData));
		children.push(corresRow);
	}
	domTable.children(table.selector).remove();
	for(i = 0; i < children.length; i++) {
		domTable.append(children[i]); //This function becomes slow as the data increases.
	}
	if(table.paginationObj) {
		var pagination = table.paginationObj;
		if(pagination.recordsDisplayed < pagination.totalRecords) {
			applyPagination(0, pagination, true);
		}
	}
	showFrame(tableId);
};
//Function to show the blocking image


function hideFrame(tableId) {
	var table = tableMap[tableId];
	if(!table.loadingDivOpen) {
		if(table.hideFrame) {
			table.hideFrame();
		} else {
			var loadingDiv = table.loadingDiv;
			$('#' + loadingDiv).show();
			$('#' + tableId).hide();
		}
		table.loadingDivOpen = true;
	}

}

//Function to hide the blocking image


function showFrame(tableId) {
	var table = tableMap[tableId];
	if(table.loadingDivOpen) {
		if(table.showFrame) {
			table.showFrame();
		} else {
			var loadingDiv = table.loadingDiv;
			$('#' + loadingDiv).hide();
			$('#' + tableId).show();
		}
		table.loadingDivOpen = false;
	}

}

function drawTable(tableId, tableData, callBack) {
	hideFrame(tableId);
	setTimeout(function() {
		var table = tableMap[tableId];
		if(table.drawTable) {
			table.drawTable(tableData);
		} else {
			$("#" + tableId).html($("#" + tableId + "_template").tmpl(tableData));
		}
		if(table.paginationObj) {
			var pagination = table.paginationObj;
			if(!pagination.server) {
				pagination.totalRecords = tableData.length;
			}
			if(pagination.recordsDisplayed < pagination.totalRecords) {
				pagination.addPreviousNextSection();
				applyPagination(0, pagination, true);
			} else {
				pagination.removePreviousNextSection();
			}
		}
		if(callBack) {
			callBack();
		}
		showFrame(tableId);
	}, 100);

}

function reRenderTableRows(tableId, tableData) {
	hideFrame(tableId);
	setTimeout(function() {
		var table = tableMap[tableId];
		if(table.drawTable) {
			table.drawTable(tableData);
		} else {
			$("#" + tableId).html($("#" + tableId + "_template").tmpl(tableData));
		}
		showFrame(tableId);
	}, 100);
}

function Pagination(paginationObj) {
	this.recordsDisplayed = paginationObj.recordsDisplayed;
	this.tableId = paginationObj.tableId;
	this.selector = paginationObj.selector;
	this.paginationContainer = paginationObj.paginationContainer;
	if(paginationObj.server) {
		this.server = true;
		this.totalRecords = paginationObj.totalRecords;
		this.url = paginationObj.url;
	}
}

Pagination.prototype.addPreviousNextSection = function() {
	var tableId = this.tableId,
		tableSection = $("#" + tableId),
		tableObj = tableMap[tableId];
	if($('div.nxt-prv', $(tableSection.parent())).size() === 0) {
		var anchorId = "a" + tableId,
			previousNextSection = $('<p class="count"><strong id="' + tableId + '_currentNoOfRecords"></strong> <span class="of">'+$.i18nMessage("of")+'</span> <strong id="' + tableId + '_totalRecords">' + tableObj.paginationObj.totalRecords + '</strong></div><div id="' + tableId + '_nextPrv"><div class="pager"><a class="pgnLinks previous btn" href="#main_div" id="' + tableId + '_prevLink">'+$.i18nMessage("Previous")+'</a> <a class="pgnLinks next btn" href="#main_div" id="' + tableId + '_nextLink">'+$.i18nMessage("Next")+'</a></div>'),
			focusAnchor = $("<a id='" + anchorId + "'></a>"),
			pagination = this;
		//tableSection.parent().prepend(focusAnchor);
		tableSection.prepend(focusAnchor);
		if(tableObj.paginationObj.paginationContainer) {
			var paginationContainerObj = $(tableObj.paginationObj.paginationContainer);
			previousNextSection = $('<p class="count"><strong id="' + tableId + '_currentNoOfRecords"></strong> <strong class="of">'+$.i18nMessage("of")+'</strong> <strong id="' + tableId + '_totalRecords">' + tableObj.paginationObj.totalRecords + '</strong></div><div id="' + tableId + '_nextPrv"><div class="pager"><a class="pgnLinks previous btn" href="#main_div" id="' + tableId + '_prevLink">'+$.i18nMessage("Previous")+'</a> <a class="pgnLinks next btn" href="#main_div" id="' + tableId + '_nextLink">'+$.i18nMessage("Next")+'</a></div>');
			paginationContainerObj.html(previousNextSection);
		} else {
			tableSection.after(previousNextSection);
		}
		$('a.pgnLinks', $(tableSection.parent())).click(function() {
			if(!Utils.isAnchorDisabled($(this))) {
				var index = $(this).data("index");
				applyPagination(index, pagination);
			} else {
				return false;
			}
		});
	}
	this.initPreviousNextSection();
};

Pagination.prototype.removePreviousNextSection = function() {
	var tableId = this.tableId,
		tableSection = $("#" + tableId),
		nextPreviousDiv = $('div.nxt-prv', $(tableSection.parent()));
	if(nextPreviousDiv.size() !== 0) {
		nextPreviousDiv.remove();
		$("#a" + tableId).remove();
	}

};

Pagination.prototype.initPreviousNextSection = function() {
	var firstLink = $("#" + this.tableId + "_firstLink");
	var previousLink = $("#" + this.tableId + "_prevLink");
	var nextLink = $("#" + this.tableId + "_nextLink");
	var lastLink = $("#" + this.tableId + "_lastLink");
	firstLink.data("index", 0);
	var remainder = this.totalRecords % this.recordsDisplayed;
	lastLink.data("index", (this.totalRecords - ((remainder) ? remainder : this.recordsDisplayed)));
};

Pagination.updatePagination = function(tableId, event) {
	var table = tableMap[tableId];
	if(table.paginationObj) {
		if($('#' + tableId + '_nextPrv').size() !== 0 || event === "add") {
			var firstLink = $("#" + tableId + "_firstLink");
			var lastLink = $("#" + tableId + "_lastLink");
			var previousLink = $("#" + tableId + "_prevLink");
			var pagination = table.paginationObj;
			if(event === 'delete') {
				pagination.totalRecords = pagination.totalRecords - 1;
			} else if(event === 'add') {
				pagination.totalRecords = pagination.totalRecords + 1;

			}
			var index = 0;
			if($('#' + tableId + '_nextPrv').size() !== 0) {
				index = previousLink.data("index") + pagination.recordsDisplayed;
			}
			if(index === pagination.totalRecords) {
				index = (previousLink.data("index") < 0) ? 0 : previousLink.data("index");
			}
			var remainder = pagination.totalRecords % pagination.recordsDisplayed;
			lastLink.data("index", (pagination.totalRecords - ((remainder) ? remainder : pagination.recordsDisplayed)));
			applyPagination(index, pagination);
		}


	}

};

function applyPagination(index, pagination, init) {
	var rows = $(pagination.selector).not(".hideRow");
	//var totalSize = pagination.totalRecords;
	var totalSize = rows.length;
	var recordsToDisplay = index + pagination.recordsDisplayed,
		i;

	if(recordsToDisplay > totalSize) {
		recordsToDisplay = totalSize;
	}
	if(!pagination.server || init) {
		rows.addClass("paginationHideRow");
		for(i = index; i < recordsToDisplay; i++) {
			$(rows.get(i)).removeClass("paginationHideRow");
		}
	} else {
		var params = constructSortFilterCriteria();
		params.push({
			name: "offset",
			value: index
		});
		params.push({
			name: "resultSize",
			value: pagination.recordsDisplayed
		});
		var result = null;
		$.ajax({
			type: 'POST',
			url: pagination.url,
			data: params,
			async: false,
			success: function(jsonData) {
				data = jsonData;
				result = jsonData.searchResponse.results;
			}
		});
		reRenderTableRows(pagination.tableId, result);
	}
	if(pagination.recordsDisplayed < pagination.totalRecords) {
		var previousLink = $("#" + pagination.tableId + "_prevLink");
		var nextLink = $("#" + pagination.tableId + "_nextLink");
		var firstLink = $("#" + pagination.tableId + "_firstLink");
		var lastLink = $("#" + pagination.tableId + "_lastLink");
		var previousIndex = index - pagination.recordsDisplayed;
		if(previousIndex < 0) {
			previousLink.addClass("btn-disabled");
			firstLink.addClass("btn-disabled");

		} else {
			previousLink.removeClass("btn-disabled");
			firstLink.removeClass("btn-disabled");
		}
		previousLink.data("index", previousIndex);
		if(recordsToDisplay === totalSize) {
			nextLink.addClass("btn-disabled");
			lastLink.addClass("btn-disabled");
		} else {
			nextLink.removeClass("btn-disabled");
			lastLink.removeClass("btn-disabled");
		}
		nextLink.data("index", recordsToDisplay);
	} else {
		pagination.removePreviousNextSection();
	}
	if(pagination.paginationContainer) {
		var recordsId = "#" + pagination.tableId + "_currentNoOfRecords";
		var totalRecordsId = "#" + pagination.tableId + "_totalRecords";
		$(recordsId).html((((index + 1) > recordsToDisplay) ? index : (index + 1)) + '  '+$.i18nMessage('to')+' ' + recordsToDisplay);
		$(totalRecordsId).html(totalSize);
	}
}

/**
Creates a new quick search. 3
@searchObj contains: 
textBox: target text box on which search text will be written
targetRow: Row selector 
targetChild: Child selector inside the row
tableId: table id on which searching will function
**/
function QuickSearch(searchObj) {
	var table = tableMap[searchObj.tableId];

	var qs = $(searchObj.textBox).quicksearch(searchObj.targetRow, {
		selector: searchObj.targetChild,
		show: searchObj.show,
		hide: searchObj.hide
	});
	setTimeout(function() {
		qs.cache();
	}, 100);
	table.quickSearchStack.push(qs);
}

QuickSearch.trigger = function(quickSearchArray) {
	var i;
	for(i = 0; i < quickSearchArray.length; i++) {
		var qs = quickSearchArray[i];
		qs.cache();
		qs.trigger();
	}
};


function Stack(stackArray) {
	if(stackArray) {
		this.stack = stackArray;
	} else {
		this.stack = [];
	}
}

Stack.prototype.pushInStack = function(object) {
	this.stack.push(object);
};

Stack.prototype.popFromStack = function(propertyValue, property) {
	var i, j;
	for(i = 0; i < this.stack.length; i++) {
		var object = this.stack[i];
		var value = null;
		if(property) {
			value = object[property];
		} else {
			value = object;
		}
		if(value === propertyValue) {
			for(j = i; j < this.stack.length - 1; j++) {
				this.stack[j] = this.stack[j + 1];
			}
			this.stack.pop();
			break;
		}
	}
};
Stack.prototype.length = function() {
	return this.stack.length;
};
Stack.prototype.get = function(index) {
	return this.stack[index];
};

Stack.prototype.reset = function() {
	this.stack = [];
};
Stack.prototype.toArray = function() {
	return this.stack;
};

function isEmpty(obj) {
	var prop;
	for(prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			return false;
		}
	}
	return true;
}

function setCookie(cookieString) {
	if(cookieName) {
		$.cookie(cookieName, cookieString, {
			secure: true
		});
	}
}

function getCookieString() {
	if(cookieName) {
		return $.cookie(cookieName.toString());
	}

}

function constructSortFilterCriteria() {
	var data = cloneObject(filterCriteria),
		f;
	for(f in sortCriteria) {
		if(sortCriteria.hasOwnProperty(f)) {
			data.push({
				name: f,
				value: sortCriteria[f]
			});
		}
	}
	return data;
}