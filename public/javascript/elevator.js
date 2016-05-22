function Elevator(init, building) {
	this.building = building;
	this.leftSpace = init.leftSpace != null ? init.leftSpace : 2;
	this.bottomFloor = init.bottomFloor != null ? init.bottomFloor : 1;
	this.topFloor = init.topFloor != null ? init.topFloor : 2;
	this.shaft = new ElevatorShaft(this);	
	this.entrances = {};
	
	for (var i = this.bottomFloor; i <= this.topFloor; i++) {
		this.entrances[i] = new ElevatorEntrance({ "floor" : i }, this);
	}
}

Elevator.prototype.render = function() {
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

	var elevatorDoors = {}; //these are 
	
	this.sprites = game.add.group();
	this.sprites.x = this.getXCoord();
	this.sprites.y = this.getYCoord();	
}

ElevatorEntrance.prototype.render = function() {
	this.exterior = game.add.sprite(0,0, 'elevator_exterior');
	this.exterior.scale.setTo(constants.elevatorScaling, constants.elevatorScaling);
	this.sprites.add(this.exterior);
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