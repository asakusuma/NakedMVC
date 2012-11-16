var SchemaBuilder = require('../lib/SchemaBuilder'),
    path = require('path');

var schema = new SchemaBuilder(),
    src    = schema.scriptSrc( schema.parseDirectory( path.resolve( __dirname, '..', 'schemas' ) ));

/*
 * GET schema list
 */
exports.script = function(req, res){
  res.setHeader('Content-Type', 'text/javascript');
  res.send(src);
};
