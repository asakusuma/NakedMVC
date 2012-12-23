var path = require('path')
  , requirejs = require('requirejs')
  , dust = require('dustjs-linkedin')
  , dustfs = require('dustfs')
  , compiler = require('./app/duster.js')
  , dataproxyCompiler = require('./app/dataproxyCompiler.js')
  , $ = require('jquery')
  , _ = require('underscore')
  , cons = require('consolidate')
  , templates = require('./app/templates.js')
  , guid = require('node-guid');

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

requirejs(['components', 'routes', 'schema', 'app/application', 'dataproxy'],
function(components, routes, schema, application, dataproxy) {
  var page, route,
    app = application.app,
    express = application.express,
    server = application.server;

  //Exit on crash
  /*
  process.on('uncaughtException', function (err) {
    server.close();
  });
  process.on('SIGTERM', function () {
    server.close();
  });
  */

  app.engine('dust', cons.dust);
  app.configure(function(){
    app.set('views', __dirname + '/templates');
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

  var routeMap = [];

  //Setup routes that hit pages
  for(route in routes) {
    page = components.page[routes[route]];
    if(page) {
      page.route = route;
      app.get(route, (function(page) {
        return function(req, res) {
          var params = req.params;
          var controller = new page.controllerClass({
            params: req.params,
            renderCallback: function(html) {
              //Workaround for weird behavior of req.params
              var params = {};
              for(var key in req.params) {
                params[key] = req.params[key];
              }
              if(!res._headerSent) {
                res.render('global', {
                  title: page.title,
                  markup: html,
                  route: req.route.path,
                  url: req.url,
                  params: JSON.stringify(params),
                  routes: JSON.stringify(routeMap)
                });
              }   
            }
          });
        };
      })(page));
    }
  }

  //Build route map from app routes
  for(var i = 0; i < app.routes.get.length; i++) {
    routeMap.push({
      route: app.routes.get[i].path,
      regex: app.routes.get[i].regexp.toString()
    });
  }

  //Output schema file for client
  app.get('/schema.js',function(req, res){
    res.setHeader('Content-Type', 'text/javascript');
    res.send(schema.script);
  });

  //Setup data serving and subscribing
  application.io.sockets.on('connection', function (socket) {
    socket.on('dp_request', function (data, callback) {
      var args = [];
      for(var index in data.arguments) {
        args.push(data.arguments[index]);
      }
      args.push(socket.id);

      dataproxy._registerQuery(data, _.bind(function(models) {
        var IAmOrigin = true;
        if(!models.getOriginID || models.getOriginID() !== socket.id) {
          IAmOrigin = false;
        }
        socket.emit('models_changed', models, IAmOrigin);
      },this));

      dataproxy[data.name].apply(dataproxy, args).then(function(results) {
        callback(results);
      });
    });
  });
});