define( 'DataFactory', ['Eventable', 'Promise'], function(Eventable, Promise) {
	var DataFactory = new Eventable();
	DataFactory = _.extend(DataFactory, {
		init: function() {
			
		},
		//entityKey = maps to model/schema name
		//ids = array of ids
		query: function(entityKey, ids) {
			
		}
	});
	return DataFactory;
});