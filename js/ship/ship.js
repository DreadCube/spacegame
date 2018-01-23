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
	}
}