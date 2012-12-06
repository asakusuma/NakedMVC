define(['base/eventable', 'lib/underscore'], function(Eventable,_){

  	function Model(data, entityKey) {
      Eventable.call(this);
  		this.attributes = data;
  	}

  	Model.prototype.get = function(key) {
      return this.attributes[key];
  	}

  	Model.prototype.set = function(key, value) {
  		this.attributes[key] = value;
      this.trigger('change', this);
      return this;
  	}

	Model.prototype = _.extend({}, Eventable.prototype, Model.prototype);

  	return Model;
});
