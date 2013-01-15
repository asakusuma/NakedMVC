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
          schema,
          query,
          schemaName = data.schema;
        if(data.schema && Schema.obj[schemaName]) {
          schema = Schema.obj[data.schema];
          query = 'INSERT INTO ' + data.schema + ' SET ?';
          delete data.schema;
          this.db.query(query, data, function(err, result) {
            if (err) throw err;
            data['_id'] = result.insertId;
            data['schema'] = schemaName;
            promise.resolve(data);
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