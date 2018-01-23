class Player extends Ship {
	constructor(x, y) {
		super(x, y);



		// Controls Initialisieren
		this.buttonW = game.game.input.keyboard.addKey(Phaser.Keyboard.W);

		this.ship.update = this.update.bind(this);
		this.ship.body.acceleration.x = 4;
		this.ship.body.acceleration.y = 4;
		this.ship.body.maxVelocity.x = 500;
		this.ship.body.maxVelocity.y = 500;
	}

	update() {
		this.ship.x++;
		/*if(this.buttonW.isDown) {
			this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, 2000);
			
		} else {
			this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, 200, game.game.input.activePointer, 0);
		}
		this.ship.rotation = this.ship.rotation - 1.8;*/


	}

	accelerateToObject(obj1, obj2, speed) {
	    if (typeof speed === 'undefined') { speed = 60; }
	    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
	    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
	    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
	    obj1.body.force.y = Math.sin(angle) * speed;
	}
}
