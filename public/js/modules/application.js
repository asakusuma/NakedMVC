require.config({
	baseUrl: "/js/modules"
});

require( ['RootController', 'Eventable', 'Promise', 'Templates'], function(rootController, Eventable, Promise, Templates){
	var url = window.location.hash,
		segments = [],
		segment,
		routes = {
			'db': {
				':': 'routeToDB'
			},
			'@': 'routeToHome'
		},
		func = null,
		args = [];

	//Create a global event bus
	window.app.bus = new Eventable();

	//Add templates
	window.app.templates = Templates;
	console.log(Templates);

	//Routing
	if(url) {
		url = url.substr(1);
		segments = url.split('/');

		for(var i = 0; i < segments.length; i++) {
			segment = segments[i];
			if(!segment) { continue; }

			if(func === null) {
				func = 'notFound';
			}
			
			for(var seg in routes) {
				if(seg === segment || seg[0] === ':') {
					if(seg[0] === ':') args.push(segment);
					if(_.isString(routes[seg])) {
						func = routes[seg];
					} else if(_.isObject(routes[seg])) {
						routes = routes[seg];
					}
				}
			}
		}
	}

	rootController.init();

	if(func != null) {
		rootController[func].apply(rootController, args);
	} else {
		//home
		rootController.routeToHome.apply(rootController, args);
	}
});