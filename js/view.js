PSB.View = (function ($) {
	"use strict";

	function _handleZoom() {
		PSB.Model.fetchBudgetChildren(function(children) {
			// ...
		});
	}

	return {
		rootObj: [],
		init: function () {
			PSB.Model.fetchBudgetRoot(function(root, children) {
				this.rootObj = new Array(), initChildren;
				rootObj.push([root, children]);
				
				console.log(root);
				console.log(children);
			});

			return this;
		}

		// public methods go here...
	};
}(jQuery));
