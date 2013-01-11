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
			this.requests.messages.on('resolved', _.bind(this.onResolved,this));
		},
		onResolved: function() {
			this.requests.messages.collection.on('add', _.bind(this.onMessageAdded, this));
			if(this.options.rendered === false) {
				this.onMessagesLoaded();
			}
		},
		onMessagesLoaded: function() {
			var renderFuncs = [];
			//Chat controls
			renderFuncs.push(function(callback) {
				dust.render('chat-controls', {}, function(err, html) {
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
		onMessageAdded: function(model) {
			dust.render('message', model.toJSON(), _.bind(this.onNewMessageTemplateRendered, this));
		},
		onNewMessageTemplateRendered: function(err, results) {
			this.el.children('#messages').append(results);
		},
		onMessageTemplatesRendered: function(err, results) {
			//Messages
			var messages = '', controls;
			for(var i = 1; i < results.length; i++) {
				messages += results[i];
			}

			//Chat controls
			controls = results[0];

			dust.render('chat-app', {
				controls: controls,
				messages: messages
			}, _.bind(this.onRootTemplateRendered, this));
		},
		onRootTemplateRendered: function(err, results) {
			this.el.append(results);
			this.render();
		}
	});
});