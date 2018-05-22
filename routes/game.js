var express = require('express');
var router = express.Router();
var path = require('path');
var needLogin = require(path.join(__dirname, 'needLogin'));

router.get('/:tableId', needLogin,
    function(req, res, next) {
    	var tableId = req.params.tableId;
    	var table = {
    		id : tableId,
            name : "Gobblet",
        }
        var game = req.app.locals.gameList[table.name];
        res.render('game' , {
            account : res.locals.account,
            table : table,
            game : game,
        });
    }
);

module.exports = router;