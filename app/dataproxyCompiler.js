var input_path = "./app/"; // directory of dust templates are stored with .dust file extension
var output_path = "./public/javascripts/dataproxy.js"; // directory where the compiled .js files should be saved to

var fs = require('fs');
var dust = require('dustjs-linkedin');
var watch = require('watch');

function compile_dataproxy(path, curr, prev) {
  console.log("Compile frontend dataproxy");
  var output = "define(function() {";
  
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
})