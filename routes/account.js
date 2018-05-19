var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.app.locals.opr.needLogin(req, res, next);
}, function(req, res, next) {
    res.render('account' , {
        account : res.locals.account,
    });
});

router.get('/setting', function(req, res, next) {
    req.app.locals.opr.needLogin(req, res, next);
}, function(req, res, next) {
    res.render('accountSetting' , {
        account : res.locals.account,
    });
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

router.get('/register', function(req, res, next) {
    res.render('accountRegister' , { invitation : "" });
});

router.get('/register/:invitation', function(req, res, next) {
    res.render('accountRegister' , { invitation : req.params.invitation });
});

router.post('/action', function(req, res, next) {
    var action = req.body.action || "";
    var account = req.body.account || "";
    var password = req.body.password || "";
    var invitation = req.body.invitation || "";

    var success = function() {
        req.session.account = account;
        res.send({ret:"ok"});
    }

    var fail = function(err) {
        res.send({ret:"fail", err : err});
    }

    if (account && password) {
        var opr = req.app.locals.opr;
        switch(action) {
        case "register":
            opr.getAccount(account).then(function(itemList) {
                if (itemList.length == 0) {
                    opr.newAccount(invitation, {account : account, password : password}).then(
                        function(item) {
                            success();
                        },
                        function(err) {
                            fail(err);
                        }
                    );
                } else {
                    fail("用户已存在");
                } 
            }, function(err) {
                fail(err);
            })
            break;
        case "login":
            opr.getAccount(account).then(function(itemList) {
                if (itemList.length == 1) {
                    var item = itemList[0];
                    if (item.password == password) {
                        success();
                    } else {
                        fail("密码错误");
                    }
                } else {
                    if (itemList != 0) {
                        console.log("dup account");
                        console.log(itemList);
                    }
                    fail("用户不存在");
                }
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
    } else {
        fail();
    }
});

module.exports = router;