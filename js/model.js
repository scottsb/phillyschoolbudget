PSB.Model = (function ($) {
	"use strict";

	var BudgetNode = Parse.Object.extend("BudgetNode");
	var Funding = Parse.Object.extend("Funding");
	var FundingSource = Parse.Object.extend("FundingSource");

	function _handleParseError(errObj) {
		PSB.Controller.handleError("Parse Error " + errObj.code + ": " + errObj.message);
	}

	function _fetchChildNodes(parentNode, successCallback) {
		var query = new Parse.Query(BudgetNode);
		query.equalTo("parent", parentNode).find({
			success: successCallback,
			error: _handleParseError
		});
	}

	function _parseArrayToJson(objArray) {
		return objArray.map(function (obj) { return obj.toJSON(); });
	}

	return {
		init: function () {
			Parse.initialize(
				"kfsmOGmVzW3UKCb3S0gpMpq6aEs7M7AG7dum0Osy",
				"NVHRaFSafDWCnknX4ckxDavdvcfWqD9bmN2KiI1u");

			return this;
		},

		/*
		 * Fetch the root budget level from which all other categories descend.
		 * Callback receives two args:
		 *  - JS object containing root budget data
		 *  - array of JS objects containing children's budget data
		 */
		fetchBudgetRoot: function (successCallback) {
			var query = new Parse.Query(BudgetNode);
			query.doesNotExist("parent").limit(1).first({
				success: function(rootNode) {
					if (rootNode) {
						_fetchChildNodes(rootNode, function (childNodes) {
							successCallback(rootNode.toJSON(), _parseArrayToJson(childNodes));
						});
					} else {
						PSB.Controller.handleError("No budget root node found.");
					}
				},
				error: _handleParseError
			});
		},

		/*
		 * Fetch the budget subcategories for the parent category specified by ID.
		 * Callback receives one arg, an array of JS objects containing children's budget data.
		 */
		fetchBudgetChildren: function (parentId, successCallback) {
			var parentNode = new BudgetNode();
			parentNode.id = parentId;
			_fetchChildNodes(parentNode, function (childNodes) {
				successCallback(_parseArrayToJson(childNodes));
			});
		},

		/*
		 * Fetch all possible funding sources to populate into scenario system.
		 * Callback receives one arg, an array of JS objects containing funding source data.
		 */
		fetchFundingSources: function (successCallback) {
			var query = new Parse.Query(FundingSource);
			query.find({
				success: function(fundingSources) {
					successCallback(_parseArrayToJson(fundingSources));
				},
				error: _handleParseError
			});
		},

		/*
		 * Fetch all budget items for a given funding source.
		 * Callback receives one arg, an array of JS objects containing funding source data.
		 */
		fetchBudgetItemsByFunding: function (fundingId, successCallback) {
			var fundingSource = new FundingSource();
			fundingSource.id = fundingId;

			var fundingQuery = new Parse.Query(Funding);
			fundingQuery.equalTo("source", fundingSource);
			var nodeQuery = new Parse.Query(BudgetNode);
			nodeQuery.matchesQuery("funding", fundingQuery);
			nodeQuery.find({
				success: function (budgetNodes) {
					successCallback(_parseArrayToJson(budgetNodes));
				},
				error: _handleParseError
			});
		}
	};
}(jQuery));
