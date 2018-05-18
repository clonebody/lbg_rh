var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.session || !req.session.account) {
        res.render('login' , {
            docTitle : "登陆",
            navTitle : "登陆",
        });
    } else {
        var account = req.session.account;
        res.render('account' , {
            docTitle : "用户",
            navTitle : "账户",
            account : account,
        });
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

router.get('/register', function(req, res, next) {
    res.render('register' , {
        docTitle : "注册",
        navTitle : "注册",
    });
});

router.post('/check', function(req, res, next) {
    var action = req.body.action || "login";
    var account = req.body.account;
    var password = req.body.password;
    var valid = false;

    var success = function() {
        req.session.account = account;
        if (process.env.ADMIN_ACCOUNT == account) {
            req.session.admin = true;
        } else {
            req.session.admin = false;
        }
        res.send({ret:"ok"});
    }

    var fail = function() {
        res.send({ret:"fail"});
    }

    if (account && password) {
        if (req.app.get('env') == "development") {
            success();
        } else {
            var db = res.app.locals.db;
            var collection = db.collection('account');
            collection.find({account : account}).toArray(function(err, docs) {
                console.log(docs);
                if (action == "login") {
                    if (docs.length == 1) {
                        success();
                        return;
                    }
                } else if (action == "register") {
                    if (docs.length == 0) {
                        collection.insertOne({
                            account : account, 
                            password : password
                        }, function(err, r) {
                            if (err) {
                                console.log(err);
                            } else {
                                success();
                                return;
                            }
                        });
                    }
                }
                fail();
            });
        }
    } else {
        fail();
    }
});

module.exports = router;