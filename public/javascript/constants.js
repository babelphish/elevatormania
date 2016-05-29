var constants = constants || {};

(function () {
	this.spaceWidth = 80;
	this.floorHeight = 250;
	this.hallwayHeight = 20;
	this.personHeight = 151;
	this.personScaledHeight = (this.personHeight * 0.75);
	this.personWidth = 104;
	this.personScaledWidth = (this.personWidth * 0.75);
	this.headHeight = 60;
	this.headScaledHeight = (this.headHeight * 0.5);

	this.elevatorExteriorWidth = 254;
	this.elevatorExteriorScaledWidth = this.spaceWidth * 2;
	this.elevatorScaling = (this.elevatorExteriorScaledWidth / this.elevatorExteriorWidth);
	this.elevatorExteriorHeight = 318;
	this.elevatorExteriorScaledHeight = this.elevatorExteriorHeight * this.elevatorScaling;
	
	this.elevatorDoorWidth = 94;
	this.elevatorDoorScaledWidth = this.elevatorDoorWidth * this.elevatorScaling;
	this.elevatorDoorHeight = 262;
	this.elevatorDoorScaledHeight = this.elevatorDoorHeight * this.elevatorScaling;
	this.elevatorDoorWidthOffset = ((this.elevatorExteriorScaledWidth - (this.elevatorDoorScaledWidth * 2)) / 2);
	this.elevatorDoorHeightOffset = 24;
	
	this.elevatorDoorWidthTravelTime = 250;
	
	this.elevatorInteriorHeight = 262;
	this.elevatorInteriorScaledHeight = this.elevatorInteriorHeight * this.elevatorScaling;
	this.elevatorInteriorWidth = 188;
	this.elevatorInteriorScaledWidth = this.elevatorInteriorWidth * this.elevatorScaling;

	this.elevatorFloorTravelOverheadMilliseconds = 250;
	this.elevatorFloorTravelMilliseconds = 500;
	
	this.walkHeadAdjustments = [[43,31],[42,31],[40,33],[46,31],[39,31],[39,34],[39,31],[33,31],[40,33],[41,31],[36,31],[43,34],[45,33],[46,33]];
}).apply(constants);

