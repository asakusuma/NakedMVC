// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca
// modified by Asa Kusuma

var input_path = "./views"; // directory of dust templates are stored with .dust file extension
var output_path = "./public/javascripts/"; // directory where the compiled .js files should be saved to
var backend_output_path = "./app/";

var fs = require('fs');
var dust = require('dustjs-linkedin');
var watch = require('watch');

function compile_dust(path, curr, prev) {
  fs.readFile(path, function(err, data) {
    if (err) throw err;
    var segs = path.split("/"),
      compiled = '';
    segs.pop();
    path = segs.join("/");
    fs.readdir(path, function(err, files) {
      if (err) throw err;
      var fileCount = files.length;
      var compiledCount = 0;
      for(var i = 0; i < fileCount; i++) {
        var fpath = path + "/" + files[i];
        
        (function(fpath) {
          fs.readFile(fpath, function(err, data) {
          if (err) throw err;
            var filename = fpath.split("/").reverse()[0].replace(".dust", "");
            compiled += dust.compile(new String(data), filename);

            compiledCount++;
            if(compiledCount === fileCount) {
              var filepath = output_path + "templates.js";
              var backendfilepath = backend_output_path + "templates.js";
              fs.writeFile(filepath, compiled, function(err) {
                if (err) throw err;
                console.log('Saved ' + filepath);
              });

              fs.writeFile(backendfilepath, "exports.register = function(dust) { "+compiled+" };", function(err) {
                if (err) throw err;
                console.log('Saved ' + filepath);
              });
            }
          });
        })(fpath);
      }
    });
  });
}

watch.createMonitor(input_path, function (monitor) {
  console.log("Watching " + input_path);
  monitor.files['*.dust', '*/*'];
  monitor.on("created", compile_dust);
  monitor.on("changed", compile_dust);
})