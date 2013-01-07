define(['lib/underscore', 'dustjs-linkedin', 'base/view','jquery','dustjs-linkedin','async'],
	function (_,dust,BaseView,$,dust,async) {
	return BaseView.extend({
		/*
		Prefixes
		> = call controller function
		- = fire event on view
		*/
		events: {
			'submit #message-form':'-messageSent input val()'
		},
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

			//Chat controls
			renderFuncs.push(function(callback) {
				dust.render('chat-controls', {}, function(err, html) {
					console.log(html);
					callback(null,html);
				});
			});

			//Messages
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
			//Messages
			for(var i = 1; i < results.length; i++) {
				this.el.append(results[i]);
			}

			//Chat controls
			this.el.append(results[0]);

			this.render();
		}
	});
});