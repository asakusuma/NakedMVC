define(['base/eventable', 'views/index', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var IndexController = function() {};
	IndexController = function() {};
	IndexController.prototype = new Eventable();
	_.extend(IndexController.prototype, {
		init: function(params, callback, el) {
			var renderMarkup = true;
			this.renderCallback = callback;
			if(el) {
				this.el = el;
				renderMarkup = false;
			} else {
				this.el = $('<div></div>');
			}
			this.view = new View();
			var query = this.view.build(this.el);
			if(renderMarkup) {
				this.view.on('rendered', _.bind(this.onRenderMarkupFinished, this));
				DataFactory.request(query).then(function(num) {
					this.view.setData(query, num);
				}, function() {

				}, this);
			} else {
				this.view.postRender();
			}
		},
		onRenderMarkupFinished: function(event, html) {
			//if on the client
			if(typeof window !== 'undefined') {
				this.view.postRender();
			}
			this.renderCallback(html);
		}
	});
	return IndexController;
});