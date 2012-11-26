define(['base/eventable', 'underscore'], function(Eventable,_){

  	function Model(data, entityKey) {
  		this.attributes = data;
  	}

  	Model.prototype.get = function(key) {
  		return this.attributes[key];
  	}

  	Model.prototype.set = function(key, value) {
  		return this.attributes[key] = value;
  	}

	Model.prototype = _.extend({}, Eventable.prototype, Model.prototype);

  	return Model;
});
