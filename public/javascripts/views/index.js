define(['lib/underscore', 'dustjs-linkedin', 'base/view','jquery'],function (_,dust,BaseView,$) {
	return BaseView.extend({
		queries: {
			'messages': {
	        	schema: 'Message'
	      	}
		},
		initialize: function() {
			BaseView.prototype.initialize.call(this,arguments);
			this.requests.messages.on('resolved', _.bind(this.onMessagesLoaded,this));
		},
		onMessagesLoaded: function() {
			//Junk: ' + this.requests.messages.collection.toJSON() + '
			this.el = $('<div></div>');
			this.el.html(JSON.stringify(this.requests.messages.collection.toJSON()));
			this.render();
		}
	});
});