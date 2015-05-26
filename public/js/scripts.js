Backbone.Model.prototype.idAttribute = '_id';

// Backbone Models

var MovieResult = Backbone.Model.extend({
	defaults: {
		Year: '',
		Title: '',
	}
});

var Favorite = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/api/favorites',
	defaults: {
		Year: '',
		Title: '',
		imdbID: ''
	}
});

var Feature = Backbone.Model.extend({
	defaults: {
		Year: '',
		Title: '',
		Rated: '',
		Runtime: '',
		Actors: '',
		Director: '',
		Plot: '',
		Poster: ''
	}
})

// Backbone Collections

var MovieResults = Backbone.Collection.extend({

});

var Favorites = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/favorites'
});

// Backbone Views

var ResultView = Backbone.View.extend({
	model: new MovieResult(),
	tagName: 'tr',
	events: {
		"click .title": "clicked",
		"click .favorite-button": "favorited"
	},
	// Loads a single movie to feature and scrolls to it on the page
	clicked: function(){
		$.ajax({
			url: "http://www.omdbapi.com/?i=" + this.model.toJSON().imdbID + "&plot=full&r=json",
			method: "GET",
			dataType: "JSON",
			success: function(data){
				var feature = new Feature({
					Year: data.Year,
					Title: data.Title,
					Rated: data.Rated,
					Runtime: data.Runtime,
					Actors: data.Actors,
					Director: data.Director,
					Plot: data.Plot,
					Poster: data.Poster
				});
				var featureView = new FeatureView({model: feature});
				featureView.render();
				$(document.body).animate({
				    'scrollTop':   $('.featured').offset().top
				}, 500);
			}
		});
	},
	// Creates a new favorite from the search response item and adds it to the favorites list
	favorited: function(){
		var favorite = new Favorite({
			Year: this.model.toJSON().Year,
			Title: this.model.toJSON().Title,
			imdbID: this.model.toJSON().imdbID
		});
		$('.favorites-list').append(new FavoriteView({model: favorite}).render().el);
		var favorites = new Favorites();
		favorites.add(favorite);
		favorite.save(null, {
			success: function(response){
				console.log("Successfully favorited blog with id", response.toJSON().imdbID);
			},
			error: function(){
				console.log("Failed to favorite.");
			}
		})
	},
	// Sets up template for building this view
	initialize: function(){
		this.template = _.template($('.movie-result-template').html());
		console.log(this.model.toJSON());
	},
	// Uses the template to build out this view
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var ResultsView = Backbone.View.extend({
	model: new MovieResults(),
	el: $('.results-list'),
	initialize: function(){

	},
	// Takes an array of search results and builds out the ResultsView
	render: function(){
		var that = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(movieResult){
			that.$el.append(new ResultView({model: movieResult}).render().el);
		});
	},
	// Searches OMDB based on user input and displays the results
	search: function(){
		if($('.search-field').val()){
			var searchTerms = $('.search-field').val();
			$.ajax({
				url: "http://www.omdbapi.com/?s=" + searchTerms + "&y=&plot=full&r=json",
				method: "GET",
				dataType: "JSON",
				success: function(data){
					var resultsArray = [];
					_.each(data.Search, function(datum){
						resultsArray.push(new MovieResult(datum));
					});
					var results = new MovieResults(resultsArray);
					new ResultsView({model: results}).render();
				}
			})
		}
	}
});

var FavoriteView = Backbone.View.extend({
	model: new Favorite(),
	tagName: 'tr',
	events: {
		"click .title": "clicked",
		"click .remove-button": "remove"
	},
	// Loads a single movie to feature and scrolls to it on the page
	clicked: function(){
		$.ajax({
			url: "http://www.omdbapi.com/?i=" + this.model.toJSON().imdbID + "&plot=full&r=json",
			method: "GET",
			dataType: "JSONP",
			success: function(data){
				var feature = new Feature({
					Year: data.Year,
					Title: data.Title,
					Rated: data.Rated,
					Runtime: data.Runtime,
					Actors: data.Actors,
					Director: data.Director,
					Plot: data.Plot,
					Poster: data.Poster
				});
				var featureView = new FeatureView({model: feature});
				featureView.render();
				$(document.body).animate({
				    'scrollTop':   $('.featured').offset().top
				}, 1000);
			}
		});
	},
	// Removes a favorite from the favorites list
	remove: function(){
		this.$el.remove();
		this.model.destroy({
			success: function(response){
				console.log("Successfully deleted favorite with id", response.toJSON()._id);
			}
		});
	},
	// Sets up template for building this view
	initialize: function(){
		console.log(this.model.toJSON());
		this.model.template = _.template($('.favorite-template').html());
	},
	// Uses the template to build out this view
	render: function(){
		this.$el.html(this.model.template(this.model));
		return this;
	}
});

var FavoritesView = Backbone.View.extend({
	model: new Favorites(),
	el: $('.favorites-list'),
	// Requests all current favorites from the database and displays them in the favorites list
	initialize: function(){
		var that = this;
		this.model.fetch({
			success: function(response){
				_.each(response.toJSON(), function(item){
					var fav = new Favorite({
						Year: item.Year,
						Title: item.Title,
						imdbID: item.imdbID,
						_id: item._id
					});
					that.$el.append(new FavoriteView({model: fav}).render().el);
					that.model.add(item);
				})
			}
		});
	},
	// Checks the database for all current favorites and renders them to the favorites list
	render: function(){
		var that = this;
		this.$el.html('');
		this.model.fetch({
			success: function(response){
				_.each(response.toJSON(), function(item){
					var fav = new Favorite({
						Year: item.Year,
						Title: item.Title,
						imdbID: item.imdbID,
						_id: item._id
					});
					that.$el.append(new FavoriteView({model: fav}).render().el);
					that.model.add(item);
				})
			}
		});
	}
});

var FeatureView = Backbone.View.extend({
	model: new Feature(),
	// Sets up template for building this view
	initialize: function(){
		this.model.template = _.template($('.feature-template').html());
	},
	// Uses the template to build out this view
	render: function(){
		$('.featured').html('');
		$('.featured').append(this.$el.html(this.model.template(this.model)));
		return this;
	}

})

$(document).ready(function(){
	$('.search-movies').on('submit', function(event){
		event.preventDefault();
		new ResultsView().search();
		$('.search-field').val('');
		console.log('Success!');
	});
	var favoritesView = new FavoritesView();
})