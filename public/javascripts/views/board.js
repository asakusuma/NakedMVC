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
			return [
				{
					entityKey: "boards"
				},
				{
					entityKey: "cards"
				}
			];
		},
		setData: function(query, data) {
			if(data && data.attributes) {
				this.data = data;
				this.data.on('change', _.bind(this.dataUpdated,this));
				if(this.rendered && typeof window !== 'undefined') {
					this.postRender();
				} else {
					dust.render("board", data.attributes, _.bind(this.renderCards,this));
				}
			} else if(data && _.isArray(data)) {
				//load cards
				this.loadCardTypeahead(data);
			}
		},
		loadCardTypeahead: function(data) {
			if(this.rendered && typeof window !== 'undefined') {


				/* Typeahead hack */

				  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    e.preventDefault()
    $this.typeahead($this.data())
  })

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
						}
					}
					
				},this));
			}
		},
		dataUpdated: function() {
			var cards = this.data.attributes.cards;

			//Hack for determining if last card is an actual model, or just an id
			if(cards.length > 0 && cards[cards.length - 1].attributes) {
				console.log(cards);
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
			if(this.ul.find('li').length !== cards.length) redraw = true;
			for(var i = 0; i < cards.length; i++) {
  				if(cards[i].attributes) {
  					cards[i].set('row',row);
	  				cards[i].set('col',col);
	  				console.log(row + ', ' + col);
	  				row = (row+1)%3;
	  				if(row === 3) col++;
  				}
  			}
  			if(layout && layout.length === cards.length) {
  				for(var i = 0; i < cards.length; i++) {
  					if(layout[cards[i]] && layout[cards[i]].attributes) {
  						var id = cards[i].get('_id'),
  							cardEl = this.ul.find('[data-card-id="'+id+'"]');
  						if(cardEl.attr('data-row') != layout[id].row || cardEl.attr('data-col') != layout[id].col) {
  							redraw = true;
  						}
  						cards[i].set('row',layout[id].row);
  						cards[i].set('col',layout[id].col);
  					}
  				}
  			}
  			if(redraw) {
  				if(this.gridster.serialize().length !== 0) {
  					this.gridster.remove_all_widgets((function(cards,view) {
						return function() {
							for(var i = 0; i < cards.length; i++) {
		  						view.addCard(cards[i]);
		  					}
						};
					})(cards,this));
  				} else {
  					for(var i = 0; i < cards.length; i++) {
		  				this.addCard(cards[i]);
		  			}
  				}
  				
  			}
		},
		addCard: function(model) {
			console.log("ADD CARD: "+ JSON.stringify(model));
			dust.render("board-card", model.attributes, _.bind(function(err, out) {
				if(err) throw err;
				var el = $(out),
					row = el.attr('data-row'),
					col = el.attr('data-col');
				this.gridster.add_widget(out,1,1,col,row);
			}, this));
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