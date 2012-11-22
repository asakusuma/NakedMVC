define(['components', 'routes', 'schema'], function(components, routes, schema) {
	function Router(components, routes, schema) {
		this.components = components;
		this.routes = routes;
		this.schema = schema;
	}

	Router.prototype.start = function(app) {
		this.app = app;
		alert(this.app.url);
	}

	return new Router(components, routes, schema);
})