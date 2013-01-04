define(['lib/underscore', 'dustjs-linkedin', 'base/view','jquery','dustjs-linkedin','async'],
	function (_,dust,BaseView,$,dust,async) {
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
			var renderFuncs = [];
			this.el = $('<div></div>');

			for(var i = 0; i < this.requests.messages.collection.length; i ++) {
				renderFuncs.push((function(message) {
					return function(callback) {
						dust.render('message', message.toJSON(), function(err, html) {
							callback(null,html);
						});
					}
				})(this.requests.messages.collection.at(i)));
			}

			async.parallel(renderFuncs, _.bind(this.onMessageTemplatesRendered, this));
		},
		onMessageTemplatesRendered: function(err, results) {
			for(var i = 0; i < results.length; i++) {
				this.el.append(results[i]);
			}
			this.render();
		}
	});
});