
var cradle = require('cradle'),
    async = require('async'),
    db,
    dbName = 'app',
    host,
    port;

// Cradle setup
cradle.setup({
  cache: true,
  raw: false,
  host: host || '127.0.0.1',
  port: port || 5984
});

db = new cradle.Connection().database(dbName);

/*
 * GET list of all boards
 */
exports.listBoards = function(req, res) {
  db.view('boards/all', {}, function(err, doc) {
    res.send(doc.map(function(item) {
      return item;
    }));
  });
}

/*
 * GET list of all cards
 */
exports.listCards = function(req, res) {
  db.view('cards/all', {}, function(err, doc) {
    res.send(doc.map(function(item) {
      return item;
    }));
  });
}

/*
 * GET board
 */
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

/*
 * GET card
 */
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

/*
 * GET field of study
 */
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

/*
 * GET school
 */
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
