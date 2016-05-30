function Elevator(init, building) {
	this.building = building;
	this.leftSpace = init.leftSpace != null ? init.leftSpace : 2;
	this.bottomFloor = init.bottomFloor != null ? init.bottomFloor : 1;
	this.topFloor = init.topFloor != null ? init.topFloor : 2;
	this.shaft = new ElevatorShaft(this);
	var carFloor = this.bottomFloor;
	this.car = new ElevatorCar({ "floor" : carFloor }, this);
	this.entrances = {};
	
	for (var i = this.bottomFloor; i <= this.topFloor; i++) {
		var open = (i == carFloor);
		this.entrances[i] = new ElevatorEntrance({ "floor" : i, "isOpen" : open }, this);
	}	
}

Elevator.prototype.render = function() {
	this.car.render();
	for (var entrance in this.entrances) {
		this.entrances[entrance].render();
	}
	
	this.entrances[this.car.floor].setTransparent(true);
}

function ElevatorShaft(parent) {
	this.parentElevator = parent;
}

ElevatorShaft.prototype.render = function() {
	//this.parent.
}

function ElevatorEntrance(init, parentElevator) {
	this.parentElevator = parentElevator;
	this.floor = init.floor != null ? init.floor : 1;
	this.isOpen = init.isOpen != null ? init.isOpen : false;
	this.transitioning = false;
	
	this.sprites = game.add.group();
	this.doors = game.add.group();
	this.sprites.x = this.getXCoord();
	this.sprites.y = this.getYCoord();
}

ElevatorEntrance.prototype.render = function() {
	var that = this;
	this.exterior = game.add.sprite(0,0, 'elevator_exterior');
	this.exterior.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);
	this.transparent = false;
	this.sprites.add(this.exterior);

	if (this.isOpen) {	
		this.cropRect = new Phaser.Rectangle(constants.elevatorDoorWidth, 0, 0, constants.elevatorDoorHeight);
	} else {
		this.cropRect = new Phaser.Rectangle(0,0, constants.elevatorDoorWidth, constants.elevatorDoorHeight);
	}
	
	this.leftDoor = game.add.sprite(constants.elevatorDoorWidthOffset, constants.elevatorDoorHeightOffset, 'left_door');
	this.leftDoor.anchor.setTo(0, 0);
	this.leftDoor.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);
	this.leftDoor.crop(this.cropRect);
	this.doors.add(this.leftDoor);

		
	this.rightDoor = game.add.sprite(constants.elevator, constants.elevatorDoorHeightOffset, 'right_door');
	this.rightDoor.pivot.x = 34 - constants.elevatorExteriorWidth;
	this.rightDoor.anchor.setTo(1,0);
	this.rightDoor.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);
	this.rightDoor.crop(this.cropRect);
	this.doors.add(this.rightDoor);

	this.sprites.add(this.doors);
	//make clickable.. for now
	this.exterior.inputEnabled = true;

    this.exterior.events.onInputDown.add(function() {
		if (this.parentElevator.car.floor == that.floor) {
			if (!that.parentElevator.car.transitioning) {
				if (this.isOpen) {
					this.close();
				} else {
					this.open();
				}
			}
		} else {
			this.parentElevator.car.sendTo(that.floor);
		}
	}, this);
	
}

ElevatorEntrance.prototype.getXCoord = function() {
	return this.building().getXCoordFromSpace(this.parentElevator.leftSpace);
}

ElevatorEntrance.prototype.getYCoord = function() {
	return (this.building().getYCoordFromFloor(this.floor) - constants.elevatorExteriorScaledHeight - constants.hallwayHeight);
}

ElevatorEntrance.prototype.building = function() {
	return this.parentElevator.building;
}

ElevatorEntrance.prototype.open = function() {
	this.changeDoorState(0, true);
}

ElevatorEntrance.prototype.close = function() {
	this.changeDoorState(constants.elevatorDoorWidth, false);
}

ElevatorEntrance.prototype.changeDoorState = function(width, isOpen) {
	if (this.transitioning) {
		this.openCloseTween.stop();
	}

	this.isOpen = isOpen;

	if (width != this.cropRect.width) {
		var tweenTime = (Math.abs(width - this.cropRect.width) / constants.elevatorDoorWidth) * constants.elevatorDoorWidthTravelTime;
		
		this.transitioning = true;
		this.openCloseTween = game.add.tween(this.cropRect).to( { x: constants.elevatorDoorWidth - width, width: width }, tweenTime )
		this.openCloseTween.onUpdateCallback(function() {
			this.leftDoor.updateCrop();
			this.rightDoor.updateCrop();
		}, this);
		this.openCloseTween.onComplete.add(function() {
			this.leftDoor.updateCrop();
			this.rightDoor.updateCrop();
			this.transitioning = false;
		}, this);
		
		this.openCloseTween.start();
	}
}

ElevatorEntrance.prototype.setTransparent = function(setTransparent) {
	if (setTransparent == this.isTransparent()) //no need to change if it's already transparent
		return;

	if (this.transparencyTween != null)
		this.transparencyTween.stop();
		
	this.transparent = setTransparent;
	var newAlpha = 1;
	if (setTransparent) {
		newAlpha = 0.7;
	}	
	
	this.transparencyTween = game.add.tween(this.doors).to( { alpha: newAlpha }, 250);
	this.transparencyTween.start();
}

ElevatorEntrance.prototype.isTransparent = function() {
	return this.transparent;
}

function ElevatorCar(init, parentElevator) {
	this.parentElevator = parentElevator;
	this.floor = init.floor != null ? init.floor : 1;
	
	this.sprites = game.add.group();
	this.sprites.x = this.getXCoord();
	this.sprites.y = this.getYCoordFromFloor(this.floor);
}

ElevatorCar.prototype.render = function() {
	this.car = game.add.sprite(0,0, 'elevator_interior');
	this.car.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);	
	this.sprites.add(this.car);
}

ElevatorCar.prototype.getXCoord = function() {
	return this.building().getXCoordFromSpace(this.parentElevator.leftSpace) + constants.elevatorDoorWidthOffset;
}

ElevatorCar.prototype.getYCoordFromFloor = function(floor) {
	return (this.building().getYCoordFromFloor(floor) - constants.hallwayHeight - 12 - constants.elevatorInteriorScaledHeight)
}

ElevatorCar.prototype.building = function() {
	return this.parentElevator.building;
}

ElevatorCar.prototype.timeToTravelBetweenFloors = function(floor1, floor2) {
	return (Math.abs(floor1 - floor2) * constants.elevatorFloorTravelMilliseconds) + constants.elevatorFloorTravelOverheadMilliseconds;
}

ElevatorCar.prototype.sendTo = function(destinationFloor) {
	var that = this;
	if (this.transitioning)
		return;
	
	if (destinationFloor != this.floor) {	
		this.transitioning = true;
		
		this.parentElevator.entrances[this.floor].close();

		var waitingForIntersection = true;
		var waitingForDeintersection = false;
		var testingFloor = getFloorOffset(1, this.floor, destinationFloor); //updated as the elevator moves
		var testingEntrance = this.parentElevator.entrances[testingFloor];
		
		var tween = game.add.tween(this.sprites).to( { y : that.getYCoordFromFloor(destinationFloor) }, that.timeToTravelBetweenFloors(this.floor, destinationFloor), Phaser.Easing.Quadratic.InOut);
		tween.onComplete.add(function() {
			this.transitioning = false;
			this.floor = destinationFloor;
			this.parentElevator.entrances[destinationFloor].open();
		}, this);
		tween.onUpdateCallback(function() { 
			if (waitingForIntersection) {
				if (that.intersectsWith(testingEntrance)) {
					testingEntrance.setTransparent(true);
					waitingForIntersection = false;
					waitingForDeintersection = true;
					testingFloor = getFloorOffset(-1, testingFloor, destinationFloor);
					testingEntrance = this.parentElevator.entrances[testingFloor];
				}
			} else if (waitingForDeintersection) {
				if (!that.intersectsWith(testingEntrance)) {
					testingEntrance.setTransparent(false);
					waitingForIntersection = true;
					waitingForDeintersection = false;
					testingFloor = getFloorOffset(2, testingFloor, destinationFloor);
					testingEntrance = this.parentElevator.entrances[testingFloor];					
				}
			}
		}, this);
	
		tween.start();
	}
	
	//value: sign determines closer or farther away (negative is farther), 
	//       number equals how many floors
	function getFloorOffset(value, floor, destination) {
		if (destination == floor) {
			return destination;
		}
		
		var number = (destination - floor);
		
		var signTowardsDestination = (number && number / Math.abs(number));
		return floor + (signTowardsDestination * value);
	}	
}

ElevatorCar.prototype.intersectsWith = function(entrance) {
	return Phaser.Rectangle.intersects(this.sprites.getBounds(), entrance.sprites.getBounds());
}