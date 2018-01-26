import 'pixi'
import 'p2'
import Phaser from 'phaser'
import Player from './player'
import { Meteor } from './obstacles'
import Ship from './ship'
import Gateway from './gateway'
import ShipGfx from './assets/images/ship.svg'
import MeteorGfx from './assets/images/meteor.svg'
import LaserGfx from './assets/images/laser.svg'
import BackgroundTrack from './assets/audio/tracks/Mattashi - Lost in Pixels.mp3'
import LaserSfx from './assets/audio/sfx/bullets/laser3.wav'
import RocketSfx from './assets/audio/sfx/bullets/rocket.wav'

export default class Game {
    game = null
    gateway = null
    player = null
    enemies = []
    bullets = []

    constructor() {
        this.game = new Phaser.Game(900, 900, Phaser.CANVAS, 'SpaceParty', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        })

        this.game.bullets = []
    }

    preload() {
        // WebRTC initialisieren
        this.gateway = new Gateway()
        this.gateway.on(this.gateway.ACTIONS.POSITION, data =>
            this.onPosition(data)
        )
        this.gateway.on(this.gateway.ACTIONS.FIRE, data => this.onFire(data))

        // Debug -> FPS Anzeige
        this.game.time.advancedTiming = true

        this.game.load.image('ship', ShipGfx)
        this.game.load.image('meteor', MeteorGfx)
        this.game.load.image('laser', LaserGfx)

        this.game.load.audio('backgroundMusic', BackgroundTrack)
        this.game.load.audio('laser', LaserSfx)
        this.game.load.audio('rocket', RocketSfx)
    }

    onPosition(data) {
        const enemy = this.enemies.find(enemy => enemy.name === data.name)
        if (enemy) {
            enemy.ship.x = data.x
            enemy.ship.y = data.y
        } else {
            this.enemies.push(new Ship(this.game, this.gateway, data.x, data.y))
        }
    }

    onFire(data) {
        /*
        const enemy = this.enemies.find(enemy => enemy.name === data.name)
        if (enemy) {
            const bullet = this.bullets.getFirstDead()
            bullet.reset(enemy.ship.x, enemy.ship.y)
            bullet.rotation = this.game.physics.arcade.moveToObject(
                bullet,
                enemy.ship,
                500
            )
        }
        */
    }

    create() {
        // Arcade Game, daher Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        this.game.stage.backgroundColor = 'black'

        // Player Objekt initialisieren
        this.player = new Player(this.game, this.gateway, 300, 300)

        for (let i = 0; i < 3; i++) {
            new Meteor(
                this.game,
                this.game.rnd.integerInRange(100, this.game.width - 100),
                this.game.rnd.integerInRange(100, this.game.height - 100)
            )
        }

        //Kamera folgt dem Spieler
        //this.player.ship.fixedToCamera = true;

        //
        //this.game.camera.follow(this.player.ship);
        //this.player.anchor.setTo(0.5, 1);

        const music = this.game.add.audio('backgroundMusic')
        music.allowMultiple = false
        music.volume = 0.4
        music.play()
    }

    checkCollisions() {
        this.game.world.forEachAlive(
            function(item) {
                if (item.name === 'group') {
                    item.forEachAlive(
                        function(obj) {
                            // Für jedes Bullet Objekt
                            if (obj.data.bulletManager) {
                                if (
                                    this.player.alive &&
                                    this.player.ship.overlap(obj)
                                ) {
                                    this.player.onDamage(obj.data.bulletManager)
                                    //@todo: Damage von eigenen Waffen sollte verhindert werden
                                    // Wahrscheinlich möglich über weapon.trackedSprite
                                    obj.data.bulletManager.onHit() //bulletManager entspricht Weapon Klasse
                                    obj.kill()
                                }
                                this.enemies.forEach(
                                    function(enemy) {
                                        if (
                                            enemy.alive &&
                                            enemy.ship.overlap(obj)
                                        ) {
                                            enemy.onDamage(
                                                obj.data.bulletManager
                                            )
                                            obj.data.bulletManager.onHit()
                                            obj.kill()
                                        }
                                    }.bind(this)
                                )
                            }
                        }.bind(this)
                    )
                }
            }.bind(this)
        )
    }

    update() {
        // Kollissionen IMMER Am Schluss prüfen, da Objekte allenfalls zerstört werden können
        this.checkCollisions()
    }

    render() {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00')
    }
}
