export default class Weapon {
    game = null
    gateway = null
    weapon = null

    constructor(game, gateway, type, ammo, x, y) {
        this.game = game
        this.gateway = gateway

        this.weapon = this.game.add.weapon(ammo, type)

        // Bullet wird zerstört sobald Welt verlassen
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.weapon.trackRotation = true

        this.weapon.onFire.add(this.onFire.bind(this))
        this.weapon.onHit = this.onHit.bind(this)
    }

    reload() {}

    fire() {
        this.weapon.fire()
    }

    onFire(bullet, weapon) {
        this.playFireSound()
        // @todo für später (WICHTIG FÜR MULTIPLAYER): Eigentlich sollte hier keine direkte Referenz auf Maus gelegt werden
        // Feuerungsrichtung anhand Attached Objekt berechnen
        this.game.physics.arcade.moveToPointer(bullet, this.weapon.bulletSpeed)

        this.gateway.broadcast(this.gateway.MESSAGE_TYPE.FIRE, {
            x: bullet.position.x,
            y: bullet.position.y,
            angle: bullet.rotation
        })
    }

    onHit() {
    }

    attachTo(obj, offsetX, offsetY) {
        this.weapon.trackSprite(obj, offsetX, offsetY, true)
    }
}
