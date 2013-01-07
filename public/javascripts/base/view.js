define(['base/collection', 'is-client'],function(Collection, isClient){
  return Backbone.View.extend({
    query: {},
    initialize: function() {
      var action,
        key,
        sout,
        args;
      this.controller = this.options.controller || null;
      //Modify events object
      if(isClient === false) this.events = {};
      for(key in this.events) {
        //sout = this.events[key].split(/( (?=[^ ]*$))/);
        action = this.events[key];
        args = action.substring(action.indexOf(' ')+1);
        action = action.substring(0,action.indexOf(' '));
        args = args.split(/\(\) */);
        if(args[args.length-1] == '') args.pop();

        if(action[0] === '>' || action[0] === '-') {
          sout = key.split(' ',2);

          if(action[0] === '>' && _.isObject(this.controller)) {
            $(this.el).on(sout[0], sout[1], this.controller[action.substring(1,action.length)]);
          } else if(action[0] === '-') {
            $(this.el).on(sout[0], sout[1], (function(eventName, object, argSpecs) {
              return function(event) {
                var args = [eventName],
                  i;
                for(i = 0; i < arguments.length; i++) {
                  args.push(arguments[i]);
                }
                for(i = 0; i < argSpecs.length; i++) {
                  args.push($(event.currentTarget).find(argSpecs[i].substring(0, argSpecs[i].lastIndexOf(' ')))[argSpecs[i].substring(argSpecs[i].lastIndexOf(' ')+1)]());
                }
                object.trigger.apply(object, args);
              }
            })(action.substring(1,action.length), this, args));
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
