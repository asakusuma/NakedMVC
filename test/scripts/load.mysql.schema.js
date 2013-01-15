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
	connection.connect();
    for(var schema in Schemas.obj) {
    	console.log(schema);
    	console.log(Schemas.obj[schema]);

    	connection.query('DROP TABLE IF EXISTS '+schema, function(err, rows, fields) {
		 	if (err) throw err;
		 	var fields = '_id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(_id) ',
		 		field,
		 		map = {
		 		'text': 'longtext',
		 		'date': 'int',
		 		'string': 'varchar(100)',
		 		'int': 'int'
		 	};
		 	for(var name in Schemas.obj[schema].fields) {
		 		fields += ', ' + name + ' ' + map[Schemas.obj[schema].fields[name].type];
		 	}
		 	var query = 'CREATE TABLE '+schema + ' ( '+ fields +' )';
		 	connection.query(query, function(err, rows, fields) {
		 		if (err) throw err;
		  		console.log(arguments);
		  		connection.end();
			});
		});
    }
    
/*
    CREATE TABLE Persons
(
FirstName varchar(15),
LastName varchar(15),
Age int
)
*/

});