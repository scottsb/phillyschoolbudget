PSB.View = (function ($) {
	"use strict";

	function _handleZoom() {
		PSB.Model.fetchBudgetChildren(function(children) {
			// ...
		});
	}

	return {
		init: function () {
			PSB.Model.fetchBudgetRoot(function(root, children) {
				// ...
			});

			return this;
		}

		// public methods go here...
	};
}(jQuery));
