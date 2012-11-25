define(function () {
    var routes = {
    	"/":"index",
    	"/boards":"boardlist",
    	"/boards/:id":"board"
    };

    for(var route in routes) {
    	routes[route] = {
    		regex: '',
    		page: routes[route]
    	}
    }

    return routes;
});