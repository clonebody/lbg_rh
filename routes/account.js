var express = require('express');
var router = express.Router();
var path = require('path');
var needLogin = require(path.join(__dirname, 'needLogin'));

router.get('/', needLogin,
    function(req, res, next) {
        res.render('account' , {
            account : res.locals.account,
        });
    }
);

router.get('/setting', needLogin,
    function(req, res, next) {
        res.render('accountSetting' , {
            account : res.locals.account,
        });
    }
);

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
            opr.addAccount(invitation, account, password).then((ret) => {
                console.log("success");
                console.log(ret);
                success();
            }, (err) => {
                console.log("fail");
                console.log(err);
                fail(err);
            }
            );
            break;
        case "login":
            opr.findAccount(account).then((list) => {
                if (list.length != 1) {
                    var item = list[0];
                    if (item.password == password) {
                        success();
                    } else {
                        fail("密码错误");
                    }
                } else {
                    if (list.length != 0) {
                        console.log("dup account");
                        console.log(list);
                    }
                    fail("用户不存在");
                }                    
            }, (err) => {
                fail(err);
            });
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