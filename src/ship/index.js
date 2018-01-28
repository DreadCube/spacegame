import Laser from './laser'
import Rocket from './rocket'

export default class Ship {
    game = null
    gateway = null
    alive = true
    health = 10
    weapons = []
    selectedWeapon = 0
    ship = null

    constructor(game, gateway, x, y) {
        this.game = game
        this.gateway = gateway

        this.ship = this.game.add.sprite(x, y, 'ship')
        this.ship.anchor.setTo(0.5, 0.5)

        this.healthBar = this.game.add.text(x, y, this.health, {
            font: 'bold 10px Arial',
            fill: '#fff'
        })

        // Arcade Physics auf Schiff anwenden
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE)

        this.ship.body.allowRotation = false

        const laser = new Laser(game, gateway)
        // Laser Weapon anbinden an Schiff
        laser.attachTo(this.ship, 32, 0)
        this.weapons[0] = laser

        const rocket = new Rocket(game, gateway)
        // Rocket Weapon anbinden an Schiff
        rocket.attachTo(this.ship, 32, 0)
        this.weapons[1] = rocket

        this.ship.update = () => this.update()
    }

    update() {
        this.healthBar.position.x = this.ship.position.x - 8
        this.healthBar.position.y = this.ship.position.y - 8
        this.healthBar.setText(this.health)
    }

    onDamage(weapon) {
        this.health -= weapon.damage
        if (this.health <= 0) {
            this.alive = false
            this.ship.destroy()
            this.healthBar.destroy()
            this.game.camera.shake(0.05, 300)
        }
        return !this.alive
    }

    damage(weapon) {
        this.health -= 1

        if (this.health <= 0) {
            this.alive = false
            this.ship.kill()
        }

        return !this.alive
    }
}
