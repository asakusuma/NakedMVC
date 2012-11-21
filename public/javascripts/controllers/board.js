define(['base/eventable', 'views/board', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var BoardController = function() {};
	BoardController.prototype = new Eventable();
	_.extend(BoardController.prototype, {
		init: function(params, callback) {
			console.log("Board Controller Init");
			this.el = $('<div></div>');
			this.view = new View();
			this.view.on('rendered', callback);
			var query = this.view.init(this.el);
			if(params.id) {
				query.id = params.id;
				DataFactory.request(query).then(function(num) {
					this.view.setData(query, num);
				}, function() {

				}, this);
			}
		}
	});
	return BoardController;
});