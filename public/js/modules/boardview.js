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
			} else if(query === 'Board') {
				this.loadMainBoard(data);
			}
		},
		loadMainBoard: function(data) {
			this.board = data;
			console.log(data);
			dust.render("board", this.board.attributes, _.bind(this.renderBoard, this));
		},
		populateBoard: function() {
			for(var i = 0; i < this.board.get('cards').length; i++) {
				dust.render("card", this.board.get('cards')[i], _.bind(this.renderCard, this));
		    }
		},
		renderCard: function(err, out) {
			this.grid.add_widget(out, 2, 2);
		},
		renderBoard: function(err, out) {
			out = $(out);
  			this.renderEl(err, out);
  			this.grid = out.find('ul').gridster({
		        widget_margins: [10, 10],
		        widget_base_dimensions: [140, 140]
		    }).data('gridster');
		    this.populateBoard();
		},
		renderEl: function(err, out) {
  			this.el.html(out);
		}
	});
	return BoardView;
});