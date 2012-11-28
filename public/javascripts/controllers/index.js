define(['base/eventable', 'views/index', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var IndexController = function() {};
	IndexController.prototype = new Eventable();
	_.extend(IndexController.prototype, {
		init: function(params, callback, el, renderMarkup) {
			if(renderMarkup !== false) renderMarkup = true;
			this.renderCallback = _.once(callback);
			if(el) {
				this.el = el;
			} else {
				this.el = $('<div></div>');
			}
			this.view = new View();
			var query = this.view.build(this.el, !renderMarkup);

			this.view.on('rendered', _.bind(this.onRenderMarkupFinished, this));
			this.dataPromise = DataFactory.request(query);

			this.dataPromise.then(function(data) {
				console.log(data);
				this.view.setData(query, data);
			}, function() {

			}, this);

			//Register View Events
			this.view.on('boardCreated', _.bind(this.onBoardCreated, this));
		},
		onRenderMarkupFinished: function(event, html) {
			//if on the client
			if(typeof window !== 'undefined') {
				this.view.postRender();
			}		
			this.renderCallback(html);
		},
		onBoardCreated: function(event, obj) {
			if(obj.title) {
				obj.cards = [];
				obj.type = 'Board',
				DataFactory.create(obj);
			}
		},
		remove: function() {
			this.dataPromise = null;
			this.off();
			this.el.empty();
			this.el = null;
			this.view.remove();
		}
	});
	return IndexController;
});