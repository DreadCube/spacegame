class Ship {

	constructor(x, y) {

		this.health = 100;
		this.armor = 100;
		this.weapons = [];

		this.weaponSelectIndex = 0;

		
		this.ship = game.game.add.sprite(x, y, 'ship');
		this.ship.anchor.setTo(0.5, 1);

		// Arcade Physics auf Schiff anwenden
		game.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

		this.ship.body.allowRotation = false;

		var laser = new Laser();
		// Laser Weapon anbinden an Schiff
		laser.attachTo(this.ship, 0, 0);
		this.weapons[0] = laser;
	}
}