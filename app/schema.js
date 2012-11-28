define(['path', 'app/schemaBuilder'], function(path, SchemaBuilder) {
  	var schema = new SchemaBuilder(),
  		schemas = schema.parseDirectory('./app/schemas'),
      	schemaSrc = schema.scriptSrc( schemas);
    return {
    	script: schemaSrc,
    	obj: schemas
    };
});
