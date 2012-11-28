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
      this.queryListeners = {};

      this.changeFeed = this.db.changes({ 
        include_docs: true,
        since: 'now'
      });

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
    _dataChanged: function(change) {
      if(change.doc) {
        if(this.queryListeners[change.id]) {
          this.request({
            id: change.id
          }).then(_.bind(function(results) {
            this.queryListeners[change.id].trigger('change', results);
          },this));
        } else if(this.queryListeners[change.doc.type]) {
          this.request({
            entityKey: change.doc.type
          }).then(_.bind(function(results) {
            this.queryListeners[change.doc.type].trigger('change', results);
          },this));
        }
      }
    },
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
      if(this.hash[attrs['_id']]) {
        return this.hash[attrs['_id']];
      } else {
        var n = new Model(attrs);
        this.hash[attrs['_id']] = n;
        return n;
      }
    },
    update: function(model) {
      var promise = new Promise(),
        map = {
          Board: 'updateBoard'
        };
      if(model) {
        if(model.attributes.type && map[model.attributes.type]) {
          promise = this[map[model.attributes.type]](model);
        } else {
          promise.reject();
        }
      } else {
        promise.reject();
      }
      return promise;
    },
    updateBoard: function(board) {
      var foreignKeys = this._getForeignKeys(board.attributes);

      //Update foreign
      for(var i = 0; i < foreignKeys.length; i++) {
        var children = board.attributes[foreignKeys[i]];
        for(var c = 0; c < children.length; c++) {
          this.update(children[c]);
        }
      }

      //Delete foreign
      for(var i = 0; i < foreignKeys.length; i++) {
        delete board.attributes[foreignKeys[i]];
      }

      return this._update(board.attributes);
    },
    _update: function(obj) {
      var promise = new Promise();
      if(obj._id) {
        _.extend(this.hash[obj._id].attributes, obj);
        this.db.merge(obj._id, obj, function (err, res) {
          if(err) promise.reject();
          promise.resolve();
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
		_query: function(query) {
			var promise = new Promise();
			if(query.id) {
				this.db.get(query.id, _.bind(function(err, doc) {
          if(err) {
            promise.reject(err);
          } else {
            var foreignKeys = this._getForeignKeys(doc);

            if(foreignKeys.length > 0) {
              //Replace foreign IDS with actual data
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


/*
exports.listBoards = function(req, res) {
  db.view('boards/all', {}, function(err, doc) {
    res.send(doc.map(function(item) {
      return item;
    }));
  });
}

exports.listCards = function(req, res) {
  db.view('cards/all', {}, function(err, doc) {
    res.send(doc.map(function(item) {
      return item;
    }));
  });
}

exports.board = function(req, res){
  var id = req.params.id, value;
  db.view('boards/all', { key: id }, function(err, doc) {
    if(err) {
      res.statusCode = 404;
      res.send(err);
    } else {
      value = doc[0].value;
      async.map(value.cards, function(cardId, cb) {
        db.view('cards/all', { key: cardId }, function(err, doc) {
          cb(err, doc[0].value);
        });
      }, function(err, results) {
        value.cards = results;
        res.send(value);
      });
    }
  });
};

exports.card = function(req, res){
  var id = req.params.id;
  db.view('cards/all', { key: id }, function(err, doc) {
    if(err) {
      res.statusCode = 404;
      res.send(err);
    } else {
      res.send(doc);
    }
  });
};

exports.fieldOfStudy = function(req, res){
  var id = req.params.id;
  db.get(id, function(err, doc) {
    if(err) {
      res.statusCode = 404;
      res.send(err);
    } else {
      res.send(doc);
    }
  });
};

exports.school = function(req, res){
  var id = req.params.id;
  db.get(id, function(err, doc) {
    if(err) {
      res.statusCode = 404;
      res.send(err);
    } else {
      res.send(doc);
    }
  });
};

*/