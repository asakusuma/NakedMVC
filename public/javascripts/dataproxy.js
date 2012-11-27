define(['base/promise', 'models/model'], function(Promise, Model) { 
function DataProxy(io) { 
_.bindAll(this);
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
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_init', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_init', cb);return promise;
} 
DataProxy.prototype.getNumBoards = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'getNumBoards', arguments: arguments });
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_getNumBoards', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_getNumBoards', cb);return promise;
} 
DataProxy.prototype.request = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'request', arguments: arguments });
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_request', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_request', cb);return promise;
} 
DataProxy.prototype.on = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'on', arguments: arguments });
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_on', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_on', cb);return promise;
} 
DataProxy.prototype.trigger = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'trigger', arguments: arguments });
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_trigger', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_trigger', cb);return promise;
} 
DataProxy.prototype.off = function() { 
var promise = new Promise();
this.socket.emit('dp_request', { name: 'off', arguments: arguments });
var cb;cb = _.bind(function(data) { 
this.socket.removeListener('dp_response_off', cb);
promise.resolve(this.modelize(data)); 
}, this);this.socket.on('dp_response_off', cb);return promise;
} 
return new DataProxy(io); 
});
