var gameDir = [
	"TicTacToe_1.0",
	"Gobblet_1.0",
]

var path = require('path');

module.exports = function(express, app) {
	app.locals.gameList = {}
	for (key in gameDir) {
		var dir = gameDir[key];
		var assertPath = path.join(__dirname, dir);
		var item = require(path.join(__dirname, dir + '/init'));
		app.use('/assert/' + item.name, express.static(path.join(assertPath, 'assert')));
		app.locals.gameList[item.name] = item;
	}
};



