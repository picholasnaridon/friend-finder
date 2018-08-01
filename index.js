var express = require('express');
var mysql = require('mysql');

var app = express()
var bodyParser = require('body-parser');
var PORT = 3000
var exphbs = require('express-handlebars');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: ''
});

connection.query('CREATE DATABASE IF NOT EXISTS friend_finder', function (err) {
  if (err) throw err;
  connection.query('USE friend_finder', function (err) {
    if (err) throw err;
    connection.query('CREATE TABLE IF NOT EXISTS friends('
      + 'id INT NOT NULL AUTO_INCREMENT,'
      + 'PRIMARY KEY(id),'
      + 'user_name VARCHAR(30),'
      + 'photo VARCHAR(50),'
      + 'pets INTEGER(10),'
      + 'outdoorsy INTEGER(10),'
      + 'outgoing INTEGER(10),'
      + 'upset INTEGER(10),'
      + 'curious INTEGER(10),'
      + 'introvert INTEGER(10),'
      + 'creative INTEGER(10),'
      + 'relaxed INTEGER(10),'
      + 'family INTEGER(10),'
      + 'friends INTEGER(10)'
      + ')', function (err) {
        if (err) throw err;
      });
  });
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'handlebars');
app.set('views', './views')


app.listen(PORT, function () {
  console.log("Listening on PORT ", PORT)
})

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/survey', function (req, res) {
  res.render('survey');
});

app.post('/survey', function (req, res) {
  console.log("Data posted to DB", req.body);
  connection.query('INSERT INTO friends SET ?', req.body,
    function (err, result) {
      if (err) throw err;
      res.send('User added to database with ID: ' + result.insertId);
    }
  );
});

app.get('/api/friends', function (req, res) {
  connection.query('SELECT * FROM friends',
    function (err, result) {
      if (err) throw err;
      res.json(result);
    }
  );
})

app.get('*', function (req, res) {
  res.redirect('/home');
}); 
