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
			var promise = new Promise();
			
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

			$.ajax({
               	type: 'GET',
               	url: window.app.baseUrl + window.app.schemas[entityKey]
            }).done(function( data ) {
             	promise.resolve(JSON.parse(data));
           	}).fail(function () {

          	});

			return promise;
		}
	});
	return DataFactory;
});