var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app); // 함수요청
app.use('/p1', p1);

var p2 = require('./routes/p2'); //라우터 요청
app.use('/p2', p2);

app.listen(9000,function(){
  console.log('connected');
})
