import Weapon from './weapon'

export default class Laser extends Weapon {
    constructor() {
        super('laser', 30)
        this.weapon.bulletSpeed = 2000
        this.weapon.fireRate = 75
    }

    playFireSound() {
        var fx = game.game.add.audio('laser')
        fx.volume = 0.3
        fx.allowMultiple = true
        fx.play()
    }
}
