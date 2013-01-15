//The dataproxy is an abstraction for talking with the CouchDB database. While CouchDB is a NoSQL database, it's
//used relationally in NakedMVC (sorry). Documents have a 'type', which corresponds to a schema.

define('dataproxy', [
    'lib/backbone',
    'base/promise',
    'app/db_drivers/mysql',
    'async',
    'schema',
    'base/model',
    'base/collection',
    'underscore',
    'dataproxy-utility'
  ], function (
    Backbone, 
    Promise, 
    Database, 
    Async, 
    Schema,
    Model,
    Collection,
    _,
    Utility
  ) {

    return _.extend({
      subscriptions: {},
      create: function(data, originSocketID) {
        var result;
        data.dateCreated = new Date();
        data.dateUpdated = data.dateCreated;
        result = Database.create(data);
        this._notifyClientsOnResult(result, originSocketID);
        return result;
      },
      read: function(request) {
      	var promise = new Promise();
      	Database.read(request).then(function(data) {
      		promise.resolve(new Collection(data));
      	});
        return promise;
      },
      update: function(data) {
        data.dateUpdated = new Date();
        return Database.update(data);
      },
      delete: function(request) {
        return Database.delete(request);
      },
      _registerQuery: function(request, socketID, callback) {
        var query = request.arguments[0];
        if(request.name === 'read') {
          //When the query data changes, fire the callback
          if(!_.isObject(this.subscriptions[socketID])) {
            this.subscriptions[socketID] = [];
          }
          this.subscriptions[socketID].push(Utility.buildMapReduceFunction(request, callback));
        }
      },
      _notifyClientsOnResult: function(promise, originSocketID) {
        promise.onSuccess((function(context, originSocketID) {
          return function(newObject) {
            context._notifyClients.call(context, newObject, originSocketID);
          }
        })(this, originSocketID));
      },
      _notifyClients: function(data, originSocketID) {
        for(var socketID in this.subscriptions) {
          for(var i = 0; i < this.subscriptions[socketID].length; i++) {
          	console.log('ALERT');
          	console.log(data);
            this.subscriptions[socketID][i](data, originSocketID);
          }
        }
      },
      _socketDisconnected: function(socketID) {
        delete this.subscriptions[socketID];
      }
    },Backbone.Events);
});