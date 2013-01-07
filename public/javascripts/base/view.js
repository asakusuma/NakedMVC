define(['base/collection', 'is-client'],function(Collection, isClient){
  return Backbone.View.extend({
    query: {},
    initialize: function() {
      var action,
        key,
        sout;
      this.controller = this.options.controller || null;
      //Modify events object
      if(isClient === false) this.events = {};
      for(key in this.events) {
        action = this.events[key];
        if(action[0] === '>' || action[0] === '-') {
          sout = key.split(' ',2);

          if(action[0] === '>' && _.isObject(this.controller)) {
            $(this.el).on(sout[0], sout[1], this.controller[action.substring(1,action.length)]);
          } else if(action[0] === '-') {
            $(this.el).on(sout[0], sout[1], (function(eventName, object) {
              return function() {
                var args = [eventName];
                for(var i = 0; i < arguments.length; i++) {
                  args.push(arguments[i]);
                }
                object.trigger.apply(object, args);
              }
            })(action.substring(1,action.length), this));
          }
          delete this.events[key];
        }
      }
      if(this.options.el) this.el = this.options.el;
      this.rendered = this.options.rendered;
      this.data = {};
      _.bindAll(this);
      this.requests = {};
      for(var name in this.queries) {
        this.requests[name] = _.extend({
          query: this.queries[name],
          collection: new Collection()
        }, Backbone.Events);
      }
    },
    getDataRequests: function() {
      return this.requests;
    },
    render: function(err, out) {
      this.rendered = true;
      if(err) throw err;
      if(this.el) {
        this.trigger('rendered', this.el.html());
      }
    },
    remove: function() {
      this.off();
      this.el.empty();
      this.el = null;
    },
    postRender: function() {

    }
  });
});
