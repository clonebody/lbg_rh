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

var sessionConfig = {
  cookie: {
    maxAge: 2 * 60 * 60 * 1000
  },
  secret: process.env.COOKIES_SECRET_KEY,
  saveUninitialized: false,
  resave: false,
}

app.locals.opr = {
  needLogin : function(req, res, next) {
    if (!req.session || !req.session.account) {
      res.render('login' , {});
    } else {
      req.app.locals.opr.getAccount(req.session.account)
        .then(function(itemList) {
          if(itemList.length == 1) {
            res.locals.account = itemList[0];
            next();
          } else {
            res.render('login' , {});
          }
        });
    }
  }
};

if (app.get('env') != "development") {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  var dbPromise = new Promise((resolve, reject) => {
    mongodb.connect(mongoURL, function(err, conn) {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    })
  });

  dbPromise.then(function(conn) {
    console.log('Connected to MongoDB at: %s', mongoURL);

    var accountCol = conn.collection('account');
    var invitationCol = conn.collection('invitation');

    app.locals.opr.newAccount = function(invitation, item) {
      return new Promise((resolve, reject) => {
        invitationCol.findOneAndDelete({invitation : invitation}).then(
          function (ret) {
            if (ret.lastErrorObject.n == 1) {
              accountCol.insertOne(item, function(err, r) {
                if (err) {
                  reject(err);
                } else {
                  resolve(item);
                }
              })
            } else {
              reject("邀请码无效");
            }
          },function (err) {
            console.log("err");
            console.log(err);
            reject(err);
          })
      })
    };
  
    app.locals.opr.getAccount = function(account) {
      return accountCol.find({account : account}).toArray();
    };

    app.locals.opr.listAccount = function(start, num) {
      return accountCol.find({}).skip(start).limit(num).toArray();
    };

    app.locals.opr.newInvitation = function() {
      return invitationCol.insertOne({invitation : Math.random().toString(36).slice(2)});
    };
  
    app.locals.opr.getInvitation = function(invitation) {
      return invitationCol.findOneAndDelete({invitation : invitation});
    };

    app.locals.opr.listInvitation = function() {
      return invitationCol.find().toArray();
    };

    app.locals.opr.clearInvitation = function() {
      return invitationCol.deleteMany({});
    };
  });

  sessionConfig.store = new MongoStore({dbPromise: dbPromise});
} else {
  var accountArray = new Array();
  var invitationArray = new Array();

  app.locals.opr.newAccount = function(invitation, item) {
    return new Promise((resolve, reject) => {
      accountArray.push(item);
      resolve(item);
    })
  };

  app.locals.opr.getAccount = function(account) {
    return new Promise((resolve, reject) => {
      var ret = new Array();
      for (key in accountArray) {
        var item = accountArray[key];
        if (item.account == account) {
          ret.push(item);
        }
      }
      resolve(ret);
    })
  };

  app.locals.opr.listAccount = function(start, num) {
    return new Promise((resolve, reject) => {
      var ret = new Array();
      for (key in accountArray) {
        if (start > 0) {
          start --;
          continue;
        }
        if (num > 0) {
          ret.push(accountArray[key]);
          num--;
        } else {
          break;
        }
      }
      resolve(ret);
    })
  };

  app.locals.opr.newInvitation = function() {
    return new Promise((resolve, reject) => {
      var item = {invitation : Math.random().toString(36).slice(2)};
      invitationArray.push(item);
      resolve(item);
    })
  };
  
  app.locals.opr.listInvitation = function() {
    return new Promise((resolve, reject) => {
      resolve(invitationArray);
    })
  };

  app.locals.opr.clearInvitation = function() {
    return new Promise((resolve, reject) => {
      invitationArray = new Array();
      resolve(invitationArray);
    })
  };
}

app.use(session(sessionConfig));

app.get('/', function (req, res) {
  res.render('home', {});
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
app.use('/table', require(path.join(__dirname, 'routes/table')));
//app.use('/console', require(path.join(__dirname, 'routes/console')));

app.use('/gamePlay', require(path.join(__dirname, 'routes/gamePlay')));

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
