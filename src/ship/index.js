import Laser from './laser'
import Rocket from './rocket'
import HealthBar from '../helpers/healthbar.js'

export default class Ship {
    game = null
    gateway = null
    alive = true
    health = 10
    startHealth = 10
    weapons = []
    selectedWeapon = 0
    ship = null

    constructor(game, gateway, x, y) {
        this.game = game
        this.gateway = gateway

        this.ship = this.game.add.sprite(x, y, 'ship')
        this.ship.anchor.setTo(0.5, 0.5)


        // @todo: Healthbar kann allenfalls ins Player Objekt verschoben werden,
        // wenn Healthbar von fremden Spielern / Schiffen nicht angezeigt werden muss
        this.healthbar = new HealthBar(game, {
            x,
            y,
            width: 32,
            height: 4,
            bg: {
                color: '#000000',
            },
            bar: {
                color: '#ffffff'
            },
            animationDuration: 100
        })
        this.healthbar.setPercent(100)

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

    onOutOfBounds(ship) {
        if (ship.x < 0 || ship.x > ship.game.width) {
            ship.x = ship.x > 0 ? 0 : ship.game.width
        }
        if (ship.y < 0 || ship.y > ship.game.height) {
            ship.y = ship.y > 0 ? 0 : ship.game.height
        }
    }

    update() {
        this.healthbar.setPosition(this.ship.position.x - 8, this.ship.position.y - 48)

    }

    onDamage(weapon) {
        console.log('sd')
        this.health -= weapon.damage
        this.healthbar.setPercent((100 / this.startHealth) * this.health)

        this.gateway.broadcast(this.gateway.ACTIONS.DAMAGE, {
            damage: true
        })

        if (this.health <= 0) {
            this.alive = false
            this.ship.destroy()
            //this.healthBar.kill()
            this.game.camera.shake(0.05, 300)
        }
        return !this.alive
    }


    // @todo: Nicht im Einsatz?? Allenfalls löschen
    damage(weapon) {
        this.health -= 1

        if (this.health <= 0) {
            this.alive = false
            this.ship.kill()
        }

        return !this.alive
    }
}
