PSB.Model = (function ($) {
	"use strict";

	function handleParseError(errObj) {
		PSB.Controller.handleError('Parse Error ' + errObj.code + ': ' + errObj.message);
	}

	return {
		init: function () {
			// TODO: Set up Parse authentication

			return this;
		},

		/*
		 * Fetch the root budget node from which all other nodes descend.
		 */
		fetchRootNode: function (rootReadyCallback) {
			var BudgetRoot = Parse.Object.extend("BudgetRoot");
			var query = new Parse.Query(BudgetRoot);
			query.limit(1).first({
				success: function(rootNode) {
					var query = new Parse.Query(Comment);
					query.equalTo("parent", rootNode);
					query.find({
						success: function(firstChildren) {
							// TODO: Turn Parse objects into raw JS objects for encapsulation.

							rootReadyCallback(rootNode, firstChildren);
						},
						error: handleParseError
					});
				},
				error: handleParseError
			});
		},

		/*
		 * Fetch the child budget node from a given parent.
		 */
		fetchChildNodes: function (parent, readyCallback) {
		}
	};
}(jQuery));
