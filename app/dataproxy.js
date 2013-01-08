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
        return Database.read(request);
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
          this.subscriptions[socketID].push(this._buildMapReduceFunction(request, callback));
        }
      },
      _buildMapReduceFunction: function(request, callback) {
        var evaluate = function(data, query, key) {
          var result = false,
            i,
            key;
          if(_.isArray(query)) {
            //OR
            for(i = 0; i < query.length; i++) {
              if(evaluate(data, query[i])) return true;
            }
            return false;
          } else if(_.isObject(query)) {
            //AND
            result = true;
            for(key in query) {
              result = result && evaluate(data, query[key], key);
            }
            return result;
          } else if(key) {
            //Individual rule
            if(key === 'schema') {
              if(data.type === query) return true;
            }
          }
          return false;
        }
        return function(data, originSocketID) {
          console.log('MAP REDUCE: ');
          console.log(data);
          console.log(originSocketID);
          if(evaluate(data, request.arguments[0])) callback();
        };
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
            this.subscriptions[socketID][i](data, originSocketID);
          }
        }
      },
      _socketDisconnected: function(socketID) {
        delete this.subscriptions[socketID];
      }
    },Backbone.Events);
});