var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var playerName = req.session.playerName;

    res.render('home', {playerName : playerName});
});

module.exports = router;