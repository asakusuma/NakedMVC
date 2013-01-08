define(['lib/underscore'],function(_){

  function Promise() {
    this.success = [],
    this.failure = [],
    this.context = {},
    this.registered = false,
    // 0 = waiting
    // 1 = resolved
    // 2 = failed
    this.status = 0,
    this.resolveArgs = false,
    this.rejectArgs = false;
    _.bindAll(this);
  }

  Promise.prototype.onSuccess = function(callback) {
    if(this.success.length == 0) {
      this.success.push(function() {});
    }
    this.success.push(callback);
  }

  Promise.prototype.then = function(successCallback, failureCallback, con) {
    if(successCallback) this.success[0] = successCallback;
    if(failureCallback) this.failure[0] = failureCallback;
    this.registered = true;
    if(con) { this.context = con; }
    if(this.status === 1) { this.resolve(this.resolveArgs); }
    if(this.status === 2) { this.reject(); }
  }

  Promise.prototype.resolve = function() {
    this.status = 1;
    if(this.resolveArgs === false) {
      this.resolveArgs = arguments;
    }
    if(this.registered) {
      for(var i = 0; i < this.success.length; i++) {
        this.success[i].apply(this.context,this.resolveArgs);
      }
    }
  }

  Promise.prototype.update = function() {
    if(this.registered) {
      for(var i = 0; i < this.success.length; i++) {
        this.success[i].apply(this.context,arguments);
      }
    }
  }

  Promise.prototype.reject = function(error) {
    this.status = 2;
    if(this.rejectArgs === false) {
      this.rejectArgs = arguments;
    }
    if(this.registered) {
      if(error) {
        console.log(error);
      }
      for(var i = 0; i < this.failure.length; i++) {
        this.failure[i].apply(this.context,arguments);
      }
    }
  }

  Promise.prototype.kill = function() {
    this.registered = false;
  }
  
  return Promise;
});