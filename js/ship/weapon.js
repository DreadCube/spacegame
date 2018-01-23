class Weapon {
	
	constructor(type, ammo, x, y) {
		this.weapon = game.game.add.weapon(ammo, type);

		// Bullet wird zerstört sobald Welt verlassen
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.trackRotation = true;

		this.weapon.onFire.add(this.onFire.bind(this));
	}

	reload() {

	}

	fire() {
		this.weapon.fire();
		console.log(this.weapon.bullets);
	}

	onFire(bullet, weapon) {
		this.playFireSound();
		// @todo für später (WICHTIG FÜR MULTIPLAYER): Eigentlich sollte hier keine direkte Referenz auf Maus gelegt werden
		// Feuerungsrichtung anhand Attached Objekt berechnen
		game.game.physics.arcade.moveToPointer(bullet, this.weapon.bulletSpeed);
		console.log('playsound');
	}

	attachTo(obj, offsetX, offsetY) {
		this.weapon.trackSprite(obj, offsetX, offsetY, true);
	}
}