define( 'RootController', ['Eventable','BoardView','DataFactory'], function(Eventable, boardView, dataFactory) {
	var RootController = new Eventable();
	RootController = _.extend(RootController, {
		init: function() {
			this.data = dataFactory;
			_.bindAll(this);
		},
		//Routes
		routeToDB: function(slug) {
			var queries;
			//Decision Board Page
			this.view = boardView;
			entityKeys = this.view.init($('#app'));
			this.requestViewData(entityKeys, slug);
		},
		routeToHome: function() {
			//Default route
		},

		//Data layer
		requestViewData: function(entityKeys, slug) {
			for(var i = 0; i < entityKeys.length; i++) {
				(function(q, dataFactory, view) {
					dataFactory.query(entityKeys[i],q).then(function(data, entityKey) {
						view.loadData(entityKey, data);
					}, function(error) {
						view.loadData(q, null);
					});
				})(slug, this.data, this.view);
			}
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