var express = require('express');
var app = express();
app.listen(9000, function(){
  console.log('Connected 9000 port!!!');
});
app.locals.pretty = true;
