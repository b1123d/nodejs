var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function(req,file,cb){
    // if(파일의 형식이 이미지면)
    //   cb(null, 'uploads/images');
    cb(null, './uploads')
  },
  filename: function(req, file, cb){
    // if(파일이름이 이미 존재한다면,,,)
    //   cb(null, file.originalname에 무엇을 추가한다.)
    cb(null,file.originalname)
  }
})
var upload = multer({storage: _storage})
var fs = require('fs');
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : '220.94.71.218',
  user     : 'b1123d',
  password : 'Timber2012',
  database : 'timber',
  port : '5200'
});
conn.connect();
var app = express();
app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: false}));
app.set('views','./views_mysql');
app.set('view engine','jade');
app.listen(9000,function(){
  console.log('Conneted to 9000!');
});
app.get('/upload',function(req,res){
  res.render('upload')
});
app.post('/upload',upload.single('userfile'),function(req,res){
  console.log(req.file);
  res.send('Uploaded : '+ req.file.filename);
});
app.get('/topic/add',function(req,res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql,function(err,topics,fields){
    if(err){
       console.log(err);
       res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics:topics});
  });
  // fs.readdir('data',function(err,files){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  // res.render('add', {topics:files});
  // });
});
app.post('/topic/add',function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic(title, description, author) VALUES(?,?,?)';
  var params = [title,description,author];
  conn.query(sql,params,function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.redirect('/topic/'+rows.insertId);
    }
  });
  //conn.end();
  // fs.writeFile('./data/'+title,description,function(err){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   res.redirect('/topic/'+title);
  // });
});
app.get('/topic/:id/edit',function(req,res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql,function(err,topics,fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql,[id], function(err, topic, fields){
        if(err){
          console.log('err');
          res.status(500).send('Internal Server Error');
        }else{
          console.log(topic[0]);
          res.render('edit',{topics:topics, topic:topic[0]});
        }
      });
    }else{
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
})
app.post('/topic/:id/edit',function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title = ?, description = ?, author = ? WHERE id = ?';
  var params = [title,description,author,id];
  conn.query(sql,params,function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.redirect('/topic/'+id);
    }
  });
  //conn.end();
  // fs.writeFile('./data/'+title,description,function(err){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   res.redirect('/topic/'+title);
  // });
});
app.get('/topic/:id/delete',function(req,res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql,function(err,topics,fields){
    var id = req.params.id;
    if(id){
      var sql = 'DELETE FROM topic WHERE id=?';
      conn.query(sql,[id], function(err, topic, fields){
        if(err){
          console.log('err');
          res.status(500).send('Internal Server Error');
        }else{
          //console.log(topic[0]);
          res.redirect('/topic/'+id);

        }
      });
    }else{
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
})
app.get(['/topic','/topic/:id'],function(req,res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql,function(err,topics,fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql,[id], function(err, topic, fields){
        if(err){
          console.log('err');
          res.status(500).send('Internal Server Error');
        }else{
          res.render('view',{topics:topics, topic:topic[0]});
        }
      });
    }else{
      res.render('view',{topics:topics});
    }
  });


  // fs.readdir('data',function(err,files){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   var id = req.params.id;
  //   if(id){
  //     //id값이 있을 때
  //     fs.readFile('data/'+id,'utf8',function(err,data){
  //       if(err){
  //         console.log(err);
  //         res.status(500).send('Internal Server Error');
  //       }
  //       res.render('view',{topics:files, title:id,description:data});
  //     })
  //   }else{
  //     //id값이 없을 때
  //     res.render('view',{topics:files, title:'Welcome',description:'Hello, JavaScript for Server.'});
  //   }
  // })
})

// app.get('/topic/:id',function(req,res){
//   var id = req.params.id;
//   fs.readdir('data',function(err,files){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     fs.readFile('data/'+id,'utf8',function(err,data){
//       if(err){
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       res.render('view',{topics:files, title:id,description:data});
//     });
//   });
// });
