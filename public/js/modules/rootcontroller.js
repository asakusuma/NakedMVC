define( 'RootController', ['Eventable','RootView','DataFactory'], function(Eventable, rootView, dataFactory) {
	var RootController = new Eventable();
	RootController = _.extend(RootController, {
		init: function() {
			this.view = rootView;
			this.data = dataFactory;
			this.view.on('view-loaded', this.sayHi);
			this.view.init();
		},
		sayHi: function() {
			console.log('View loaded!');
		}
	});
	return RootController;
});