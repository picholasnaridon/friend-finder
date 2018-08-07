var express = require('express');
var router = express.Router();


router.get('/survey', function (req, res, next) {
  res.render('survey');
});


router.get('/', function (req, res, next) {
  res.render('home');
});



module.exports = router;
