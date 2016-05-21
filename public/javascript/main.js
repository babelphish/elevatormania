var game;
var people = {};
var FACING = { 'LEFT' : 1, 'RIGHT' : 2 } 

window.onload = function() {	
	var people = {};

	var building = new Building(3, 10);

	game = new Phaser.Game(building.width, building.height, Phaser.AUTO, "main-canvas");

	var playGame = function(game) {};
	playGame.prototype = {
		preload: function() {
			game.load.spritesheet('person', '/sprites/body_no_head.png', constants.personWidth, constants.personHeight, 14);
			game.load.spritesheet('head_danny', '/sprites/head_danny3.png', 50, constants.headHeight, 4);
			game.load.image('carpet', '/sprites/carpet.png');
			game.load.image('concrete', '/sprites/concrete.png');
		},
		create: function() {
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.stage.backgroundColor = 0xD3D3D3;
			building.render();
			var personFactory = new PersonFactory(building);
					
			for (var i = 0; i < 9; i++) {
				people[i] = personFactory.getPerson({ space: 5, floor: i % 3 + 1, pace: 7 });
			}

			timer = game.time.create(false);
			
			//  Set a TimerEvent to occur after 2 seconds
			timer.loop(3000, function() {
				for (var i = 0; i < 9; i++) {
					var location = game.rnd.integerInRange(1, 10);
					people[i].walkTo(location);
				}
			}, this);
			timer.start();
		},
		update: function() {
		
		},
		render: function() {
		}
	}
	
	game.state.add("PlayGame", playGame);
	game.state.start("PlayGame");	
}

