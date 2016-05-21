function Building(floors, spaces) {
	this.floors = floors;
	this.spaces = spaces;
	this.height = floors * constants.floorHeight;
	this.width = spaces * constants.spaceWidth;	
}

Building.prototype.getFloorY = function(floor) {
	return (this.height - ((floor - 1) * constants.floorHeight));
}

Building.prototype.render = function() {
	for (var floorIndex = 1; floorIndex <= this.floors; floorIndex++) {
		this.hallway = game.add.tileSprite(0, this.getFloorY(floorIndex) - constants.hallwayHeight, this.width, constants.hallwayHeight, 'carpet');
		this.hallway.tileScale.y = constants.hallwayHeight / 180;
		this.concrete = game.add.tileSprite(0, this.getFloorY(floorIndex), this.width, 10, 'concrete');
	}
}

Building.prototype.destroy = function() {
	if (this.hallway)
		this.hallway.destroy();
	
	if (this.concrete)
		this.concrete.destroy();
}