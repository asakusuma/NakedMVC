define(['components', 'routes', 'schema'], function(components, routes, schema) {
	function Router(components, routes, schema) {
		this.components = components;
		this.routes = routes;
		this.schema = schema;
	}

	Router.prototype.start = function(app) {
		this.rootController = null;
		this.app = app;
		this.loadRoute(this.app.route, true);	
	}

	Router.prototype.loadRoute = function(route, isFirstRoute) {
		var renderType = 1;
		/*
		===========
		Render Type
		===========

		0 = Render markup, but don't execute post-render JS
			- Used on the backend for server-side render

		1 = Don't render markup, only execute post-render JS
			- Used on the client for the very first page rendered

		2 = Render markup and then execute post-render JS
			- Used on the client for all pages after the first rendered page

		*/

		if(isFirstRoute !== true) isFirstRoute = false;
		if(this.routes[route]) {
			if(this.rootController) {
				//remove or do gargabe collection
			}

			if(!isFirstRoute) renderType = 2;

			this.rootController = new this.components.page[this.routes[route]].controllerClass();
			this.rootController.init(this.app.params, _.bind(this.viewRendered, this), $('#app'));
		}
	}

	Router.prototype.viewRendered = function() {
		alert("Rendered!");
	}

	return new Router(components, routes, schema);
})