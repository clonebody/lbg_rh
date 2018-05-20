var express = require('express');
var router = express.Router();
var path = require('path');
var needLogin = require(path.join(__dirname, 'needLogin'));

router.use('/', function(req, res, next) {
    if (req.app.get('env') == "development") {
        next();
    } else {
        needLogin(req, res, function() {
            if (res.locals.account.admin) {
                next();
            } else {
                res.redirect("/");
            }
        });
    }
});

router.get('/', function(req, res, next) {
    res.render('console' , {});
});

router.get('/invitation', function(req, res, next) {
    console.log("list inv");
    req.app.locals.opr.listInvitation()
        .then(function(list) {
            res.render('consoleInvitation' , {list : list});
        })
});

router.get('/accountList', function(req, res, next) {
    var start = req.query.start || 0;
    var num = req.query.num || 10;

    req.app.locals.opr.listAccount(start, num)
        .then(function(itemList) {
            res.render('consoleAccountList', {list : itemList});
        });
});

router.get('/account/:account', function(req, res, next) {
    req.app.locals.opr.getAccount(req.params.account)
        .then(function(itemList) {
          if(itemList.length == 1) {
            res.render('consoleAccount', {account : itemList[0]});
          } else {
            res.redirect(req.baseUrl + '/accountList');
          }
        });
});

router.post('/action', function(req, res, next) {
    var action = req.body.action || "";

    var success = function() {
        res.send({ret:"ok"});
    }

    var fail = function(err) {
        res.send({ret:"fail", err : err});
    }

    console.log(req.body);

    var opr = req.app.locals.opr;
    switch(action) {
    case "addInvitation":
        opr.newInvitation().then(function(item) {
            success();
        }, function(err) {
            fail(err);
        })
        break;
    case "clearInvitation":
        opr.clearInvitation().then(function(item) {
            success();
        }, function(err) {
            fail(err);
        })
        break;
    case "delAccount":
        opr.delAccount(req.body.account).then(function(item) {
            success();
        }, function(err) {
            fail(err);
        })
        break;
    default:
        console.log("unknown action :");
        console.log(req.body);
        fail("异常操作");
        break;
    }
});


module.exports = router;