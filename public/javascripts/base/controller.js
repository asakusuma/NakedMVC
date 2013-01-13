define(['lib/underscore','lib/backbone','jquery','dataproxy','is-client'],
  function(_,Backbone,$,DataFactory, isClient){
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
        controller: this,
        rendered: !this.renderMarkup
      });
      var requests = this.view.getDataRequests();
      this.view.on('rendered', _.bind(this.onRenderMarkupFinished, this));
      for(var i in requests) {
        (function(request) {
          var promise = DataFactory.read(request.query);
          promise.then(function(data) {
            request.collection = data;
            request.trigger('resolved');
          });
        })(requests[i]);
      }

      /*
      this.dataPromise = DataFactory.request(query);

      this.dataPromise.then(function(data) {
        this.view.setData(query, data);
      }, function() {

      }, this);
      */

      if(isClient) {
        this.clientInit();
      } else {
        this.serverInit();
      }
    },
    clientInit: function() {},
    serverInit: function() {},
    onRenderMarkupFinished: function(html) {
      //if on the client
      if(isClient) {
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
