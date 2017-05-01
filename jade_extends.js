var express = require('express');
var app = express();
app.set('view engine', 'jade');
app.set('views', './views');

app.get('/view', function(req, res){
  res.render('view');
})
app.get('/add', function(req, res){
  res.render('add');
})
app.listen(9000, function(){
  console.log('Conneted 9000 port');
})
