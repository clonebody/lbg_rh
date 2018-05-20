var express = require('express');
var router = express.Router();
var path = require('path');
var needLogin = require(path.join(__dirname, 'needLogin'));

router.get('/list', needLogin,
    function(req, res, next) {
        var start = req.query.start || 0;
        var num = req.query.num || 10;
    
        req.app.locals.opr.listTable(start, num)
            .then(function(itemList) {
                res.render('tableList', {list : itemList});
            }
        );
    }
);

router.get('/setting', needLogin,
    function(req, res, next) {
        if (!req.query.tableId) {
            res.res.redirect(req.baseUrl + "/list");
        }

        res.render('tableSetting' , {
            table : 11,
        });
    }
);


module.exports = router;