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
	this.walkHeadAdjustments = [[43,31],[42,31],[40,33],[46,31],[39,31],[39,34],[39,31],[33,31],[40,33],[41,31],[36,31],[43,34],[45,33],[46,33]];
}).apply(constants);

