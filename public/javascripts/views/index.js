define(['lib/underscore', 'dustjs-linkedin', 'base/view'],function (_,dust,BaseView) {
	return BaseView.extend({
		query: {
        	entityKey: 'boards'
      	},
		setData: function(query, data) {
			if(_.isArray(data)) {
				//List of boards
				this.data = data;
				data = {boards: data};
				if(this.rendered && typeof window !== 'undefined') {
					this.postRender();
				} else {
					dust.render('index', data, _.bind(this.render, this));
				}
			} else if(data.attributes) {
				//A new board
				this.data.push({
					id: data.attributes._id,
					key: data.attributes._id,
					value: data.attributes
				});
				dust.render('index', {boards: this.data}, _.bind(this.render, this));
			}
		},
		onNewBoardButtonClicked: function(event) {
			this.trigger('boardCreated', {
				title: $('#new-board-name').val()
			});
		},
		postRender: function() {
			$('#new-board-button').click(_.bind(this.onNewBoardButtonClicked, this));
		}
	});
});