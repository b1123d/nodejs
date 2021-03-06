var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var conn = mysql.createConnection({
  host     : '220.94.71.218',
  user     : 'b1123d',
  password : 'Timber2012',
  database : 'timber',
  port : '5200'
});
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
conn.connect();

app.get('/welcome',function(req,res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  }else{
    res.send(`
      <h1>Welcome, stranger</h1>
      <p>
      <a href="/auth/login">Login</a>
      </p>
      <p>
      <a href="/auth/register">register</a>
      </p>
    `);
  }
  //res.send(req.session);
});
app.get('/auth/register',function(req,res){
  var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="authId" placeholder="ID">
      </p>
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="text" name="email" placeholder="email">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;
  res.send(output);
});
app.post('/auth/register',function(req,res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var sql = `
    INSERT INTO user(authId,username,password,salt,displayName,email)
    VALUES('${req.body.authId}','${req.body.username}','${hash}','${salt}','${req.body.displayName}','${req.body.email}')
    `;
    conn.query(sql, function(err,rows,fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        console.log(rows);
        res.redirect('/auth/login');
      }
    });
  });
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
  var sql = `
  SELECT authId, password, salt, displayName
  from user
  where authId = '${req.body.username}'
  `;
  conn.query(sql, function(err,rows,fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      if(!rows[0]){
        res.send('등록되지 않은 ID입니다. <a href="/auth/login">login</a>');
      }
      else {
        return hasher({password:req.body.password, salt:rows[0].salt},function(err,pass,salt,hash){
          if(hash == rows[0].password){
            req.session.displayName = rows[0].displayName;
            req.session.save(function(){
              res.redirect('/welcome');
            })
          } else{
              res.send('Who are you? <a href="/auth/login">login</a>');
          }
        });
      }
    }
  });



});
app.get('/auth/logout', function(req,res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  })
});

app.get('/count', function(req,res){
  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});
app.listen(9000, function(){
  console.log('Connected 9000 port!!!');
});
app.locals.pretty = true;
