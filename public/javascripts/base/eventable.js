define(['jquery'],function($){

  function Eventable() {
    this.proxy = $({});
  }

  Eventable.prototype.on = function() {
    return this.proxy.on.apply( this.proxy, arguments );
  }
  Eventable.prototype.trigger = function(){
    return this.proxy.trigger.apply(this.proxy, arguments);
  },
  Eventable.prototype.off = function(){
    return this.proxy.off.apply( this.proxy, arguments );
  }

  return Eventable;
} );
