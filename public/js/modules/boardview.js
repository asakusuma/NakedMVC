define( 'BoardView', ['Eventable'], function(Eventable) {
	var BoardView = new Eventable();
	BoardView = _.extend(BoardView, {
		queries: [
			'Board'
		],
		init: function() {
			return this.queries;
		}
	});
	return BoardView;
});