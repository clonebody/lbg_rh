var express = require('express');
var router = express.Router();

router.use('/', 
    function(req, res, next) {
        console.log(req.session);
        if (!req.session || !req.session.account || !req.session.admin) {
            res.redirect("/");
        } else {
            next();
        }
    },
    function(req, res, next) {
        var db = res.locals.db;
        if (db) {
            next();
        } else {
            res.render('console' , {
                context : "no db",
            });
        }
    }
);

router.get('/', function(req, res, next) {
    var db = res.locals.db;
    var dbCol = db.collections();

    console.log(dbCol);

    res.render('console' , {
        context : "111",
    });
});

router.get('/:col', function(req, res, next) {
    var col = req.params.col;
    var db = res.locals.db;
    var dbCol = db.collection(col);

    if (dbCol) {
   	    console.log(dbCol);
   	    res.render('console' , {
   	        context : "222",
   	    });
    } else {
    	res.render('console' , {
            context : "no " + col,
         });
    }
});


module.exports = router;