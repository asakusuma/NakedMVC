define( 'RootController', ['Eventable','RootView','DataFactory'], function(Eventable, rootView, dataFactory) {
	var RootController = new Eventable();
	RootController = _.extend(RootController, {
		init: function() {
			this.view = rootView;
			this.data = dataFactory;
			window.app.bus.on('title-clicked', this.sayHi);
			console.log(app.schemas);
			this.view.init();
		},
		//Routes
		routeToDB: function(slug) {
			//Decision Board Page
		},
		routeToHome: function() {
			//Default route
		},

		//Utility
		notFound: function() {
			//404
		},
		sayHi: function() {
			alert('Title clicked!!');
		}
	});
	return RootController;
});