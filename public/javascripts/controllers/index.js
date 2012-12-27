define(['base/controller', 'views/index', 'dataproxy'],function (BaseController, ViewClass, DataFactory) {
	var IndexController = BaseController.extend({
		viewClass: ViewClass,
		postInit: function() {
			console.log('Post Init!');
		}
	});
	return IndexController;
});