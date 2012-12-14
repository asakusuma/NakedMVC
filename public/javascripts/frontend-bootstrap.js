/*
requirejs.config({
    nodeRequire: require,
    baseUrl: "/javascripts",
    paths: {
      "schema": "/schema",
      "app" : "/javascripts",
      "jquery": "lib/jquery-1.8.2.min",
      "dustjs-linkedin": "lib/dust-full-1.1.1",
      "async":"lib/async",
      "underscore": "lib/underscore",
      "bootstrap": "lib/boostrap.min"
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
*/

Inject.addRule(/schema/, {
  path: "../schema"
});

Inject.addRule(/^jquery$/, {
  path: "lib/jquery-1.8.2.min",
  pointcuts: {
    after: function() {
      module.setExports(jQuery.noConflict());
      delete window["jQuery"];
    }
  }
});



//localStorage.clear();
Inject.setExpires(0);
Inject.setModuleRoot("/javascripts/");

require.run("application");