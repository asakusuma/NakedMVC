define(['base/eventable', 'lib/underscore', 'dustjs-linkedin'],function (Eventable, _, dust) {
	var IndexView = function() {};
	IndexView.prototype = new Eventable();
	_.extend(IndexView.prototype, {
		build: function(el) {
			this.el = el;
			this.data = {};
			return {
				entityKey: "boards"
			};
		},
		setData: function(query, data) {
			this.data[query] = JSON.stringify(data);
			data = {boards: data};
			dust.render("index", data, _.bind(this.render,this));
		},
		render: function(err, out) {
			if(err) throw err;
  			this.el.append(out);
			this.trigger('rendered', this.el.html());
		},
		postRender: function() {
			//nothing for now
		}
	});
	return IndexView;
});