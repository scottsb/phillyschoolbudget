PSB.Controller = (function ($) {
	"use strict";

	return {
		init: function () {
			PSB.Model.init();
			PSB.View.init();
			return this;
		},

		handleError: function(msg) {
			alert(msg);
		}
	};
}(jQuery));

jQuery(function ($) {
	"use strict";

	PSB.Controller.init()
});
