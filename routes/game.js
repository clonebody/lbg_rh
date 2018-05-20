var express = require('express');
var router = express.Router();
var path = require('path');
var needLogin = require(path.join(__dirname, 'needLogin'));

router.get('/:tableId', needLogin,
	function(req, res, next) {
		res.render('account' , {
			account : res.locals.account,
		});
	}
);

module.exports = router;