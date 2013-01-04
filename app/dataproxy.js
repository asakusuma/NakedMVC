//The dataproxy is an abstraction for talking with the CouchDB database. While CouchDB is a NoSQL database, it's
//used relationally in NakedMVC (sorry). Documents have a 'type', which corresponds to a schema.

define('dataproxy', [
    'lib/backbone',
    'base/promise',
    'app/db_drivers/couch',
    'async',
    'schema',
    'base/model',
    'underscore'
  ], function (
    Backbone, 
    Promise, 
    Database, 
    Async, 
    Schema,
    Model,
    _
  ) {

    return _.extend({
      request: function(request) {
        return Database.read(request);
      },
      _registerQuery: function(request, callback) {
        var query = request.arguments[0];

        //When the query changes, fire the callback
      }
    },Backbone.Events);
});