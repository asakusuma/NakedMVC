define( 'Application', ['RootController', 'Eventable', 'Promise'], function(rootController, Eventable, Promise){

	//Create a global event bus
	window.app.bus = new Eventable();

 	rootController.init();

});