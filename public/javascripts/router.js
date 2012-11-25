define(['components', 'routes', 'schema', 'jquery'], function(components, routes, schema, $) {
	function Router(components, routes, schema, $) {
		this.components = components;
		this.routes = routes;
		this.schema = schema;
		this.$ = $;
	}

	Router.prototype.start = function(app) {
		this.rootController = null;
		this.app = app;
		this.loadRoute(this.app.route, true);

		this.$('a.push-link').click(_.bind(this.pushLinkClicked, this));	
	}

	Router.prototype.pushLinkClicked = function(event) {
		event.preventDefault();
		this.loadRoute(this.$(event.target).attr('href'));
	}

	Router.prototype.loadRoute = function(route, isFirstRoute) {
		if(isFirstRoute !== true) isFirstRoute = false;
		console.log(this.routes);
		if(this.routes[route]) {
			if(this.rootController) {
				//remove or do gargabe collection
			}
			console.log(this.routes[route]);
			this.rootController = new this.components.page[this.routes[route].page].controllerClass();
			this.rootController.init(this.app.params, _.bind(this.viewRendered, this), $('#app'));
		}
	}

	Router.prototype.viewRendered = function() {
		alert("Rendered!");
	}

	return new Router(components, routes, schema, $);
})