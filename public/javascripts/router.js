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
			this.app.routes[i].regex = new RegExp(this.app.routes[i].regex.substring(1,this.app.routes[i].regex.length-3),'i');
		}

		this.loadRoute(window.location.pathname, true);
		this.$('body').on('click', 'a.push-link', _.bind(this.pushLinkClicked, this));
		window.onpopstate = _.bind(this.onPopState, this);	
	}

	Router.prototype.onPopState = function() {
		this.loadRoute(window.location.pathname, false, false);
	}

	Router.prototype.pushLinkClicked = function(event) {
		event.preventDefault();
		this.loadRoute(this.$(event.target).attr('href'));
	}

	Router.prototype.loadRoute = function(path, isFirstRoute, pushState) {
		var route = path;
		var routeMatched = false;
		if(isFirstRoute !== true) isFirstRoute = false;
		if(pushState !== false) pushState = true;
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
			var page = this.components.page[this.routes[path]];
			if(this.rootController) {
				//remove or do gargabe collection
				this.rootController.remove();
				delete this.rootController;
			}
			if(pushState) {
				window.history.pushState({}, page.title, route);
			}
			this.rootController = new page.controllerClass({
				params: this.app.params,
				renderCallback: _.bind(this.viewRendered, this),
				el: this.$('#app'),
				renderMarkup: !isFirstRoute
			});
		}
	}

	Router.prototype.viewRendered = function() {
		
	}

	return new Router(components, routes, schema, $);
})