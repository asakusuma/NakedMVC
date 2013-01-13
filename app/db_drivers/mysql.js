//The dataproxy is an abstraction for talking with the CouchDB database. While CouchDB is a NoSQL database, it's
//used relationally in NakedMVC (sorry). Documents have a 'type', which corresponds to a schema.

define([
    'lib/backbone',
    'base/promise',
    'MySQL',
    'async',
    'schema',
    'base/model',
    'underscore'
  ], function (
    Backbone, 
    Promise, 
    mysql, 
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


    return _.extend({
      db: connection
      create: function(data) {
        var promise = new Promise(),
          schema;
        
        if(data.schema && Schema[data.schema]) {
          schema = Schema[data.schema];
          connection.connect();

          var keys = [], values = [];
          for(var key in data) {
            keys.push(key);
            values.push(data[key]);
          }

          connection.query('INSRT INTO ' + schema + '(' + keys.join(',') + ') VALUES (' + values.join(',') + ')', function(err, rows, fields) {
            if (err) throw err;
            //console.log('The solution is: ', rows[0].solution);
            promise.resolve();
          });
          connection.end();
        }

        return promise;
      },
      read: function(request) {
        var promise = new Promise();
        if(request.schema) {
          connection.connect();
          connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
            if (err) throw err;

            promise.resolve(rows);
          });
          connection.end();
        }
        return promise;
      },
      update: function(request) {

      },
      delete: function(request) {

      }
    },Backbone.Events);
});