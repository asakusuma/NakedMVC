define( 'Promise', function(){

  function Promise() {
    this.success = function() {},
    this.failure = function() {},
    this.context = {},
    this.registered = false,
    // 0 = waiting
    // 1 = resolved
    // 2 = failed
    this.status = 0;
  }

  Promise.prototype.then = function(successCallback, failureCallback, con) {
    this.success = _.once(successCallback);
    this.failure = _.once(failureCallback);
    this.registered = true;
    if(con) { this.context = con; }
    if(this.status === 1) { this.resolve(); }
    if(this.status === 2) { this.reject(); }
  }

  Promise.prototype.resolve = function() {
    if(this.registered) {
      this.status = 1;
      this.success.apply(this.context,arguments);
    }
  }

  Promise.prototype.reject = function() {
    if(this.registered) {
      this.status = 2;
      this.failure.apply(this.context,arguments);
    }
  }
  
  return Promise;
});