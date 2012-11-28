define(['base/eventable', 'views/board', 'jquery', 'dataproxy'],function (Eventable, View, $, DataFactory) {
	var BoardController = function() {};
	BoardController.prototype = new Eventable();
	_.extend(BoardController.prototype, {
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
			if(params.id) {
				query.id = params.id;
				//Take request from view, inject context, and
				//forward request to datafactory
				this.dataPromise = DataFactory.request(query);
				this.dataPromise.then(function(data) {
					this.view.setData(query, data);
				}, function() {

				}, this);
			}

		},
		onRenderMarkupFinished: function(event, html) {
			//if on the client
			if(typeof window !== 'undefined') {
				this.view.postRender();
			}
			this.renderCallback(html);
		},
		remove: function() {
			this.dataPromise.kill();
			this.off();
			this.el.empty();
			this.el = null;
			this.view.remove();
		}
	});
	return BoardController;
});