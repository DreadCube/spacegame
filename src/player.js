import Ship from './ship'

export default class Player extends Ship {
    buttonW = null
    buttonS = null
    button1 = null
    button2 = null
    mouseLeft = null

    constructor(game, gateway, x, y) {
        super(game, gateway, x, y)

        // Controls Initialisieren
        this.buttonW = this.game.input.keyboard.addKey(Phaser.KeyCode.W)
        this.buttonS = this.game.input.keyboard.addKey(Phaser.KeyCode.S)
        this.button1 = this.game.input.keyboard.addKey(Phaser.KeyCode.ONE)
        this.button2 = this.game.input.keyboard.addKey(Phaser.KeyCode.TWO)
        this.mouseLeft = this.game.input.mousePointer.leftButton

        this.ship.checkWorldBounds = true;
        this.ship.events.onOutOfBounds.add(this.onOutOfBounds)
       // this.ship.onOutOfBounds = () => this.onOutOfBounds     

    }

    onOutOfBounds(ship) {
        if (ship.x < 0 || ship.x > ship.game.width) {
            ship.x = ship.x > 0 ? 0 : ship.game.width;
        }
        if (ship.y < 0 || ship.y > ship.game.height) {
            ship.y = ship.y > 0 ? 0 : ship.game.height;
        }
    }

    update() {
        super.update();

        // Beschleunigung
        if (this.buttonW.isDown) {
            this.ship.rotation = this.game.physics.arcade.accelerateToPointer(
                this.ship,
                this.game.input.activePointer,
                1500, //speed
                800, //xspeedmax
                800 //yspeedmax
            )
        } else {
            this.ship.body.acceleration.x = 0
            this.ship.body.acceleration.y = 0
        }

        // Bremsen
        if(this.buttonS.isDown) {
            this.ship.body.velocity.x = this.ship.body.velocity.x * 0.95
            this.ship.body.velocity.y = this.ship.body.velocity.y * 0.95
        }

        // Ausrichtung erfolgt immer in Richtung Maus Cursor
        const angle = this.game.math.angleBetween(
            this.ship.x,
            this.ship.y,
            this.game.input.activePointer.x,
            this.game.input.activePointer.y
        )
        this.ship.rotation = angle

        // Weapon Controls
        if (this.button1.isDown) {
            this.selectedWeapon = 0
        }
        if (this.button2.isDown) {
            this.selectedWeapon = 1
        }
        if (this.mouseLeft.isDown) {
            this.weapons[this.selectedWeapon].fire()
        }

        this.gateway.broadcast(this.gateway.MESSAGE_TYPE.POSITION, {
            x: this.ship.x,
            y: this.ship.y,
            angle: angle
        })
    }
}
