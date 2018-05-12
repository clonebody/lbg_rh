var express = require('express');
var router = express.Router();

var tableArray = require('./tableArray')

router.get('/:tableId/', function(req, res, next) {
    res.render('tableSetting', {}});
    /*
    var tableId = req.params.tableId;
    
    var table = tableArray.tables[tableId];
    console.log('ta :\n'+  JSON.stringify(tableArray));

    if (table) {
        console.log('table\n'+ JSON.stringify(table));

        var playerName = req.session.playerName;
        //console.log('playerName\n'+playerName);
        table.players[playerName] = "1";
        res.render('tableSetting', table);
    } 
    */  
});

module.exports = router;