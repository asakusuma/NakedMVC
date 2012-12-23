define(['lib/backbone'],function(Backbone){
  return Backbone.View.extend({
    query: {},
    initialize: function() {
      if(this.options.el) this.el = this.options.el;
      this.rendered = this.options.rendered;
      this.data = {};
      _.bindAll(this);
    },
    getQuery: function() {
      return this.query;
    },
    render: function(err, out) {
      this.rendered = true;
      if(err) throw err;
      if(this.el) {
        this.el.empty();
        this.el.append(out);
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
