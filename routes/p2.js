var express = require('express');
var route = express.Router();

route.get('/r1', function(req, res){
  res.send('hello /p2/r1');
});
route.get('/r2', function(req, res){
  res.send('hello /p2/r1');
});
module.exports = route;
