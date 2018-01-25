import Weapon from './weapon'

export default class Laser extends Weapon {
    constructor(game, gateway) {
        super(game, gateway, 'laser', 30)

        this.weapon.bulletSpeed = 2000
        this.weapon.fireRate = 75
    }

    playFireSound() {
        const fx = this.game.add.audio('laser')
        fx.volume = 0.3
        fx.allowMultiple = true
        fx.play()
    }
}
