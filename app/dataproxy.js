define('dataproxy', [
    'base/eventable',
    'base/promise',
    'cradle',
    'async',
    'schema',
    'models/model',
    'underscore'
  ], function (
    Eventable, 
    Promise, 
    Cradle, 
    Async, 
    Schema,
    Model,
    _
  ) {
  var DataProxy = new Eventable();
  DataProxy = _.extend(DataProxy, {
    init: function(cradle, async) {
      this.async = async;
      var dbName = 'app',
          host,
          port;

      // Cradle setup
      cradle.setup({
        cache: true,
        raw: false,
        host: host || '127.0.0.1',
        port: port || 5984
      });
      this.db = new cradle.Connection().database(dbName);
      this.hash = {};

      //Initialize query listener object. The query listener object is a hash of query listeners.
      //Query listeners are eventable objects that represent a query. To subscribe to changes to
      //data within a given query, subscribe to the 'change' event on the query listener counterpart.
      this.queryListeners = {};

      this.changeFeed = this.db.changes({ 
        include_docs: true,
        since: 'now'
      });

      //Listen to any database changes
      this.changeFeed.on('change', _.bind(this._dataChanged,this));
    },
    getNumBoards: function(success, error, context) {
      var promise = new Promise();
      promise.resolve(2);
      return promise;
    },
    //frontend can't call this method
    _somePrivateMethod: function() {

    },
    //Callback for database changes
    _dataChanged: function(change) {
      if(change.doc) {
        //Update model query listener, i.e. Asa's Board
        if(this.queryListeners[change.id]) {
          this.request({
            id: change.id
          }).then(_.bind(function(results) {
            this.queryListeners[change.id].trigger('change', results);
          },this));
        }

        //Update type query listener, i.e. Boards
        if(this.queryListeners[change.doc.type]) {
          this.request({
            entityKey: change.doc.type
          }).then(_.bind(function(results) {
            this.queryListeners[change.doc.type].trigger('change', results);
          },this));
        }
      }
    },
    //Listen to any changes to data within the given query
    _registerQuery: function(command, callback) {
      if(command.name === 'request') {
        var query = command.arguments[0],
          queryKey;

        if(query.id) {
          queryKey = query.id;
        } else if(query.entityKey) {
          queryKey = query.entityKey;
        }

        if(queryKey) {
          if(!this.queryListeners[queryKey]) {
            this.queryListeners[queryKey] = new Eventable();
          }
          this.queryListeners[queryKey].on('change',callback);
        }
      }
    },
    _createModel: function(attrs) {
      //Object is already a model
      if(attrs.isModel) {
        return attrs;
      }
      //Object is a flattened model
      if(attrs.attributes) {
        attrs = attrs.attributes;
      }

      if(this.hash[attrs['_id']]) {
        return this.hash[attrs['_id']];
      } else {
        var n = new Model(attrs);
        this.hash[attrs['_id']] = n;
        return n;
      }
    },
    _typeToEntityKey: function(typeString) {
      return typeString.toLowerCase()+'s';
    },
    create: function(obj) {
      var promise = new Promise(),
        id;
      if(obj.title && obj.type) {
        id = obj.title.toLowerCase().replace(/ /g,'-');
        this.db.save(id, obj, _.bind(function (err, res) {
          if(err) {
            promise.reject();
          } else {
            promise.resolve();
            obj._id = id;
            this.queryListeners[this._typeToEntityKey(obj.type)].trigger('change', this._createModel(obj));
          }
        }, this));
      }
      return promise;
    },
    update: function(model, clientID) {
      var promise = new Promise(),
        map = {
          Board: 'updateBoard'
        };

      //If model is set from client, it's a flat object, and not an actual model, so it needs to be converted to an acutal model object
      model = new Model(model.attributes);

      if(model && model.attributes && model.attributes.type && map[model.attributes.type]) {
          model.setOriginID(clientID);
          promise = this[map[model.attributes.type]](model);
      } else {
        promise.reject();
      }
      return promise;
    },
    updateBoard: function(board) {
      var foreignKeys = this._getForeignKeys(board.attributes);

      //Update foreign/related/child models
      for(var i = 0; i < foreignKeys.length; i++) {
        var children = board.attributes[foreignKeys[i]];
        board.attributes[foreignKeys[i]] = [];
        for(var c = 0; c < children.length; c++) {
          if(children[c].attributes) {
            board.attributes[foreignKeys[i]].push(children[c].attributes._id);
          } else {
            board.attributes[foreignKeys[i]].push(children[c]);
          }
        }
      }
      return this._update(board.attributes);
    },
    //Update a database document
    _update: function(obj) {
      var promise = new Promise();
      if(obj._id) {
        this.hash[obj._id] = null;
        delete this.hash[obj._id];
        this.db.merge(obj._id, obj, function (err, res) {
          if(err) {
            promise.reject(err);
          } else {
            promise.resolve();
          }
        });
      }
      return promise;
    },
    request: function(query) {
      if(query.ids) {
        return this._query(query);
      } else if(query.id) {
        if(this.hash[query.id]) {
          var promise = new Promise();
          promise.resolve(this.hash[query.id]);
          return promise;
        }
      }
      return this._query(query);
    },
    //Returns a list of keys for the given object that hold ids of other objects
    _getForeignKeys: function(doc) {
      var foreignKeys = [];
      for(var key in doc) {
        var schemaName = key;
        if(schemaName[schemaName.length-1] === 's') {
          schemaName = schemaName.substring(0,schemaName.length - 1);
        }
        schemaName = schemaName[0].toUpperCase() + schemaName.substr(1);
        if(Schema.obj[schemaName]) {
          foreignKeys.push(key);
        }
      }
      return foreignKeys;
    },
    //Execute a query
    _query: function(query) {
      var promise = new Promise();
      //If the query is requesting an individual document
      if(query.id) {
        this.db.get(query.id, _.bind(function(err, doc) {
          if(err) {
            promise.reject(err);
          } else {
            var foreignKeys = this._getForeignKeys(doc);
            if(foreignKeys.length > 0) {
              //Replace foreign IDs with actual data
              this.async.map(foreignKeys, _.bind(
                function(entityKey, cb) {
                  this.request({
                    entityKey: entityKey,
                    ids: doc[entityKey]
                  }).then(function(data) {

                    cb(null, {
                      entityKey: entityKey,
                      data: data
                    });
                  }, function() {
                    cb("Bad query", null);
                  });
                }, this), _.bind(function(err, results) {
                  for(var i = 0; i < results.length; i++) {
                    doc[results[i].entityKey] = results[i].data;
                  }
                  promise.resolve(this._createModel(doc));
              },this)); 
            } else {
              promise.resolve(this._createModel(doc));
            }
          }
        }, this));
        return promise;
      //If the query is a list of documents
      } else if(query.ids && query.entityKey) {
        this.async.map(query.ids, _.bind(
          function(id, cb) {
            this.db.view(query.entityKey + '/all', { key: id }, _.bind(function(err, doc) {
              if(err) throw err;
              if(doc.length > 0) {
                cb(err, this._createModel(doc[0].value));
              } else {
                cb(err);
              }
            },this));
          },
          this), function(err, results) {
            promise.resolve(results);
        });
        return promise; 
      //If the query is * of an entityKey
      } else if(query.entityKey) {
        this.db.view(query.entityKey+'/all', {}, function(err, doc) {
          promise.resolve(doc);
        });
        return promise;
      } else {
        if(query.predefined && this[query.predefined] && query.predefined[0] !== '_') {
          return this[query.predefined]();
        }
      }
      promise.reject('Unknown query');
      return promise;
    }
  });
  DataProxy.init(Cradle, Async);
  return DataProxy;
});