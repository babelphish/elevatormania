var game;
var people = {};
var FACING = { 'LEFT' : 1, 'RIGHT' : 2 } 
var spaces = 12;
var floors = 4;
var debugLines = [];

window.onload = function() {	
	var people = {};

	game = new Phaser.Game(spaces * constants.spaceWidth, floors * constants.floorHeight, Phaser.AUTO, "main-canvas");

	var playGame = function(game) {};
	playGame.prototype = {
		preload: function() {
			game.load.spritesheet('person', '/sprites/body_no_head.png', constants.personWidth, constants.personHeight, 14);
			game.load.spritesheet('head_danny', '/sprites/head_danny3.png', 50, constants.headHeight, 4);
			game.load.image('carpet', '/sprites/carpet.png');
			game.load.image('concrete', '/sprites/concrete.png');
			game.load.image('left_door', '/sprites/left_door.png');
			game.load.image('right_door', '/sprites/right_door.png');
			game.load.image('elevator_exterior', '/sprites/elevator_exterior.png');
			game.load.image('elevator_interior', '/sprites/elevator_interior.png');
		},
		create: function() {
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.stage.backgroundColor = 0xD3D3D3;
			
			var building = new Building(floors, spaces, [{ 
				"leftSpace" : 2,
				"bottomFloor" : 1,
				"topFloor" : floors
			}]);
			
			building.render();
			var personFactory = new PersonFactory(building);
					
			for (var i = 0; i < 9; i++) {
				people[i] = personFactory.getPerson({ space: i % 3 + 1, floor: i % 3 + 1, pace: 7 });
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
			
			for (i = 1; i <= spaces; i++) {
				debugLines.push(new Phaser.Line((i - 1) * 80 , 0, (i- 1) * 80, game.height));
			}
		},
		update: function() {
		
		},
		render: function() {
			/*
			for (i = 1; i <= spaces; i++) {
				//game.debug.geom(debugLines[i - 1]);
				//game.debug.lineInfo(line1, 32, 32);
			}
			*/
		}
	}
	
	game.state.add("PlayGame", playGame);
	game.state.start("PlayGame");	
}

