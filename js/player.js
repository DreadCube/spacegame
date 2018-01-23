class Player extends Ship {
	constructor(x, y) {
		super(x, y);

		// Controls Initialisieren
		this.buttonW = game.game.input.keyboard.addKey(Phaser.Keyboard.W);

		this.ship.update = this.update.bind(this);

		//this.ship.body.maxAngular = 500;
		//this.ship.body.angularDrag = 50;
	}

	update() {

		if(this.buttonW.isDown) {
			//this.sprite.body.amgularAcceleration += 10;
			//console.log('hier');
			this.ship.rotation = game.game.physics.arcade.accelerateToPointer(this.ship, game.game.input.activePointer, 2000, 1000, 1000);
		//	this.ship.rotation = game.game.physics.arcade.moveToObject(this.ship, game.game.input.activePointer, 600, 300);
			this.ship.rotation -= 1.8;
		} else {
			this.ship.rotation = game.game.physics.arcade.accelerateToPointer(this.ship, game.game.input.activePointer, 0, 1000, 1000);
			this.ship.rotation -= 1.8;
		}


	/*	var speed = 60;
		var msUntilReached = 200;

		if(this.buttonW.isDown) {
			this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, speed, game.game.input.activePointer, msUntilReached);
			//this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, 0, game.game.input.activePointer, 0) - 1.8;
		} else {
			this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, 100, game.game.input.activePointer, 0);
		}*/
	

		/*var tAngle = game.game.math.angleBetween(this.ship.x, this.ship.y, game.game.input.activePointer.x, game.game.input.activePointer.y);
		this.ship.rotation = tAngle;
		this.ship.rotation -= 1.8;*/
	}
}