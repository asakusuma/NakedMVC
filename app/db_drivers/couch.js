//The dataproxy is an abstraction for talking with the CouchDB database. While CouchDB is a NoSQL database, it's
//used relationally in NakedMVC (sorry). Documents have a 'type', which corresponds to a schema.

define([
    'lib/backbone',
    'base/promise',
    'cradle',
    'async',
    'schema',
    'base/model',
    'underscore'
  ], function (
    Backbone, 
    Promise, 
    Cradle, 
    Async, 
    Schema,
    Model,
    _
  ) {

    var dbName = 'app',
        host,
        port;

    // Cradle setup
    Cradle.setup({
      cache: true,
      raw: false,
      host: host || '127.0.0.1',
      port: port || 5984
    });


    return _.extend({
      db: new Cradle.Connection().database(dbName),
      create: function(request) {

      },
      read: function(request) {
        var promise = new Promise();
        if(request.schema) {
          this.db.view(request.schema + '/all', _.bind(function(err, doc) {
            if(!err && doc.length > 0) {
              promise.resolve(doc);
            } else {
              promise.reject(err);
            }
          },this));
        }
        return promise;
      },
      update: function(request) {

      },
      delete: function(request) {

      }
    },Backbone.Events);
});