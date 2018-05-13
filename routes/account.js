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

router.get('/check', function(req, res, next) {
    var account = req.query.account;
    var password = req.query.password;
    var valid = false;

    if (account && password) {
        if (account == password) {
            valid = true;    
        }        
    }
    if (valid) {
        req.session.account = account;
        console.log("acc \n");
        console.log(account);
        console.log("admin acc \n");
        console.log(process.env.ADMIN_ACCOUNT);
        
        if (process.env.ADMIN_ACCOUNT == account) {
            req.session.admin = true;
        } else {
            req.session.admin = false;
        }
        console.log(req.session);
        res.send({ret:"ok"});
    } else {
        res.send({ret:"fail"});
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;