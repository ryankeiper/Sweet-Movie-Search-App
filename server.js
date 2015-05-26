var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/movies');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Schema = mongoose.Schema;
var FavoriteSchema = new Schema({
  Year: String,
  Title: String,
  imdbID: String
});

mongoose.model('Favorite', FavoriteSchema);

var Favorite = mongoose.model('Favorite');

app.get('/api/favorites', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  Favorite.find(function(err, docs){
    res.send(docs);
  })
});

app.post('/api/favorites', function(req, res){
  console.log('Received a POST request', req.body);
  for(var key in req.body){
    console.log(key + ": " + req.body[key]);
  }

  res.setHeader('Content-Type', 'application/json');
  var favorite = new Favorite(req.body);
  favorite.save(function(err, doc){
    res.send(doc);
  })
});

app.delete('/api/favorites/:id', function(req, res){
  console.log(req.params);
  console.log("Received a delete request for id", + req.params.id);
  Favorite.remove({_id: req.params.id}, function(err){
    res.send({_id: req.params.id});
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port %d in %s mode", this.address().port, app.settings.env);
});





