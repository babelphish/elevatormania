var people = people || {};

function PersonFactory(building) {
	this.loaded = 0;
	this.building = building; //the building we are creating people in;
}

PersonFactory.prototype.getPerson = function(init) {
	this.loaded++;
	var newPerson = new Person(init, this.building);
	people[this.loaded] = newPerson;
	return newPerson;
}

function Person(init, building) {
	this.building = building;
	this.floor = init.floor != null ? init.floor : 1;
	this.space = init.space != null ? init.space : 1;
	this.facingDirection = init.facingDirection != null ? init.facingDirection : FACING.RIGHT;
	this.pace = init.pace != null ? init.pace : 7;
	
	this.personSprites = game.add.group();	
	this.personSprites.x = this.getXCoordFromSpace(this.space);
	this.personSprites.y = this.getYCoordFromFloor(this.floor);
		
	this.body = game.add.sprite(0, 0, 'person');
	this.head = game.add.sprite(45, constants.headScaledHeight, 'head_danny');
	this.personSprites.add(this.body);
	this.personSprites.add(this.head);
	this.body.scale.setTo(0.75, 0.75);
	this.head.scale.setTo(0.6, 0.6);
	this.walkRight = this.body.animations.add('walk_right', [0,1,2,3,4,5]);
	this.walkLeft = this.body.animations.add('walk_left', [6,7,8,9,10,11]);
	this.lookLeft = this.body.animations.add('look_left', [13]);
	this.lookRight = this.body.animations.add('look_right', [12]);
	this.headRight = this.head.animations.add('look_right', [0]);
	this.headLeft = this.head.animations.add('look_left', [1]);	
	
	this.head.anchor.x = 0.5;
	this.head.anchor.y = 1;	
	
	this.stopAndStand();
}

Person.prototype.walkTo = function(space) {
	var that = this;

	var destinationX = that.getXCoordFromSpace(space);
	var directionFromX = this.compareWithCurrentX(destinationX);

	if (directionFromX === -1) { //we are left of the destinationX
		this.facingDirection = FACING.RIGHT;
	}
	else  if (directionFromX === 1) {
		this.facingDirection = FACING.LEFT;
	}
	else {
		return;
	}

	this.cancelAnimations();
	walkAndStop(destinationX);
	
	function walkAndStop(destinationX) {

		var facingDirectionText = that.getFacingDirectionText();
		that.head.animations.play('look_' + facingDirectionText, 60, false);
		that.bodyAnimation = that.body.animations.play("walk_" + facingDirectionText, that.pace, true);
		that.bodyAnimation.enableUpdate = true;
		that.bodyAnimation.onUpdate.add(function() {
			that.updateHeadPosition();
		});

		var distance = Math.abs(destinationX - that.currentX());
		that.walkTween = game.add.tween(that.personSprites).to( { x: destinationX }, that.travelTimeMilliseconds(distance), Phaser.Easing.Linear.In, true);	
		that.walkTween.onComplete.add(function() {
			that.stopAndStand();
		});
		
		that.updateHeadPosition();
	}
}

Person.prototype.stopAndStand = function() {
	this.cancelAnimations();

	var currentFacingText = this.getFacingDirectionText();	
	this.bodyAnimation = this.body.animations.play('look_' + currentFacingText, 1, false);
	this.head.animations.play('look_' + currentFacingText, 1, false);
	this.updateHeadPosition();
}

Person.prototype.cancelAnimations = function() {
	if (this.bodyAnimation) {
		this.bodyAnimation.stop();
	}	

	if (this.walkTween) {
		this.walkTween.stop();
	}
}

Person.prototype.getFacingDirection = function() {
	return this.facingDirection;
}

//distance is in game pixels
Person.prototype.travelTimeMilliseconds = function(distance) {
	return (distance / (this.pace * 25)) * 1000; 
}

Person.prototype.getFacingDirectionText = function() {
	switch (this.facingDirection) {
		case FACING.LEFT:
			return 'left';
			break;
		case FACING.RIGHT:
			return 'right';
			break;
		defaut:
			throw "We didn't recognize that direction!"
	}
}

Person.prototype.currentX = function() {
	return this.personSprites.position.x;
}

Person.prototype.getYCoordFromFloor = function(floor) {
	return (this.building.getYCoordFromFloor(floor) - constants.personScaledHeight) - (constants.hallwayHeight / 2);
}

Person.prototype.getXCoordFromSpace = function(space) {
	return (this.building.getXCoordFromSpace(space) + (constants.spaceWidth - (constants.personScaledWidth + 12)) / 2); //there's an offset to account for the white space of where a body stands
}

Person.prototype.updateHeadPosition = function() {
	var frameNumber = this.bodyAnimation.frame;
	var adjust = constants.walkHeadAdjustments[frameNumber];
	this.head.x = adjust[0];
	this.head.y = adjust[1];
}

Person.prototype.compareWithCurrentX = function(otherX) {
	var bodyX = this.currentX();
	if (bodyX < otherX) {
		return -1;
	}
	else if (bodyX === otherX) {
		return 0;
	}
	else {
		return 1;
	}
}
