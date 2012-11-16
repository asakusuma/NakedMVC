/**
 * @author LinkedIn
 */
var should         = require('../lib/sinon-chai').chai.should(),
    sinon          = require('sinon'),
    path           = require('path'),
    SchemaBuilder  = require('../../lib/SchemaBuilder.js');

describe('lib/SchemaBuilder', function() {
  it('should parse directory of schemas', function() {
    var builder = new SchemaBuilder(),
        list = builder.parseDirectory( path.resolve( __dirname, '..', 'data', 'schemas' ) );
    console.log(builder.scriptSrc(list));
  });
});
