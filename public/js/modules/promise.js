define( 'Promise', function(){

  function Promise() {
    this.success = function() {},
    this.failure = function() {},
    this.context = {};
  }

  Promise.prototype.then = function(successCallback, failureCallback, con) {
    this.success = successCallback;
    this.failure = failureCallback;
    if(con) {
      this.context = con;
    }
  }

  Promise.prototype.resolve = function() {
    this.success.apply(this.context,arguments);
  }

  Promise.prototype.reject = function() {
    this.failure.apply(this.context,arguments);
  }
  
  return Promise;
});