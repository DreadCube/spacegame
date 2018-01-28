import Weapon from './weapon'

export default class Rocket extends Weapon {
    constructor(game, gateway) {
        super(game, gateway, 'laser', 1)

        this.weapon.bulletSpeed = 500
        this.weapon.fireRate = 100
        this.weapon.damage = 5

        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN
        this.weapon.bulletLifespan = 2000
    }

    playFireSound() {
        const fx = this.game.add.audio('rocket')
        fx.volume = 0.3
        fx.allowMultiple = true
        fx.play()
    }

    onFire(bullet, weapon) {
        super.onFire(bullet, weapon)
        bullet.body.gravity.x = bullet.body.gravity.y = 100
        bullet.update = () => this.update()
    }

    update() {
        if (this.game.enemies.length === 0) {
            return
        }

        this.game.physics.arcade.moveToObject(
            bullet,
            this.game.enemies[0].ship,
            this.weapon.bulletSpeed
        )
    }
}
