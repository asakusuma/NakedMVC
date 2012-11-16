define( 'RootView', ['Eventable'], function(Eventable) {
	var RootView = new Eventable();
	RootView = _.extend(RootView, {
		init: function() {
			this.trigger('view-loaded');
		}
	});
	return RootView;
});