function Building(floors, spaces, elevatorConfigs) {
	this.floors = floors;
	this.spaces = spaces;
	this.height = floors * constants.floorHeight;
	this.width = spaces * constants.spaceWidth;
	this.elevators = [];
	
	for (var elevatorConfigIndex in elevatorConfigs) {
		var elevatorConfig = elevatorConfigs[elevatorConfigIndex];
		this.elevators.push(new Elevator(elevatorConfig, this));
	}
}

Building.prototype.getXCoordFromSpace = function(space) {
	return ((space - 1) * constants.spaceWidth);
}
	
Building.prototype.getYCoordFromFloor = function(floor) {
	return (this.height - ((floor - 1) * constants.floorHeight));
}

Building.prototype.render = function() {
	for (var floorIndex = 1; floorIndex <= this.floors; floorIndex++) {
		this.hallway = game.add.tileSprite(0, this.getYCoordFromFloor(floorIndex) - constants.hallwayHeight, this.width, constants.hallwayHeight, 'carpet');
		this.hallway.tileScale.y = constants.hallwayHeight / 180;
		this.concrete = game.add.tileSprite(0, this.getYCoordFromFloor(floorIndex), this.width, 10, 'concrete');
	}
	
	for (var elevatorIndex in this.elevators) {
		var elevator = this.elevators[elevatorIndex];
		elevator.render();
	}
}

Building.prototype.destroy = function() {
	if (this.hallway)
		this.hallway.destroy();
	
	if (this.concrete)
		this.concrete.destroy();
}