requirejs.config({
    nodeRequire: require,
    baseUrl: "/javascripts",
    paths: {
      "schema": "/schema",
      "app" : "/javascripts",
      "jquery": "lib/jquery-1.8.2.min",
      "dustjs-linkedin": "lib/dust-full-1.1.1",
      "async":"lib/async",
      "underscore": "lib/underscore"
    },
    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },
        'dustjs-linkedin': {
            deps: [],
            exports: 'dust'
        }
    }
});

requirejs(['router','templates'], function(router, registerTemplates) {
    registerTemplates();
    router.start(window.app);
});