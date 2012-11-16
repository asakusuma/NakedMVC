define( 'RootController', ['Eventable','RootView'], function(Eventable, rootView) {
	var RootController = new Eventable();
	RootController = _.extend(RootController, {
		init: function() {
			this.view = rootView;
			this.view.on('view-loaded', this.sayHi);
			this.view.init();
		},
		sayHi: function() {
			alert('View loaded!');
		}
	});
	return RootController;
});