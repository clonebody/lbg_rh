var express = require('express');
var router = express.Router();

router.use('/', 
    function(req, res, next) {
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
    var dbCol = db.listCollections({}, null);

    console.log(dbCol);

    res.render('console' , {
        context : "111",
    });
});

router.get('/:col', function(req, res, next) {
    var col = req.params.col;
    var db = res.locals.db;

    db.collection(col).find({}).toArray(function(err, docs) {
        if (err) {
            res.render('console' , {
                context : "no " + col,
            });
        } else {
            console.log(docs)
            callback(docs);
            res.render('console' , {
                context : "222",
            });
        };
    });
});


module.exports = router;