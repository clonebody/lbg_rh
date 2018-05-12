var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var playerName = req.query.playerName;
    
    if (playerName) {
        req.session.sign = true;
        req.session.playerName = playerName;
        res.redirect('/home');
    } else {
        res.render('login');
    }    
});

module.exports = router;