define(['fs', 'path'], function(fs, path) {
  /**
   * Builds schema object
   */
  function SchemaBuilder() {

  }

  /**
   * Parse a directory for schemas, and return an array of schema objects
   * @param {String} path directory to parse
   * @return {Object} schema list object
   */
  SchemaBuilder.prototype.parseDirectory = function( dir ) {
      return this.buildSchemaList(
        fs.readdirSync(dir)
          .map(function(file) {
            var contents = fs.readFileSync(path.resolve(dir, file)).toString(),
                json     = this.parseJSON(contents);

            return json;
          }, this)
      );
  }

  /**
   * Create schema object from JSON
   * @param {String} json the json text
   * @return {Object}
   */
  SchemaBuilder.prototype.parseJSON = function(json) {
    try {
      return JSON.parse(json);
    } catch(e) {
      //console.log(e);
    }
  }

  /**
   * Build Schema List
   * @param {Array} schemas list of schema objects
   * @return {Object} schema list object
   */
  SchemaBuilder.prototype.buildSchemaList = function(schemas) {
    var schemaList = {};

    schemas.forEach(function(schema) {
      if(schema && schema.name) {
        schemaList[schema.name] = schema;
      }
    });

    return schemaList;
  }

  /**
   * Build schema script source
   */
  SchemaBuilder.prototype.scriptSrc = function(schemaList) {
    return 'window.app = window.app || {};window.app.schemas = ' + JSON.stringify(schemaList) + ';';
  }

  return SchemaBuilder;
});