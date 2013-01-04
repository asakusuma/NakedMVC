define(['base/collection'],function(Collection){
  return Backbone.View.extend({
    query: {},
    initialize: function() {
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
