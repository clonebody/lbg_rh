var express = require('express');
var router = express.Router();

var tableArray = require('./tableArray')

router.get('/', function(req, res, next) {
    res.render('tableList', tableArray);
});

module.exports = router;