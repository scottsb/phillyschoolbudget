PSB.Model = (function ($) {
	"use strict";

	function _handleParseError(errObj) {
		PSB.Controller.handleError('Parse Error ' + errObj.code + ': ' + errObj.message);
	}

	function _fetchChildNodes(parentNode, successCallback) {
		var query = new Parse.Query(BudgetRoot);
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
			// TODO: Set up Parse authentication

			return this;
		},

		/*
		 * Fetch the root budget level from which all other categories descend.
		 */
		fetchBudgetRoot: function (successCallback) {
			var BudgetRoot = Parse.Object.extend("BudgetRoot");
			var query = new Parse.Query(BudgetRoot);
			query.limit(1).first({
				success: function(rootNode) {
					_fetchChildNodes(rootNode, function (childNodes) {
						successCallBack(_parseArrayToJson(childNodes));
					});
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
