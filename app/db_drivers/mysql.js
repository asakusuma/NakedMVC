//The dataproxy is an abstraction for talking with the CouchDB database. While CouchDB is a NoSQL database, it's
//used relationally in NakedMVC (sorry). Documents have a 'type', which corresponds to a schema.

define([
    'lib/backbone',
    'base/promise',
    'mysql',
    'async',
    'schema',
    'base/model',
    'underscore'
  ], function (
    Backbone, 
    Promise, 
    MySQL, 
    Async, 
    Schema,
    Model,
    _
  ) {

    var connection = MySQL.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database: 'rt'
    });
    connection.connect();

    return _.extend({
      db: connection,
      create: function(data) {
        var promise = new Promise(),
          schema;
        if(data.schema && Schema.obj[data.schema]) {
          schema = Schema.obj[data.schema];

          var keys = [], values = [];
          for(var key in data) {
            if(key !== 'schema') {
            	keys.push(key);
            	values.push(data[key]);
            }
          }
          var query = 'INSERT INTO ' + data.schema + '(' + keys.join(',') + ") VALUES ('" + values.join("','") + "')";
          console.log(query);
          this.db.query(query, function(err, rows, fields) {
            if (err) throw err;
            //console.log('The solution is: ', rows[0].solution);
            promise.resolve();
          });
        }

        return promise;
      },
      read: function(request) {
        var promise = new Promise();
        if(request.schema) {
          this.db.query('SELECT * FROM ' + request.schema, function(err, rows, fields) {
            if (err) throw err;

            promise.resolve(rows);
          });
        }
        return promise;
      },
      update: function(request) {

      },
      delete: function(request) {

      }
    },Backbone.Events);
});