import Ship from './ship'

export default class Player extends Ship {
    constructor(x, y) {
        super(x, y)
        console.log(Phaser.KeyCode)
        // Controls Initialisieren
        this.buttonW = game.game.input.keyboard.addKey(Phaser.KeyCode.W)
        this.buttonS = game.game.input.keyboard.addKey(Phaser.KeyCode.S)
        this.button1 = game.game.input.keyboard.addKey(Phaser.KeyCode.ONE)
        this.button2 = game.game.input.keyboard.addKey(Phaser.KeyCode.TWO)
        this.mouseLEFT = game.game.input.mousePointer.leftButton

        this.ship.update = this.update.bind(this)
    }

    update() {
        // Beschleunigung
        if (this.buttonW.isDown) {
            this.ship.rotation = game.game.physics.arcade.accelerateToPointer(
                this.ship,
                game.game.input.activePointer,
                2000,
                1000,
                1000
            )
            this.ship.rotation -= 1.8
        } else {
            // Bremsvorgang
            // Abklärungsbedarf:
            // Ist Bremsbutton nötig? evtl. auch cool wenn automatisch gebremst wird
            //if(this.buttonS.isDown) {
            this.ship.body.acceleration.x = 0
            this.ship.body.acceleration.y = 0
            this.ship.body.velocity.x = this.ship.body.velocity.x * 0.95
            this.ship.body.velocity.y = this.ship.body.velocity.y * 0.95
        }

        // Ausrichtung erfolgt immer in Richtung Maus Cursor
        var tAngle = game.game.math.angleBetween(
            this.ship.x,
            this.ship.y,
            game.game.input.activePointer.x,
            game.game.input.activePointer.y
        )
        this.ship.rotation = tAngle
        this.ship.rotation -= 1.8

        // Weapon Controls
        if (this.button1.isDown) {
            this.weaponSelectIndex = 0
        }
        if (this.button2.isDown) {
            this.weaponSelectIndex = 1
        }
        if (this.mouseLEFT.isDown) {
            this.weapons[this.weaponSelectIndex].fire()
        }
    }
}
