define([
	'controllers/index',

	'pages/index',
	'pages/board',

	'views/board'
	],function (
		controllerIndex,

		pageIndex,
		pageBoard,

		viewBoard
		) {
    return {
    	controller: {
    		index: controllerIndex
    	},
    	model: {

    	},
    	page: {
    		index: pageIndex,
    		board: pageBoard,
    	},
    	view: {
    		board: viewBoard
    	}
    };
});