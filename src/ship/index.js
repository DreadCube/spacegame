import Laser from './laser'

export default class Ship {
    game = null
    gateway = null
    alive = true
    health = 100
    weapons = []
    selectedWeapon = 0
    ship = null

    constructor(game, gateway, x, y) {
        this.game = game
        this.gateway = gateway

        this.ship = this.game.add.sprite(x, y, 'ship')
        this.ship.anchor.setTo(0.5, 1)

        // Arcade Physics auf Schiff anwenden
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE)

        this.ship.body.allowRotation = false

        const laser = new Laser(game, gateway)
        // Laser Weapon anbinden an Schiff
        laser.attachTo(this.ship, 0, 0)
        this.weapons[0] = laser
    }

    damage() {
        this.health -= 1

        if (this.health <= 0) {
            this.alive = false
            this.ship.kill()
        }

        return !this.alive
    }
}
