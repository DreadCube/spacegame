import Ship from './ship'

export default class Player extends Ship {
    accelerate = null
    break = null
    weapon1 = null
    weapon2 = null
    fire = null
    speed = 50

    constructor(game, gateway, x, y) {
        super(game, gateway, x, y)

        // Controls Initialisieren
        this.accelerate = this.game.input.keyboard.addKey(Phaser.KeyCode.W)
        this.break = this.game.input.keyboard.addKey(Phaser.KeyCode.S)
        this.weapon1 = this.game.input.keyboard.addKey(Phaser.KeyCode.ONE)
        this.weapon2 = this.game.input.keyboard.addKey(Phaser.KeyCode.TWO)
        this.fire = this.game.input.mousePointer.leftButton
    }

    update() {
        super.update()

        // Beschleunigung
        if (this.accelerate.isDown) {
            this.speed = Math.min(500, this.speed * 1.05)
        }

        // Bremsen
        if (this.break.isDown) {
            this.speed = Math.max(50, this.speed * 0.95)
        }

        // Ausrichtung erfolgt immer in Richtung Maus Cursor
        const angle = this.game.math.angleBetween(
            this.ship.x,
            this.ship.y,
            this.game.input.activePointer.x,
            this.game.input.activePointer.y
        )
        this.ship.rotation = angle

        this.ship.rotation = this.game.physics.arcade.moveToObject(
            this.ship,
            this.game.input.activePointer,
            this.speed
        )

        this.gateway.broadcast(this.gateway.ACTIONS.POSITION, {
            x: this.ship.x,
            y: this.ship.y,
            rotation: angle
        })

        // Weapon Controls
        if (this.weapon1.isDown) {
            this.selectedWeapon = 0
        }
        if (this.weapon2.isDown) {
            this.selectedWeapon = 1
        }
        if (this.fire.isDown) {
            this.weapons[this.selectedWeapon].fire()
        }
    }
}
