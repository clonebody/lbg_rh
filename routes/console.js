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
    var start = req.query.start || 0;
    var num = req.query.num || 10;
    req.app.locals.opr.listInvitation(start, num).then((list) => {
        res.render('consoleInvitation' , {list : list});
    })
});

router.get('/accountList', function(req, res, next) {
    var start = req.query.start || 0;
    var num = req.query.num || 10;
    req.app.locals.opr.listAccount(start, num).then((list) => {
        res.render('consoleAccountList', {list : list});
    });
});

router.get('/account/:account', function(req, res, next) {
    req.app.locals.opr.findAccount(req.params.account).then((list) => {
        if(list.length != 0) {
          res.render('consoleAccount', {account : list[0]});
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

    var opr = req.app.locals.opr;
    switch(action) {
    case "addInvitation":
        opr.addInvitation().then(
            (ret) => {
                success();
            },
            (err) => {
                fail(err);
            }
        );
        break;
    case "clearInvitation":
        opr.clearInvitation().then(
            (ret) => {
                success();
            },
            (err) => {
                fail(err);
            }
        )
        break;
    case "delAccount":
        opr.delAccount(req.body.account).then(
            (ret) => {
                success();
            },
            (err) => {
                fail(err);
            }
        )
        break;
    default:
        console.log("unknown action :");
        console.log(req.body);
        fail("异常操作");
        break;
    }
});


module.exports = router;