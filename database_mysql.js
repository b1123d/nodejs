var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : '220.94.71.218',
  user     : 'b1123d',
  password : 'Timber2012',
  database : 'timber',
  port : '5200'
});

conn.connect();
/*
var sql = 'SELECT * FROM topic';
conn.query(sql,function(err,rows,fields){
  if(err){
    console.log(err);
  }else{
    for(var i=0; i<rows.length;i++){
      console.log(rows);
    }
  }

});
*/
var sql = 'INSERT INTO topic(title, description, author) VALUES(?,?,?)';
var params = ['Supervisor','Watcher','graphittie'];
conn.query(sql,params,function(err, rows, fields){
  if(err){
    console.log(err);
  }else {
    console.log(rows);
  }
});
conn.end();
