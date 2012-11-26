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
      output = "define(['base/promise'], function(Promise) { \n";
      output += "function DataProxy(io) { ";
      output += "this.socket = io.connect('" + host + "');";
      output += "} \n";

      for(var property in dataproxy) {
        var func = dataproxy[property];
        if(property[0] !== '_' && _.isFunction(func)) {
          output += "DataProxy.prototype." + property + " = function() { ";
          output += "var promise = new Promise();";

          output += "this.socket.emit('dp_request', { name: '" + property + "', arguments: arguments });";

          output += "this.socket.on('dp_response_" + property + "', function(data) { ";
            output += "console.log(data); ";
          output += "});"
          output += "return promise;";
          output += "} \n";
        }
      }
    
    output += "return new DataProxy(io); \n";
    output += "});";
    
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