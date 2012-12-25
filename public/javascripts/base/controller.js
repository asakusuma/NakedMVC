define(['lib/underscore','lib/backbone','jquery','dataproxy'],function(_,Backbone,$,DataFactory){
  return Backbone.View.extend({
    initialize: function() {
      this.params = this.options.params;
      this.renderMarkup = this.options.renderMarkup;
      if(this.renderMarkup !== false) this.renderMarkup = true;
      if(_.isFunction(this.options.renderCallback)) {
        this.renderCallback = _.once(this.options.renderCallback);
      }
      if(this.options.el) {
        this.el = this.options.el;
      } else {
        this.el = $('<div></div>');
      }
      this.view = new this.viewClass({
        el: this.el,
        rendered: !this.renderMarkup
      });
      var query = this.view.getQuery();
      this.view.on('rendered', _.bind(this.onRenderMarkupFinished, this));
      this.dataPromise = DataFactory.request(query);

      this.dataPromise.then(function(data) {
        this.view.setData(query, data);
      }, function() {

      }, this);

      this.postInit();
    },
    postInit: function() {

    },
    onRenderMarkupFinished: function(html) {
      //if on the client
      if(typeof window !== 'undefined') {
        this.view.postRender();
      }   
      this.renderCallback(html);
    },
    remove: function() {
      this.dataPromise = null;
      this.off();
      this.el.empty();
      this.el = null;
      this.view.remove();
    }
  });
});
