class Ship {

	constructor(x, y) {

		this.health = 100;
		this.armor = 100;
		this.weapons = [];

		this.ship = game.game.add.sprite(x, y, 'ship');
		this.ship.anchor.setTo(0.5, 1);

		// Arcade Physics auf Schiff anwenden
		game.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

		this.ship.body.allowRotation = false;

		this.ship.update = this.update.bind(this);


	}

	update() {
		this.ship.rotation = game.game.physics.arcade.moveToPointer(this.ship, 60, game.game.input.activePointer, 200);
		this.ship.rotation = this.ship.rotation - 1.8;
	}
}