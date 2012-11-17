define( 'RootView', ['Eventable'], function(Eventable) {
	var RootView = new Eventable();
	RootView = _.extend(RootView, {
		init: function() {
			$('h1').click(function() {
				window.app.bus.trigger('title-clicked');
			});
		}
	});
	return RootView;
});