requirejs.config({
    nodeRequire: require,
    baseUrl: "/javascripts",
    paths: {
      "schema": "/schema",
      "app" : "/javascripts",
      "jquery": "lib/jquery-1.8.2.min",
      "dustjs-linkedin": "lib/dust-full-1.1.1",
      "async":"lib/async"
    },
    shim: {
        'jquery': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: [],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: '$'
        },
        'dustjs-linkedin': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: [],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'dust'
        }
    }
});

requirejs(['components', 'routes', 'schema'], function() {

});