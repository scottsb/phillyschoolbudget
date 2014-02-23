PSB.Model = (function ($) {
	"use strict";

	var BudgetRoot = Parse.Object.extend("BudgetRoot");
	var BudgetNode = Parse.Object.extend("BudgetNode");
	var CostCenter = Parse.Object.extend("CostCenter");
	var FundingType = Parse.Object.extend("FundingType");

	function _handleParseError(errObj) {
		PSB.Controller.handleError('Parse Error ' + errObj.code + ': ' + errObj.message);
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
		 */
		fetchBudgetRoot: function (successCallback) {
			var query = new Parse.Query(BudgetRoot);
			query.limit(1).first({
				success: function(rootNode) {
					if (rootNode) {
						_fetchChildNodes(rootNode, function (childNodes) {
							successCallback(rootNode.toJSON(), _parseArrayToJson(childNodes));
						});
					} else {
						PSB.Controller.handleError('No budget root node found.');
					}
				},
				error: _handleParseError
			});
		},

		/*
		 * Fetch the budget subcategories for the parent category specified by ID.
		 */
		fetchBudgetChildren: function (parentId, successCallback) {
			var parentNode = new BudgetNode();
			parentNode.id = parentId;
			_fetchChildNodes(parentNode, function (childNodes) {
				successCallBack(_parseArrayToJson(childNodes));
			});
		}
	};
}(jQuery));
