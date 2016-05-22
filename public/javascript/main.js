var game;
var people = {};
var FACING = { 'LEFT' : 1, 'RIGHT' : 2 } 
var spaces = 12;
var floors = 4;

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
				people[i] = personFactory.getPerson({ space: 5, floor: i % 3 + 1, pace: 7 });
			}

			timer = game.time.create(false);
			
			//  Set a TimerEvent to occur after 2 seconds
			timer.loop(3000, function() {
				for (var i = 0; i < 9; i++) {
					var location = game.rnd.integerInRange(1, 10);
					//people[i].walkTo(location);
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

