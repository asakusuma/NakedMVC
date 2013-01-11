var requirejs = require('requirejs');
var hostname = 'localhost'; //require('os').hostname();

// TODO: do something less hacky here
hostname = hostname.replace('.local', '');
requirejs.config({
    nodeRequire: require,
    baseUrl: "public/javascripts/",
    paths: {
      "app": "../../app",
      "schema": "../../app/schema",
      "dataproxy": "../../app/dataproxy"
    }
});

requirejs(['dataproxy', 'underscore', 'base/model'], function(dataproxy, _, Model) {
  // directory of dust templates are stored with .dust file extension
  var input_path = "./app/";
  // directory where the compiled .js files should be saved to
  var output_path = "./public/javascripts/dataproxy.js";

  var fs = require('fs');
  var dust = require('dustjs-linkedin');
  var watch = require('watch');

  function compile_dataproxy(path, curr, prev) {
    console.log("Compile frontend dataproxy");

    var host = 'http://'+hostname+':3000',
    output = "define(['base/promise', 'models/model'], function(Promise, Model) { \n";
    output += "function DataProxy(io) { \n";
    output += "_.bindAll(this);\n";
    output += "this.models = {};\n";
    output += "this.promises = {};\n";
    output += "this.socket = io.connect('" + host + "');\n";
    output += "this.socket.on('model_changed', _.bind(this.serverModelsChanged,this));"
    output += "} \n";

    output += "DataProxy.prototype.serverModelsChanged = function(data, IAmOrigin) {  \n";
      output += "console.log(data); \n";
    output += "} \n";

    output += "DataProxy.prototype.modelChanged = function(event, data) { \n";
      output += "this.update(data);\n";
    output += "}\n";

    output += "DataProxy.prototype.modelize = function(data) { \n";
      output += "if(_.isObject(this.models[data._id])) { \n";
        output += "return this.models[data._id];\n";
      output += "} else {\n";
        output += "this.models[data._id] = new Model(data); \n";
        output += "return this.models[data._id];\n";
      output += "}\n";
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

        if(property === 'request') {
          output += "if(arguments[0].entityKey && !arguments[0].id) {\n";
          output += "if(!this.promises[arguments[0].entityKey]) {\n";
            output += "this.promises[arguments[0].entityKey] = [];\n";
          output += "}\n";
          output += "this.promises[arguments[0].entityKey].push(promise);\n";
          output += "}\n";
        }

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


  //compile_dataproxy();

  watch.createMonitor(input_path, function (monitor) {
    //console.log("Watching " + input_path);
    //monitor.files['dataproxy.js', '*/*'];
    //monitor.on("created", compile_dataproxy);
    //monitor.on("changed", compile_dataproxy);
  });
});
