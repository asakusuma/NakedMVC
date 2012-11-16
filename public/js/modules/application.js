define( 'Application', ['RootController', 'Eventable', 'Promise'], function(rootController, Eventable, Promise){

	//Create a global event bus
	App.events = new Eventable();
	
 	rootController.init();

});