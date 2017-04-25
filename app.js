var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.locals.pretty = true;
app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine','jade');
app.set('views','./views');//생략가능 views라는 디렉토리가 디폴트

app.get('/form_receiver',function(req,res){
   var title = req.query.title;
   var description = req.query.description;
   res.send(title+','+description);
});
app.post('/form_receiver', function(req,res){
  var title=req.body.title;
  var description = req.body.description;
  res.send(title+','+description);
});
app.get('/topic/:id',function(req, res){
  var topics = [
    'Javascript is...',
    'Nodejs is...',
    'Express is...'
  ];
  var output=`
  <a href="/topic/0">Javascript</a><br>
  <a href="/topic/1">Node js</a><br>
  <a href="/topic/2">Express</a><br><br>
  ${topics[req.params.id]}
  `
  res.send(output);

});

app.get('/form', function(req,res){
  res.render('form');
});
app.get('/template',function(req, res){
  res.render('temp', {time:Date(),_title:'Study!!'});
});
app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>');
});
app.get('/dynamic',function(req, res){
  var lis = '';
  for(var i=0;i<5;i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
  Hello, Dynamic!
  ${lis}
  ${time}
    </body>
  </html>`;
  res.send(output);
});
app.get('/route',function(req,res){
  res.send('Hello Router,<img src="/timberlogo.png">');
});
app.get('/login', function (req, res) {
  res.send('Login Plz');
});
