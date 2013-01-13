var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: "public/javascripts/",
    paths: {
      "app": "../../app",
      "schema": "../../app/schema",
      "dataproxy": "../../app/dataproxy"
    }
});

requirejs(['mysql', 'schema'], function(MySQL, Schemas) {
	var connection = MySQL.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database: 'rt'
    });

    for(var schema in Schemas) {
    	console.log(schema);
    }
});