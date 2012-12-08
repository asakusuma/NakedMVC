define(['base/eventable', 'lib/underscore'], function(Eventable,_){

	function Model(data, entityKey) {
    Eventable.call(this);
		this.attributes = data;
	}

  Model.prototype.isModel = function() {
    return true;
  }

	Model.prototype.get = function(key) {
    return this.attributes[key];
	}

	Model.prototype.set = function(key, value) {
		this.attributes[key] = value;
    this.trigger('change', this);
    return this;
	}

  //ID of the client that created the latest change
  Model.prototype.setOriginID = function(originID) {
    this.attributes.originID = originID;
  }

  Model.prototype.getOriginID = function() {
    return this.attributes.originID;
  }

	Model.prototype = _.extend({}, Eventable.prototype, Model.prototype);

  return Model;
});
