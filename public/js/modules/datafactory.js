define( 'DataFactory', ['Eventable', 'Promise'], function(Eventable, Promise) {
	var a = [];
	var DataFactory = new Eventable();
	DataFactory = _.extend(DataFactory, {
		init: function() {
			this.models = {

			};
		},
		//entityKey = maps to model/schema name
		//ids = array of ids
		query: function(entityKey, ids) {
			var promise = new Promise(),
				responses = 0,
				target = ids.length,
				data = [];
			
			if(_.isUndefined(window.app.schemas[entityKey])) {
				promise.reject();
				return promise;
			}

			if(!window.app.schemas[entityKey]) {
				promise.reject();
				return promise;
			}

			if(!_.isArray(ids)) { ids = [ids]; }

			//If model store for entityKey doesn't exist, create one
			if(!this.models[entityKey]) {
				this.models[entityKey] = {};
			}

			if(ids.length === 1) {
				$.ajax({
	               	type: 'GET',
	               	url: window.app.baseUrl + window.app.schemas[entityKey].route + ids[0]
	            }).done(function( data ) {
	             	promise.resolve(JSON.parse(data));
	           	}).fail(function () {
	           		promise.reject();
	          	});
			}

			return promise;
		}
	});

	DataFactory.init();
	return DataFactory;
});