var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //var playerName = req.session.playerName;

    res.render('home', {playerName : "213"});
});

module.exports = router;