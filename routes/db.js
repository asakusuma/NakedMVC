
var cradle = require('cradle'),
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
 * GET users listing.
 */
exports.board = function(req, res){
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
