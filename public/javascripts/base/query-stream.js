define(['lib/underscore', 'dataproxy-utility', 'base/collection'],function(_, Utility, Collection){

  function QueryStream(request) {
    this.callbacks = [],
    this.context = {},
    this.resultArguments = null;
    this.result = new Collection();
    this.mapReduceFunc = Utility.buildMapReduceFunction(request, this.update, this);
    this.query = request.arguments[0];
    _.bindAll(this);
  }


  QueryStream.prototype.then = function(callback, context) {
    if(this.resultArguments) {
      callback.apply(this.context,this.resultArguments);
    }
    this.callbacks.push(callback);
    if(context) {
      this.context = context;
    }
  }

  QueryStream.prototype.getCollection = function getCollection() {
    return this.result;
  }

  QueryStream.prototype.resolve = function() {
    this.resultArguments = arguments;
    this.result = this.resultArguments[0];

    for(var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i].call(this.context,this.result);
    }
  }

  QueryStream.prototype.update = function(data) {
    console.log('Update me');
    if(this.result) {
      this.result.add(data);
      console.log(this.result);
    }
  }

  QueryStream.prototype.notify = function(model) {
    console.log('Notify you');
    this.mapReduceFunc(model,this.query);
  }
  
  return QueryStream;
});