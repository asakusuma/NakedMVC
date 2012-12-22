define(['base/eventable', 'lib/underscore', 'dustjs-linkedin'],function (Eventable, _ , dust) {
	var ChatView = function() {};
	ChatView.prototype = new Eventable();
	_.extend(ChatView.prototype, {
		build: function(el, rendered) {
			this.rendered = rendered;
			this.el = el;
			this.data = {};
			_.bindAll(this);

			return {
				entityKey: 'messages'
			};
		},
		setData: function(query, data) {
			if(_.isArray(data)) {
				this.data = data;
				data = {boards: data};
				if(this.rendered && typeof window !== 'undefined') {
					this.postRender();
				} else {
					dust.render('index', data, _.bind(this.render, this));
				}
			} else if(data.attributes) {
				this.data.push({
					id: data.attributes._id,
					key: data.attributes._id,
					value: data.attributes
				});
				dust.render('index', {boards: this.data}, _.bind(this.render, this));
			}
		},
		onNewBoardButtonClicked: function(event) {
			this.trigger('messageCreated', $('#message').val());
		},
		render: function(err, out) {
			this.rendered = true;
			if(err) throw err;
			if(this.el) {
				this.el.empty();
  				this.el.append(out);
				this.trigger('rendered', this.el.html());
			}
		},
		postRender: function() {
			$('#new-message-button').click(_.bind(this.onNewMessageButtonClicked, this));
		},
		remove: function() {
			this.off();
			this.el.empty();
			this.el = null;
		}
	});
	return ChatView;
});