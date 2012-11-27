define(['base/promise', 'models/model'], function(Promise, Model) { 
function DataProxy(io) { 
this.socket = io.connect('http://localhost:3000');
} 
DataProxy.prototype.modelize = function(data) { 
if(_.isArray(data)) { 
var models = [];
for(var i = 0; i < data.length; i++) { models.push(this.modelize(data[i])); }
return models; 
} else if(_.isObject(data) && data.attributes) {
for(var key in data.attributes) {
data.attributes[key] = this.modelize(data.attributes[key]);} 
return new Model(data.attributes);
} else { return data; } 
}
DataProxy.prototype.init = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'init', arguments: arguments });
this.socket.on('dp_response_init', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
DataProxy.prototype.getNumBoards = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'getNumBoards', arguments: arguments });
this.socket.on('dp_response_getNumBoards', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
DataProxy.prototype.request = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'request', arguments: arguments });
this.socket.on('dp_response_request', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
DataProxy.prototype.on = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'on', arguments: arguments });
this.socket.on('dp_response_on', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
DataProxy.prototype.trigger = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'trigger', arguments: arguments });
this.socket.on('dp_response_trigger', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
DataProxy.prototype.off = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'off', arguments: arguments });
this.socket.on('dp_response_off', _.bind(function(data) { 
promise.resolve(this.modelize(data)); 
}, this));return promise;
} 
return new DataProxy(io); 
});
