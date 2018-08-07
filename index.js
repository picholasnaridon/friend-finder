var express = require('express');
var path = require('path');

var app = express()
var PORT = process.env.PORT || 3000

var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'handlebars');
app.set('views', './views')

var apiRouter = require('./routes/apiRoutes');
var htmlRouter = require('./routes/htmlRoutes');

var surveyResults = require('./public/javascript/surveyResults.js')

app.use('/', htmlRouter);
app.use('/api', apiRouter);


app.listen(PORT, () => {
  console.log("Listening on port: ", PORT)
})