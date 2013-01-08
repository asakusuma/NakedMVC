define(['base/controller', 'views/index', 'dataproxy', 'rid'],
	function (BaseController, ViewClass, DataFactory, createID) {
	var IndexController = BaseController.extend({
		viewClass: ViewClass,
		clientInit: function() {
			this.view.on('messageSent', this.onMessageSent);
		},
		onMessageSent: function(event, message) {
			var result,
				guid = createID();
			event.preventDefault();
			result = DataFactory.create({
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