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
      //Flag to determine if post render is in process
      this.isPostRendering = false;
      //Flag to determine whether or not to re-postRender when postRender completes
      //Used when data is changed while in the middel of postRendering
      this.refreshOnPostRender = false;
      //Bind callback for when postRender completes
      this.on('postRendered', _.bind(this.onPostRender));
			return [
        {
          //Board to display
					entityKey: "boards"
				}, {
          //Cards to populate typeahead for adding new cards
          //to the board
					entityKey: "cards"
				}
      ];
		},
		setData: function(query, data) {
			if(data && data.attributes) {
        //Board Model
				this.data = data;
        //Register event for handling updates
				this.data.on('change', _.bind(this.dataUpdated,this));
				if(this.rendered && typeof window !== 'undefined') {
          //If markup has already been rendered and we're on the client
					this.postRender();
				} else {
          //If we need to render markup
					dust.render("board", data.attributes, _.bind(this.renderCards,this));
				}
			} else if(data && _.isArray(data)) {
				//Array of cards
				this.loadCardTypeahead(data);
			}
		},
		loadCardTypeahead: function(data) {
			if(this.rendered && typeof window !== 'undefined') {

				/* Typeahead hack */
        //Quick fix to avoid the hassle of AMDifying Bootstrap JS plugins
        var Typeahead=function(e,t){this.$element=$(e);this.options=$.extend({},$.fn.typeahead.defaults,t);this.matcher=this.options.matcher||this.matcher;this.sorter=this.options.sorter||this.sorter;this.highlighter=this.options.highlighter||this.highlighter;this.updater=this.options.updater||this.updater;this.$menu=$(this.options.menu).appendTo("body");this.source=this.options.source;this.shown=false;this.listen()};Typeahead.prototype={constructor:Typeahead,select:function(){var e=this.$menu.find(".active").attr("data-value");this.$element.val(this.updater(e)).change();return this.hide()},updater:function(e){return e},show:function(){var e=$.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});this.$menu.css({top:e.top+e.height,left:e.left});this.$menu.show();this.shown=true;return this},hide:function(){this.$menu.hide();this.shown=false;return this},lookup:function(e){var t;this.query=this.$element.val();if(!this.query||this.query.length<this.options.minLength){return this.shown?this.hide():this}t=$.isFunction(this.source)?this.source(this.query,$.proxy(this.process,this)):this.source;return t?this.process(t):this},process:function(e){var t=this;e=$.grep(e,function(e){return t.matcher(e)});e=this.sorter(e);if(!e.length){return this.shown?this.hide():this}return this.render(e.slice(0,this.options.items)).show()},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift()){if(!i.toLowerCase().indexOf(this.query.toLowerCase()))t.push(i);else if(~i.indexOf(this.query))n.push(i);else r.push(i)}return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(e){var t=this;e=$(e).map(function(e,n){e=$(t.options.item).attr("data-value",n);e.find("a").html(t.highlighter(n));return e[0]});e.first().addClass("active");this.$menu.html(e);return this},next:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.next();if(!n.length){n=$(this.$menu.find("li")[0])}n.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();if(!n.length){n=this.$menu.find("li").last()}n.addClass("active")},listen:function(){this.$element.on("blur",$.proxy(this.blur,this)).on("keypress",$.proxy(this.keypress,this)).on("keyup",$.proxy(this.keyup,this));if(this.eventSupported("keydown")){this.$element.on("keydown",$.proxy(this.keydown,this))}this.$menu.on("click",$.proxy(this.click,this)).on("mouseenter","li",$.proxy(this.mouseenter,this))},eventSupported:function(e){var t=e in this.$element;if(!t){this.$element.setAttribute(e,"return;");t=typeof this.$element[e]==="function"}return t},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault();this.prev();break;case 40:e.preventDefault();this.next();break}e.stopPropagation()},keydown:function(e){this.suppressKeyPressRepeat=!~$.inArray(e.keyCode,[40,38,9,13,27]);this.move(e)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation();e.preventDefault()},blur:function(e){var t=this;setTimeout(function(){t.hide()},150)},click:function(e){e.stopPropagation();e.preventDefault();this.select()},mouseenter:function(e){this.$menu.find(".active").removeClass("active");$(e.currentTarget).addClass("active")}};$.fn.typeahead=function(e){return this.each(function(){var t=$(this),n=t.data("typeahead"),r=typeof e=="object"&&e;if(!n)t.data("typeahead",n=new Typeahead(this,r));if(typeof e=="string")n[e]()})};$.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1};$.fn.typeahead.Constructor=Typeahead;$(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(e){var t=$(this);if(t.data("typeahead"))return;e.preventDefault();t.typeahead(t.data())})
				/* End typeahead hack */

				$('#add-card-input').typeahead({
					source: _.map(data, function(model) {
						return model.value.title;
					})
				});
				this.cards = data;

				$('#add-card-input').keyup(_.bind(function(event) {
					var code = (event.keyCode ? event.keyCode : event.which);
					if(code == 13) { 
						var id = null;
						for(var i = 0; i < this.cards.length; i++) {
							if(this.cards[i].value.title === $('#add-card-input').val()) {
								id = this.cards[i].id;
							}
						}
						if(id) {
							this.trigger('cardAdded', id);
							$('#add-card-input').val("");
						}
					}
				},this));
			}
		},
    onPostRender: function() {
      //When postRender completes, check to see if any data has been updated since
      //if so, postRender again
      this.isPostRendering = false;
      if(this.refreshOnPostRender) {
        this.refreshOnPostRender = false;
        this.dataUpdated();
      }
    },
		dataUpdated: function() {
      if(!this.isPostRendering) {
        this.isPostRendering = true;
        this.updateBoard();
      } else {
        this.refreshOnPostRender = true;
      }
		},
    updateBoard: function() {
      var cards = this.data.attributes.cards;
      //Hack for determining if last card is an actual model, or just an id
      if(cards.length > 0 && cards[cards.length - 1].attributes) {
        if(this.el) this.updateCards();
      }
    },
		setDataError: function(query) {
			this.el.html("<h1>Fatal Data Error</h1>");
			this.trigger('rendered', this.el.html());
		},
		updateCards: function() {
			this.ul = this.el.find('ul');
			var cards = this.data.attributes.cards,
				row = 1,
				col = 1,
				layout = this.data.get('layout'),
				redraw = false;

			if(this.numCards !== cards.length) redraw = true;
			this.numCards = cards.length;
      var functions = [];

			for(var i = 0; i < cards.length; i++) {
        //Set default layout info
				if(cards[i].attributes) {
					cards[i].set('row',row);
  				cards[i].set('col',col);
  				row = (row+1)%3;
  				if(row === 3) col++;
				}
        //Create card render function
        functions.push((function(model, context) {
          return function(callback) {
            dust.render("board-card", model.attributes, _.bind(function(err, out) {
              if(err) throw err;
              var el = $(out),
                row = el.attr('data-row'),
                col = el.attr('data-col');
              this.gridster.add_widget(out,1,1,col,row);

              //Async parallel callback
              callback(null, true);
            }, context));
          }
        })(cards[i], this));
			}
      //If board has a set layout for cards, inject layout info card models
			if(layout) {
				for(var i = 0; i < cards.length; i++) {
					if(layout[cards[i].attributes._id]) {
						var id = cards[i].get('_id'),
							cardEl = this.ul.find('[data-card-id="'+id+'"]');
						if(cardEl.attr('data-row') != layout[id].row || cardEl.attr('data-col') != layout[id].col) {
							redraw = true;
						}
						cards[i].set('row',layout[id].row);
						cards[i].set('col',layout[id].col);
            console.log(layout[id].row + ' - ' + layout[id].col);
					}
				}
			}
      if(this.gridster.serialize().length !== 0) {
        //If cards exist, remove them first before re-drawing
        this.gridster.remove_all_widgets(_.bind((function(cards,view) {
          return _.once(function() {
            view.ul.html("");
            async.parallel(functions, _.bind(function(err, results) {
              this.trigger('postRendered');
            }, this));
          });
        })(cards,this), this));
      } else {
        //No cards exist. Just render cards
        async.parallel(functions, _.bind(function(err, results) {
          this.trigger('postRendered');
        }, this));
      }
		},
		renderCards: function(err, out) {
			if(err) throw err;
			this.ul = this.el.find('ul');
			this.ul.empty();
			var cards = this.data.get('cards'),
				row = 1,
				col = 1,
				layout = this.data.get('layout');
  			this.el.append(out);
  			if(!cards) {
  				this.render();
  			} else {
  				for(var i = 0; i < cards.length; i++) {
	  				cards[i].set('row',col);
	  				cards[i].set('col',row);
	  				row = (row+1)%3;
	  				if(row === 3) col++;
	  			}
	  			if(layout) {
	  				for(var i = 0; i < cards.length; i++) {
	  					if(layout[cards[i].get('_id')]) {
	  						cards[i].set('row',layout[cards[i].get('_id')].row);
	  						cards[i].set('col',layout[cards[i].get('_id')].col);
	  					}
	  				}
	  			}
	  			async.map(cards, function(item, callback) {
	  				dust.render("board-card", item.attributes, function(err, out) {
	  					if(err) throw err;
	  					callback(null, out);
	  				});
	  			}, _.bind(function(error, results) {
	  				var html = "";
	  				for(var i = 0; i < results.length; i++) {
	  					html += results[i];
	  				}
	  				this.ul = this.el.find('ul');
	  				this.ul.append(html);
	  				this.render();
	  			},this));
  			}
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
	    			widget_base_dimensions: [360,360],
	    			draggable: {
		                stop: _.bind(this.cardDragged,this)
		            }
				}).data('gridster');
			}, this));
		},
    //Save layout when cards are dragged
		cardDragged: function() {
			var cards = this.data.get('cards'),
				layout = {};
			for(var i = 0; i < cards.length; i++) {
				var cardEl = $('li[data-card-id="' + cards[i].get('_id') + '"]');
				layout[cards[i].get('_id')] = {
					col: cardEl.attr('data-col'),
					row: cardEl.attr('data-row')
				};
			}
			this.data.set('layout', layout);
		},
		remove: function() {
			this.off();
			this.el.empty();
			this.el = null;
		}
	});
	return BoardView;
});