define(function () {
    var routes = {
    	"/":"index",
    	"/boards":"boardlist",
    	"/boards/:id":"board",
    	"/chat":"chat"
    };

    return routes;
});