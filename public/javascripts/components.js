define([
	'controllers/index',

	'pages/index'
	],function (
		controllerIndex,

		pageIndex
	) {
    return {
    	controller: {
    		index: controllerIndex
    	},
    	model: {

    	},
    	page: {
    		index: pageIndex
    	}
    };
});