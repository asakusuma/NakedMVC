define(['base/controller', 'views/index', 'dataproxy'],function (BaseController, ViewClass, DataFactory) {
	var IndexController = BaseController.extend({
		viewClass: ViewClass,
		postInit: function() {
			//Register View Events
			this.view.on('boardCreated', _.bind(this.onBoardCreated, this));
		},
		onBoardCreated: function(obj) {
			if(obj.title) {
				obj.cards = [];
				obj.type = 'Board',
				DataFactory.create(obj);
			}
		}
	});
	return IndexController;
});