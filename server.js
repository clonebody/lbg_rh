//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    morgan  = require('morgan'),
    path    = require('path');
    
Object.assign=require('object-assign')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'public')));
require(path.join(__dirname, 'games/info'))(express, app);

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var mongoURL = require(path.join(__dirname, 'mongoURL'))

var sessionConfig = {
  cookie: {
    maxAge: 2 * 60 * 60 * 1000
  },
  secret: process.env.COOKIES_SECRET_KEY,
  saveUninitialized: false,
  resave: false,
}

var opr = require(path.join(__dirname, 'operation'))

if (mongoURL) {
  //  mongoDB
  var mongodb = require('mongodb');
  var dbPromise = mongodb.connect(mongoURL);

  dbPromise.then(function(conn) {
    console.log('Connected to MongoDB at: %s', mongoURL);
    var dataOpr = require(path.join(__dirname, 'mongoDataOpr'))(conn);
    app.locals.opr = opr(dataOpr);
  })

  sessionConfig.store = new MongoStore({dbPromise: dbPromise});
} else {
  //  mem
  var dataOpr = require(path.join(__dirname, 'memDataOpr'));
  app.locals.opr = opr(dataOpr);
};

app.use(session(sessionConfig));

app.get('/', function (req, res) {
  res.render('home', {});
});

app.get('/pagecount', function (req, res) {
  res.send('{ pageCount: -1 }');
});

app.use('/account', require(path.join(__dirname, 'routes/account')));
app.use('/console', require(path.join(__dirname, 'routes/console')));
app.use('/table', require(path.join(__dirname, 'routes/table')));
app.use('/game', require(path.join(__dirname, 'routes/game')));

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
