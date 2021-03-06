var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'sdjklf2381f&^%#12d',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host: '220.94.71.218',
    port: 5200,
    user: 'b1123d',
    password: 'Timber2012',
    database: 'timber'
  })
  //cookie: { secure: true }
}));
app.get('/count', function(req,res){
  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});
app.get('/welcome',function(req,res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  }else{
    res.send(`
      <h1>Welcome, stranger</h1>
      <a href="/auth/login">Login</a>
    `);
  }
  //res.send(req.session);
});
app.get('/auth/logout', function(req,res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  })
});
app.get('/auth/login', function(req,res){
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;
  res.send(output);
});
app.post('/auth/login', function(req,res){
  var user = {
    username:'jhjeong',
    password:'111',
    displayName:'Jihoon'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(user.username == uname && user.password == pwd)
  {
    req.session.displayName = user.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    })
  }
  else{
    res.send('Failed!!<a href="/auth/login">login</a>');
  }
});
app.listen(9000, function(){
  console.log('Connected 9000 port!!!');
});
app.locals.pretty = true;
