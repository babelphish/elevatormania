function Elevator(init, building) {
	this.building = building;
	this.leftSpace = init.leftSpace != null ? init.leftSpace : 2;
	this.bottomFloor = init.bottomFloor != null ? init.bottomFloor : 1;
	this.topFloor = init.topFloor != null ? init.topFloor : 2;
	this.shaft = new ElevatorShaft(this);
	this.elevatorCar = new ElevatorCar({ "floor" : this.bottomFloor }, this);
	this.entrances = {};
	
	for (var i = this.bottomFloor; i <= this.topFloor; i++) {
		var open = (i == this.bottomFloor);
		this.entrances[i] = new ElevatorEntrance({ "floor" : i, "isOpen" : open }, this);
	}
}

Elevator.prototype.render = function() {

	this.elevatorCar.render();
	for (var entrance in this.entrances) {
		this.entrances[entrance].render();
	}
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
	this.sprites.x = this.getXCoord();
	this.sprites.y = this.getYCoord();
}

ElevatorEntrance.prototype.render = function() {
	this.exterior = game.add.sprite(0,0, 'elevator_exterior');
	this.exterior.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);	
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
	this.sprites.add(this.leftDoor);

		
	this.rightDoor = game.add.sprite(constants.elevator, constants.elevatorDoorHeightOffset, 'right_door');
	this.rightDoor.pivot.x = 34 - constants.elevatorExteriorWidth;
	this.rightDoor.anchor.setTo(1,0);
	this.rightDoor.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);
	this.rightDoor.crop(this.cropRect);
	this.sprites.add(this.rightDoor);	
	
	//make clickable.. for now
	this.exterior.inputEnabled = true;

    this.exterior.events.onInputDown.add(function() {
		if (!this.transitioning) {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
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
	this.changeDoorState(0);
}

ElevatorEntrance.prototype.close = function() {
	this.changeDoorState(constants.elevatorDoorWidth);
}

ElevatorEntrance.prototype.changeDoorState = function(width) {
	if (this.transitioning)
		return;
	
	this.transitioning = true;
	var tween = game.add.tween(this.cropRect).to( { x: constants.elevatorDoorWidth - width, width: width }, 250)
	tween.onUpdateCallback(function() { 
		this.leftDoor.updateCrop();
		this.rightDoor.updateCrop();
	}, this);
	tween.onComplete.add(function() {
		this.leftDoor.updateCrop();
		this.rightDoor.updateCrop();
		this.transitioning = false;
		this.isOpen = !this.isOpen;
	}, this);
	
	tween.start();		
}


function ElevatorCar(init, parentElevator) {
	this.parentElevator = parentElevator;
	this.floor = init.floor != null ? init.floor : 1;
	
	this.sprites = game.add.group();
	this.sprites.x = this.getXCoord();
	this.sprites.y = this.getYCoord();
}

ElevatorCar.prototype.render = function() {
	this.car = game.add.sprite(0,0, 'elevator_interior');
	this.car.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);	
	this.sprites.add(this.car);
}

ElevatorCar.prototype.getXCoord = function() {
	return this.building().getXCoordFromSpace(this.parentElevator.leftSpace) + constants.elevatorDoorWidthOffset;
}

ElevatorCar.prototype.getYCoord = function() {
	return (this.building().getYCoordFromFloor(this.floor) - constants.hallwayHeight - 12 - constants.elevatorInteriorScaledHeight);
}

ElevatorCar.prototype.building = function() {
	return this.parentElevator.building;
}