module.exports = function(req, res, next) {
    if (!req.session || !req.session.account) {
        res.render('login' , {});
    } else {
        req.app.locals.opr.findAccount(req.session.account)
            .then(function(itemList) {
                if(itemList.length == 1) {
                    res.locals.account = itemList[0];
                    next();
                } else {
                    res.render('login' , {});
                }
            });
    }
}