var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , requirejs = require('requirejs')
  , dust = require('dustjs-linkedin')
  , dustfs = require('dustfs')
  , compiler = require('./app/duster.js')
  , dataproxyCompiler = require('./app/dataproxyCompiler.js')
  , $ = require('jquery')
  , _ = require('underscore')
  , cons = require('consolidate')
  , templates = require('./app/templates.js');

/*
process.on('uncaughtException', function (err) {
  server.close();
});
process.on('SIGTERM', function () {
  server.close();
});
*/



requirejs.config({
    nodeRequire: require,
    baseUrl: "public/javascripts/",
    paths: {
      "app": "../../app",
      "schema": "../../app/schema",
      "dataproxy": "../../app/dataproxy"
    }
});

templates.register(dust);

requirejs(['components', 'routes', 'schema'],
function(components, routes, schema) {
  var page, route;

  app.engine('dust', cons.dust);
  app.configure(function(){
    //app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'dust');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

   server.listen(3000);

  //Setup routes that hit pages
  for(route in routes) {
    page = components.page[routes[route]];
    if(page) {
      page.route = route;
      app.get(route, (function(page) {
        return function(req, res) {
          var controller = new page.controllerClass();
          controller.init(req.params, function(event, html) {
            res.render('global', {
              title: page.title,
              markup: html,
              route: req.route.path
            });
          });
        };
      })(page));
    }
  }

  //Output schema file for client
  app.get('/schema.js',function(req, res){
    res.setHeader('Content-Type', 'text/javascript');
    res.send(schema.script);
  });

  io.sockets.on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
});