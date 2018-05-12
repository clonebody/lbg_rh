var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	//var query = req.query;
    //  req.query['tableId'

    var tableId = "11";
    var gameId = "gobblet";
    var gameName = "11";

    res.render('gamePlay', 
        {
            tableId : tableId,
            gameId : gameId,
            gameName : gameName,
        });
});

//router.get('/ws', function(req, res, next) {
//});

module.exports = router;