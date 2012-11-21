define(['base/eventable', 'views/index', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var IndexController = function() {};
	IndexController = function() {};
	IndexController.prototype = new Eventable();
	_.extend(IndexController.prototype, {
		init: function(params, callback) {
			this.el = $('<div></div>');
			this.view = new View();
			this.view.on('rendered', callback);
			var query = this.view.init(this.el);
			DataFactory.request(query).then(function(num) {
				this.view.setData(query, num);
			}, function() {
				this.view.setDataError(query);
			}, this);
		}
	});
	return IndexController;
});