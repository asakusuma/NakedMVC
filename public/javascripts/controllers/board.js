define(['base/eventable', 'views/board', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var BoardController = function() {};
	BoardController.prototype = new Eventable();
	_.extend(BoardController.prototype, {
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
				console.log("RenderMarkup");
				this.view.on('rendered', _.bind(this.onRenderMarkupFinished, this));
				if(params.id) {
					query.id = params.id;

					//Take request from view, inject context, and
					//forward request to datafactory
					DataFactory.request(query).then(function(num) {
						this.view.setData(query, num);
					}, function() {

					}, this);
				}
			} else {
				this.view.postRender();
			}
		},
		onRenderMarkupFinished: function(event, html) {
			//if on the client
			if(typeof window !== 'undefined' || true) {
				this.view.postRender();
			}
			this.renderCallback(html);
		}
	});
	return BoardController;
});