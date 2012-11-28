define(['base/promise', 'models/model'], function(Promise, Model) { 
function DataProxy(io) { 
_.bindAll(this);
this.models = {};
this.socket = io.connect('http://localhost:3000');
this.socket.on('models_changed', _.bind(this.serverModelsChanged,this));} 
DataProxy.prototype.serverModelsChanged = function(data) {  
	console.log(data);
if(data.attributes._id) { 
if(this.models[data.attributes._id]) { 
var changedModel = this.modelize(data.attributes); 
_.extend(this.models[data.attributes._id].attributes, changedModel.attributes); 
this.models[data.attributes._id].trigger('change'); 
} else { 
//new model 
} 
} 
} 
DataProxy.prototype.modelChanged = function(event, data) { 
this.update(data);
}
DataProxy.prototype.modelize = function(data) { 
if(_.isArray(data)) { 
var models = [];
for(var i = 0; i < data.length; i++) { models.push(this.modelize(data[i])); }
return models; 
} else if(_.isObject(data) && data.attributes) {
for(var key in data.attributes) {
data.attributes[key] = this.modelize(data.attributes[key]);
} 
var model;
if(this.models[data.attributes._id]) {
model = this.models[data.attributes._id]
 } else { 
model = new Model(data.attributes);
model.on('change', _.bind(this.modelChanged, this));
this.models[data.attributes._id] = model;
 }return model;
} else { return data; } 
}
DataProxy.prototype.off = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'off', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.on = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'on', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.trigger = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'trigger', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.init = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'init', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.getNumBoards = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'getNumBoards', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.update = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'update', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.updateBoard = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'updateBoard', arguments: arguments }, cb);
return promise;
} 
DataProxy.prototype.request = function() { 
var promise = new Promise();
var cb = _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this);this.socket.emit('dp_request', { name: 'request', arguments: arguments }, cb);
return promise;
} 
return new DataProxy(io); 
});
