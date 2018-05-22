function gameStart (game, socket) {
	var width = game.config.width;
	var height = game.config.height;

	var baseSize = Math.min(width, height);
	var cx = width / 2;
	var cy = height / 2;
	var gridSize = baseSize / 3.5;

	var scene = {
		preload: function(){},
		create: function(){
			var graphics = this.add.graphics();
			//graphics.lineStyle(10, 0xff0000);
			graphics.beginPath();
			graphics.lineStyle(5, 0xffffff);			
			graphics.moveTo(cx - 1.5 * gridSize, cy - 0.5 * gridSize);
			graphics.lineTo(cx + 1.5 * gridSize, cy - 0.5 * gridSize);
			graphics.moveTo(cx - 1.5 * gridSize, cy + 0.5 * gridSize);
			graphics.lineTo(cx + 1.5 * gridSize, cy + 0.5 * gridSize);
			graphics.moveTo(cx - 0.5 * gridSize, cy - 1.5 * gridSize);
			graphics.lineTo(cx - 0.5 * gridSize, cy + 1.5 * gridSize);
			graphics.moveTo(cx + 0.5 * gridSize, cy - 1.5 * gridSize);
			graphics.lineTo(cx + 0.5 * gridSize, cy + 1.5 * gridSize);			
			graphics.strokePath();},
		update: function(){},
	};

	game.scene.add("start", scene, true);

	//return scene;
}

