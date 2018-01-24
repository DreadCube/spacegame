import 'pixi'
import 'p2'
import Phaser from 'phaser'
import Player from './player'
import { Meteor } from './obstacles'
import Ship from './ship'
import ShipGfx from './assets/images/ship.svg'
import MeteorGfx from './assets/images/meteor.svg'
import LaserGfx from './assets/images/laser.svg'
import BackgroundTrack from './assets/audio/tracks/Allan Haapalainen - A Journey Through Space (8-bit Music).mp3'
import LaserSfx from './assets/audio/sfx/bullets/laser3.wav'
import Gateway from './gateway'

export default class Game {
    constructor() {
        this.game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'SpaceParty', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        })
    }

    preload() {
        // WebRTC initialisieren
        const gateway = new Gateway()
        gateway.on(gateway.MESSAGE_TYPE.POSITION, data => this.onPosition(data))
        gateway.on(gateway.MESSAGE_TYPE.FIRE, data => this.onFire(data))

        // Debug -> FPS Anzeige
        this.game.time.advancedTiming = true

        this.game.load.image('ship', ShipGfx)
        this.game.load.image('meteor', MeteorGfx)
        this.game.load.image('laser', LaserGfx)

        this.game.load.audio('backgroundMusic', BackgroundTrack)
        this.game.load.audio('laser', LaserSfx)
    }

    onPosition(data) {
        // TODO: Implementieren
        console.log('Position update', data)
    }

    onFire(data) {
        // TODO: Implementieren
        console.log('Fire', data)
    }

    create() {
        // Arcade Game, daher Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        this.game.stage.backgroundColor = 'black'

        // Player Objekt initialisieren
        this.player = new Player(300, 300)

        new Meteor(5, 5)
        new Meteor(300, 400)

        this.enemies = []
        for (var i = 0; i < 5; i++) {
            this.enemies.push(new Ship(500, 500))
        }
        //Kamera folgt dem Spieler
        //this.player.ship.fixedToCamera = true;

        //
        //this.game.camera.follow(this.player.ship);
        //this.player.anchor.setTo(0.5, 1);

        var music = this.game.add.audio('backgroundMusic')
        music.allowMultiple = false
        music.play()
    }

    update() {
        for (var i = 0; i < this.enemies.length; i++) {
            // Random Enemies. Für Testzwecke
            if (game.game.rnd.integerInRange(0, 100) == 10) {
                this.enemies[
                    i
                ].ship.rotation = this.game.physics.arcade.moveToXY(
                    this.enemies[i].ship,
                    game.game.rnd.integerInRange(0, 1920),
                    game.game.rnd.integerInRange(0, 1080),
                    10,
                    3000
                )
                this.enemies[i].ship.rotation -= 1.8
            }
            if (game.game.rnd.integerInRange(0, 100) == 8) {
                this.enemies[i].weapons[0].fire()
            }
            if (game.game.rnd.integerInRange(0, 10) == 6) {
                this.enemies[i].ship.tint = Math.random() * 0xffffff
            }
        }
    }

    render() {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00')
    }
}
