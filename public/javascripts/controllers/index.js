define(['base/controller', 'views/index', 'dataproxy'],function (BaseController, ViewClass, DataFactory) {
	var IndexController = BaseController.extend({
		viewClass: ViewClass,
		initialize: function() {
			BaseController.prototype.initialize.call(this,arguments);
			this.view.on('messageSent', this.onMessageSent);
		},
		onMessageSent: function(event) {
			event.preventDefault();
			
		},
		postInit: function() {
			console.log('Post Init!');
		}
	});
	return IndexController;
});