define(['base/promise'], function(Promise) { 
function DataProxy(io) { this.socket = io.connect('http://localhost:3000');} 
DataProxy.prototype.init = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'init', arguments: arguments });this.socket.on('dp_response_init', function(data) { console.log(data); });return promise;} 
DataProxy.prototype.getNumBoards = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'getNumBoards', arguments: arguments });this.socket.on('dp_response_getNumBoards', function(data) { console.log(data); });return promise;} 
DataProxy.prototype.request = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'request', arguments: arguments });this.socket.on('dp_response_request', function(data) { console.log(data); });return promise;} 
DataProxy.prototype.on = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'on', arguments: arguments });this.socket.on('dp_response_on', function(data) { console.log(data); });return promise;} 
DataProxy.prototype.trigger = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'trigger', arguments: arguments });this.socket.on('dp_response_trigger', function(data) { console.log(data); });return promise;} 
DataProxy.prototype.off = function() { var promise = new Promise();this.socket.emit('dp_request', { name: 'off', arguments: arguments });this.socket.on('dp_response_off', function(data) { console.log(data); });return promise;} 
return new DataProxy(io); 
});