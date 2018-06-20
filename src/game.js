import 'pixi'
import 'p2'
import Phaser from 'phaser'
import Player from './player'
import { Meteor, Star } from './obstacles'
import Ship from './ship'
import Gateway from './gateway'
import ShipGfx from './assets/images/ship.svg'
import SpaceShipGfx from './assets/images/space-ship.svg'
import MeteorGfx from './assets/images/meteor.svg'
import MeteorGfx_1 from './assets/images/earth.svg'
import MeteorGfx_2 from './assets/images/jupiter.svg'
import MeteorGfx_3 from './assets/images/neptune.svg'
import MeteorGfx_4 from './assets/images/jupiter.svg'
import MeteorGfx_5 from './assets/images/pluto.svg'
import MeteorGfx_6 from './assets/images/uranus.svg'
import MeteorGfx_7 from './assets/images/venus.svg'
import StarGfx from './assets/images/star_2.svg'
import LaserGfx from './assets/images/laser.svg'
import BackgroundTrack from './assets/audio/tracks/Mattashi - Lost in Pixels.mp3'
import LaserSfx from './assets/audio/sfx/bullets/laser3.wav'
import RocketSfx from './assets/audio/sfx/bullets/rocket.wav'
import { DEBUG } from './config'
import windowSize from './helpers/windowSize'

export default class Game {
    game = null
    gateway = null
    player = null
    enemies = []
    bullets = []

    constructor() {
        let worldWidth, worldHeight
        if (windowSize.y > windowSize.x) {
            worldWidth = windowSize.x
            worldHeight = windowSize.x / 4 * 3
        } else {
            worldWidth = windowSize.y / 3 * 4
            worldHeight = windowSize.y
        }

        this.game = new Phaser.Game(
            worldWidth,
            worldHeight,
            Phaser.CANVAS,
            'SpaceParty',
            {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this),
                render: this.render.bind(this)
            }
        )

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
       // this.game.time.advancedTiming = DEBUG

        this.game.load.image('ship', SpaceShipGfx || ShipGfx)
        this.game.load.image('meteor', MeteorGfx)
        this.game.load.image('meteor_1', MeteorGfx_1)
        this.game.load.image('meteor_2', MeteorGfx_2)
        this.game.load.image('meteor_3', MeteorGfx_3)
        this.game.load.image('meteor_4', MeteorGfx_4)
        this.game.load.image('meteor_5', MeteorGfx_5)
        this.game.load.image('meteor_6', MeteorGfx_6)
        this.game.load.image('meteor_7', MeteorGfx_7)
        this.game.load.image('star', StarGfx)
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
            enemy.ship.rotation = data.rotation
        } else {
            this.enemies.push(new Ship(this.game, this.gateway, data.x, data.y))
        }
    }

    onFire(data) {
        
        const enemy = this.enemies.find(enemy => enemy.name === data.name)
        if (enemy) {
            // allenfalls noch benötigt
            //enemy.weapons[enemy.selectedWeapon].fireFrom.set(data.x, data.y);
            enemy.weapons[enemy.selectedWeapon].onFire = null
            enemy.weapons[enemy.selectedWeapon].playFireSound()
            enemy.weapons[enemy.selectedWeapon].weapon.fireAtXY(data.mouseX, data.mouseY)
        }
        
    }

    create() {
        const playerSize = this.game.width - this.game.height

        // Arcade Game, daher Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        this.game.stage.backgroundColor = 'black'

        // Player Objekt initialisieren
        this.player = new Player(
            this.game,
            this.gateway,
            playerSize,
            playerSize
        )

       /* for (let i = 0; i < 20; i++) {
            let s = new Ship(this.game, this.gateway, this.game.rnd.integerInRange(100, this.game.width - 100), this.game.rnd.integerInRange(100, this.game.width - 100))
            s.ship.tint = Math.random() * 0xffffff
            s.ship.rotation = this.game.rnd.integerInRange(0, 3)
        }*/

        for(let i = 0; i < 200; i++) {
            new Star(this.game, this.game.rnd.integerInRange(0, this.game.width),
                this.game.rnd.integerInRange(0, this.game.width));
        }

        for (let i = 0; i < 6; i++) {
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
    	this.game.world.forEachAlive((item) => {
    		if(item.name === 'group') {
                item.forEachAlive((obj) => {
                    if(obj.data.bulletManager) {

                        let allPlayers = []
                        allPlayers.push(this.player)
                        allPlayers = allPlayers.concat(this.enemies);
                        allPlayers.forEach(function(player) {
                            if(
                                player.alive &&
                                player.ship.overlap(obj) &&
                                // verhindert Schaden mit eigenen Bullets
                                // renderOrderID scheint eundeutig zu sein.
                                // Falls doch nicht müssten wohl x/y Koordinaten geprüft werden
                                obj.data.bulletManager.trackedSprite.renderOrderID != player.ship.renderOrderID
                            ) {
                                player.onDamage(
                                    obj.data.bulletManager
                                )
                                obj.data.bulletManager.onHit()
                                obj.kill()
                            }
                        })
                    }
                })
            }
    	})
    }

    update() {
        // Kollissionen IMMER Am Schluss prüfen, da Objekte allenfalls zerstört werden können
        this.checkCollisions()
    }

    render() {
        DEBUG &&
            this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00')
    }
}
