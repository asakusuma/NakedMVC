define(['base/eventable', 'lib/underscore', 'dustjs-linkedin'],function (Eventable, _ , dust) {
	var IndexView = function() {};
	IndexView.prototype = new Eventable();
	_.extend(IndexView.prototype, {
		build: function(el, rendered) {
			this.rendered = rendered;
			this.el = el;
			this.data = {};
			_.bindAll(this);

			return {
				entityKey: 'boards'
			};
		},
		setData: function(query, data) {
			this.data[query] = JSON.stringify(data);
			data = {boards: data};
			if(this.rendered && typeof window !== 'undefined') {
				this.postRender();
			} else {
				dust.render('index', data, _.bind(this.render, this));
			}
		},
		onNewBoardButtonClicked: function(event) {
			this.trigger('boardCreated', {
				title: $('#new-board-name').val()
			});
		},
		render: function(err, out) {
			this.rendered = true;
			if(err) throw err;
  			this.el.append(out);
			this.trigger('rendered', this.el.html());
		},
		postRender: function() {
			$('#new-board-button').click(_.bind(this.onNewBoardButtonClicked, this));
		},
		remove: function() {
			this.off();
			this.el.empty();
			this.el = null;
		}
	});
	return IndexView;
});