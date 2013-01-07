define(['base/controller', 'views/index', 'dataproxy'],function (BaseController, ViewClass, DataFactory) {
	var IndexController = BaseController.extend({
		viewClass: ViewClass,
		initialize: function() {
			BaseController.prototype.initialize.call(this,arguments);
			this.view.on('messageSent', this.onMessageSent);
		},
		onMessageSent: function(event, message) {
			event.preventDefault();
			alert(message);
			var result = DataFactory.create({
				type: 'Message',
				content: message
			});
		},
		postInit: function() {
			console.log('Post Init!');
		}
	});
	return IndexController;
});