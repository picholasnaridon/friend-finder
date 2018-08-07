var express = require('express');
var router = express.Router();
var surveyResults = require('../public/javascript/surveyResults')


router.get('/friends', function (req, res, next) {
  res.json(surveyResults)
});


router.post('/friends', function (req, res, next) {
  var currentResults = surveyResults
  var userData = req.body
  var bestMatchName = ''
  var bestMatchDiff = 250
  var bestMatchPic = ''

  currentResults.forEach(element => {
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
      bestMatchName = element.userName
      bestMatchPic = element.photoUrl
    }
  });
  surveyResults.push(req.body)
  res.send({ "bestMatchName": bestMatchName, "bestMatchPic": bestMatchPic, "bestMatchDiff": bestMatchDiff })
});



module.exports = router;
