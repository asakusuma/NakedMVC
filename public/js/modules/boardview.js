define( 'BoardView', ['Eventable'], function(Eventable) {
	var BoardView = new Eventable();
	BoardView = _.extend(BoardView, {
		queries: [
			'Board'
		],
		init: function(el) {
			this.el = el;
			return this.queries;
		},
		loadData: function(query, data) {
			if(data === null) {
				this.el.html("<h2>Board not found</h2>");
			} else {
				console.log(data);
				this.el.html("<h2>" + data.get('title') + "</h2><h3>By " + data.get('owner') + "</h3>");
			}
		}
	});
	return BoardView;
});