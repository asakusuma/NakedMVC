define('dataproxy', [
    'base/eventable',
    'base/promise',
    'cradle',
    'async',
    'schema',
    'models/model'
  ], function (
    Eventable, 
    Promise, 
    Cradle, 
    Async, 
    Schema,
    Model
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
		},
		getNumBoards: function(success, error, context) {
			var promise = new Promise();
			promise.resolve(2);
			return promise;
		},
		//query can't call this method
		_somePrivateMethod: function() {

		},
    createModel: function(attrs) {
      if(this.hash[attrs['_id']]) {
        console.log("Cache hit!");
        return this.hash[attrs['_id']];
      } else {
        var n = new Model(attrs);
        this.hash[attrs['_id']] = n;
        return n;
      }
    },
    request: function(query) {
      if(query.ids) {
        return this.query(query);
      } else if(query.id) {
        if(this.hash[query.id]) {
          console.log("Cache Hit!");
          var promise = new Promise();
          promise.resolve(this.hash[query.id]);
          return promise;
        }
      }
      return this.query(query);
    },
		query: function(query) {
			var promise = new Promise();
			if(query.id) {
				this.db.get(query.id, _.bind(function(err, doc) {
          if(err) {
            promise.reject(err);
          } else {
            var foreignKeys = [];

            //Determine if any fields contain foreign IDS
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
                  promise.resolve(this.createModel(doc));
              },this)); 
            } else {
              promise.resolve(this.createModel(doc));
            }
          }
        }, this));
        return promise;
      } else if(query.ids && query.entityKey) {
        console.log(query);
        this.async.map(query.ids, _.bind(
          function(id, cb) {
            this.db.view(query.entityKey + '/all', { key: id }, _.bind(function(err, doc) {
              if(err) throw err;
              if(doc.length > 0) {
                cb(err, this.createModel(doc[0].value));
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