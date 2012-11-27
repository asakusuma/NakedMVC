define([
	'base/eventable', 
	'lib/underscore', 
	'dustjs-linkedin', 
	'async', 
	'lib/gridster'],function (
		Eventable, 
		_, 
		dust, 
		async, 
		gridster
	) {
	var BoardView = function() {
		this.data = {};
		_.bindAll(this,"postRender");
	};
	BoardView.prototype = new Eventable();
	_.extend(BoardView.prototype, {
		build: function(el, rendered) {
			this.rendered = rendered;
			this.el = el;
			this.data = {};
			_.bindAll(this);
			return {
				entityKey: "boards"
			};
		},
		setData: function(query, data) {
			console.log("board view render");
			this.data = data;
			if(this.rendered && typeof window !== 'undefined') {
				this.postRender();
			} else {
				dust.render("board", data.attributes, _.bind(this.renderCards,this));
			}
		},
		setDataError: function(query) {
			this.el.html("<h1>Fatal Data Error</h1>");
			this.trigger('rendered', this.el.html());
		},
		renderCards: function(err, out) {
			if(err) throw err;
			var cards = this.data.get('cards'),
				row = 1,
				col = 1;
  			this.el.append(out);
  			for(var i = 0; i < cards.length; i++) {
  				cards[i].set('row',col);
  				cards[i].set('col',row);
  				row = (row+1)%3;
  				if(row === 3) col++;
  			}
  			async.map(cards, function(item, callback) {
  				dust.render("board-card", item.attributes, function(err, out) {
  					if(err) throw err;
  					callback(null, out);
  				});
  			}, _.bind(function(error, results) {
  				var html = "";
  				this.ul = this.el.find('ul');
  				console.log(results);
  				for(var i = 0; i < results.length; i++) {
  					html += results[i];
  				}
  				this.ul.append(html);
  				this.render();
  			},this));
		},
		render: function() {
			this.rendered = true;
			this.trigger('rendered', this.el.html());
		},
		postRender: function() {
			var ul = this.el.find('.gridster ul');	
			$(_.bind(function(){
				this.gridster = ul.gridster({
	    			widget_margins: [10, 10],
	    			widget_base_dimensions: [240,240],
	    			draggable: {
		                stop: _.bind(this.cardDragged,this)
		            }
				}).data('gridster');
			}, this));
		},
		cardDragged: function() {
			var cards = this.data.get('cards');
			for(var i = 0; i < cards.length; i++) {
				var cardEl = $('li[data-card-id="' + cards[i].get('_id') + '"]');
				alert(cardEl.attr('data-col') + " - " + cardEl.attr('data-row'));
			}
		},
		remove: function() {
			this.off();
			this.el.empty();
			this.el = null;
		}
	});
	return BoardView;
});