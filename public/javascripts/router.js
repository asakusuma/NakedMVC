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

		//Convert regex strings to regex objs
		for(var i = 0; i < this.app.routes.length; i++) {
			console.log(this.app.routes[i].regex);
			this.app.routes[i].regex = new RegExp(this.app.routes[i].regex.substring(1,this.app.routes[i].regex.length-3),'i');
		}

		this.loadRoute(this.app.route, true);

		this.$('a.push-link').click(_.bind(this.pushLinkClicked, this));	
	}

	Router.prototype.pushLinkClicked = function(event) {
		event.preventDefault();
		this.loadRoute(this.$(event.target).attr('href'));
	}

	Router.prototype.loadRoute = function(path, isFirstRoute) {
		var route = path;
		var routeMatched = false;
		if(isFirstRoute !== true) isFirstRoute = false;

		if(!this.routes[path]) {
			//Find generic route path
			//If the url is /boards/b1, translate to /boards/:id
			for(var i = 0; i < this.app.routes.length; i++) {
				var match = this.app.routes[i].regex.exec(route);
				if(match && match.length > 0) {
					path = this.app.routes[i].route;
					routeMatched = true;
				}
			}

			//Build params
			if(routeMatched === true) {
				this.app.params = {};
				var pathSegments = path.split('/');
				var routeSegments = route.split('/');
				for(var i = 0; i < pathSegments.length; i++) {
					if(pathSegments[i][0] === ':') {
						this.app.params[pathSegments[i].substring(1, pathSegments[i].length)] = routeSegments[i];
					}
				}
			}
		}
		if(this.routes[path]) {
			if(this.rootController) {
				//remove or do gargabe collection
			}
			this.rootController = new this.components.page[this.routes[path]].controllerClass();
			this.rootController.init(this.app.params, _.bind(this.viewRendered, this), this.$('#app'), !isFirstRoute);
		}
	}

	Router.prototype.viewRendered = function() {
		alert("Rendered!");
	}

	return new Router(components, routes, schema, $);
})