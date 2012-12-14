define(['router','templates'], function(router, registerTemplates) {
    registerTemplates();
    router.start(window.app);
});