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

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}

var db = null;
var sessionConfig = {
  cookie: {
    maxAge: 2 * 60 * 60 * 1000
  },
  secret: process.env.COOKIES_SECRET_KEY,
  saveUninitialized: false,
  resave: false,
}
if (app.get('env') != "development") {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      console.log(err); 
      callback(err);
      return;
    }

    db = conn;
    sessionConfig.store = new MongoStore({db : db})
    console.log('Connected to MongoDB at: %s', mongoURL);
  })
}

app.use(session(sessionConfig));
app.use(function(req, res, next) {
  res.locals.db = db;
  next();
});

app.get('/', function (req, res) {
  res.render('home', {
    docTitle : "桌游吧",
    navTitle : "主页",    
  });
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  //if (!db) {
  //  initDb(function(err){});
  //}
  //if (db) {
  //  db.collection('counts').count(function(err, count ){
  //    res.send('{ pageCount: ' + count + '}');
  //  });
  //} else {
  //  res.send('{ pageCount: -1 }');
  //}
  res.send('{ pageCount: -1 }');
});

app.use('/account', require(path.join(__dirname, 'routes/account')));
app.use('/console', require(path.join(__dirname, 'routes/console')));
//app.use('/home', require('./routes/home'));
//app.use('/tableList', require('./routes/tableList'));
//app.use('/tableSetting', require('./routes/tableSetting'));
app.use('/gamePlay', require(path.join(__dirname, 'routes/gamePlay')));

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
