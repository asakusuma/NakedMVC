var requirejs = require('requirejs');
 
requirejs.config({
    nodeRequire: require,
    baseUrl: "public/javascripts/",
    paths: {
      "app": "../../app",
      "schema": "../../app/schema",
      "dataproxy": "../../app/dataproxy"
    }
});

requirejs(['dataproxy', 'underscore'], function(dataproxy, _) {
  var input_path = "./app/"; // directory of dust templates are stored with .dust file extension
  var output_path = "./public/javascripts/dataproxy.js"; // directory where the compiled .js files should be saved to

  var fs = require('fs');
  var dust = require('dustjs-linkedin');
  var watch = require('watch');

  function compile_dataproxy(path, curr, prev) {
    console.log("Compile frontend dataproxy");


    /*
    var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
*/


      var host = 'http://localhost:3000',
      output = "define(['base/promise', 'models/model'], function(Promise, Model) { \n";
      output += "function DataProxy(io) { \n";
      output += "_.bindAll(this);\n";
      output += "this.models = {};\n";
      output += "this.socket = io.connect('" + host + "');\n";
      output += "this.socket.on('models_changed', _.bind(this.serverModelsChanged,this));"
      output += "} \n";

      output += "DataProxy.prototype.serverModelsChanged = function(data) {  \n";
        output += "console.log(data); \n";
      output += "} \n";

      output += "DataProxy.prototype.modelChanged = function(event, data) { \n";
        output += "this.update(data);\n";
      output += "}\n";

      output += "DataProxy.prototype.modelize = function(data) { \n";
      output += "if(_.isArray(data)) { \n";
      output += "var models = [];\n";
        output += "for(var i = 0; i < data.length; i++) { models.push(this.modelize(data[i])); }\n";
        output += "return models; \n";
      output += "} else if(_.isObject(data) && data.attributes) {\n";
        output += "for(var key in data.attributes) {\n";
          output += "data.attributes[key] = this.modelize(data.attributes[key]);\n";
        output += "} \n";
        output += "var model;\n";
        output += "if(this.models[data.attributes._id]) {\n";
          output += "model = this.models[data.attributes._id]\n";
          output += " } else { \n";
          output += "model = new Model(data.attributes);\n";
          output += "model.on('change', _.bind(this.modelChanged, this));"
          output += " }";
        output += "return model;\n";

      output += "} else { return data; } \n";
      output += "}\n";

      for(var property in dataproxy) {
        var func = dataproxy[property];
        if(property[0] !== '_' && _.isFunction(func)) {
          output += "DataProxy.prototype." + property + " = function() { \n";
          output += "var promise = new Promise();\n";

          output += "var cb = _.bind(function(data) { \n";
            output += "promise.resolve(this.modelize(data)); \n";
          output += "}, this);"

          output += "this.socket.emit('dp_request', { name: '" + property + "', arguments: arguments }, cb);\n";

          output += "return promise;\n";
          output += "} \n";
        }
      }
    
    output += "return new DataProxy(io); \n";
    output += "});\n";
    
    fs.writeFile(output_path, output, function(err) {
      if (err) throw err;
      console.log('Saved ' + output_path);
    });
    
  }

  watch.createMonitor(input_path, function (monitor) {
    console.log("Watching " + input_path);
    monitor.files['dataproxy.js', '*/*'];
    monitor.on("created", compile_dataproxy);
    monitor.on("changed", compile_dataproxy);
  });
});