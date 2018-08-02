var express = require('express');
var mysql = require('mysql');

var app = express()
var PORT = 3000

var bodyParser = require('body-parser');
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
      // pass current user data to results page redirect call
      var user_data = JSON.stringify(req.body)
      var encoded_data = encodeURIComponent(user_data);
      res.redirect('/results?value=' + encoded_data);
    }
  );
});

app.get('/results', function (req, res) {
  // parse current user data to compare against other users 
  var enconded_data;
  var userData;
  var allUserResults
  var bestMatchName = ''
  var bestMatchDiff = 250

  if (req.query.value) {
    enconded_data = decodeURIComponent(req.query.value)
    userData = JSON.parse(enconded_data)
    console.log(userData)


    connection.query('SELECT * FROM friends',
      function (err, result) {
        if (err) throw err;
        result.pop()
        result.forEach(element => {
          var diff =
            (Math.abs(element.pets - userData.pets)) +
            (Math.abs(element.outdoorsy - userData.outdoorsy)) +
            (Math.abs(element.outgoing - userData.outgoing)) +
            (Math.abs(element.upset - userData.upset)) +
            (Math.abs(element.curious - userData.curious)) +
            (Math.abs(element.introvert - userData.introvert)) +
            (Math.abs(element.creative - userData.creative)) +
            (Math.abs(element.relaxed - userData.relaxed)) +
            (Math.abs(element.family - userData.family)) +
            (Math.abs(element.friends - userData.friends))
          if (diff < bestMatchDiff) {
            bestMatchDiff = diff
            console.log(bestMatchDiff)
            bestMatchName = element.user_name
            console.log(bestMatchName)
          }
        });
        res.render('results', { bestMatch: bestMatchName, bestDiff: bestMatchDiff })
        connection.end()
      }
    )
  } else {
    res.redirect('/survey')
  };
})

app.get('/api/friends', function (req, res) {
  connection.query('SELECT * FROM friends',
    function (err, result) {
      if (err) throw err;
      res.json(result);
      connection.end()
    }
  );
})

app.get('*', function (req, res) {
  res.redirect('/home');
});

app.listen(PORT, function () {
  console.log("Listening on PORT ", PORT)
})
