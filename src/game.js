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
    enemyBullets = []

    constructor() {
        this.game = new Phaser.Game(900, 900, Phaser.CANVAS, 'SpaceParty', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        })

        this.game.bullets = [];
    }

    preload() {
        // WebRTC initialisieren
        this.gateway = new Gateway()
        this.gateway.on(this.gateway.MESSAGE_TYPE.POSITION, data =>
            this.onPosition(data)
        )
        this.gateway.on(this.gateway.MESSAGE_TYPE.FIRE, data =>
            this.onFire(data)
        )

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
        this.player = new Player(this.game, this.gateway, 300, 300)

        for(let i = 0; i < 3; i++) {
	        new Meteor(
	        	this.game,
	        	this.game.rnd.integerInRange(100, this.game.width - 100),
	        	this.game.rnd.integerInRange(100, this.game.height - 100),
	        )   	
        }


        this.enemies = []
        for (let i = 0; i < 2; ++i) {
            this.enemies.push(new Ship(this.game, this.gateway, 500, 500))
        }
        // Vorerst Workaround -> Siehe rocket.js 
        this.game.enemies = this.enemies;

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
        this.game.world.forEachAlive(function(item) {
            if(item.name === 'group') {
                item.forEachAlive(function(obj) {
                	// Für jedes Bullet Objekt
                    if(obj.data.bulletManager) {
                        if(this.player.alive && this.player.ship.overlap(obj)) {
                            this.player.onDamage(obj.data.bulletManager)
                            //@todo: Damage von eigenen Waffen sollte verhindert werden
                            // Wahrscheinlich möglich über weapon.trackedSprite
                            obj.data.bulletManager.onHit();      //bulletManager entspricht Weapon Klasse              
                            obj.kill()
                        }
                        this.enemies.forEach(function(enemy) {
                        	if (enemy.alive && enemy.ship.overlap(obj)) {
                        		enemy.onDamage(obj.data.bulletManager)
                        		obj.data.bulletManager.onHit();
                        		obj.kill()
                        	}
                        }.bind(this));
                    }
                }.bind(this))
            }
        }.bind(this))
    }

    update() {
        
        for (let i = 0, len = this.enemies.length; i < len; ++i) {
        	if(!this.enemies[i].ship.body) {
        		this.enemies[i] = new Ship(this.game, this.gateway, this.game.rnd.integerInRange(0, this.game.width), this.game.rnd.integerInRange(0, this.game.height))
        		continue;
        	}
            // Random Enemies. Für Testzwecke
            if (this.game.rnd.integerInRange(0, 100) == 10) {
                this.enemies[
                    i
                ].ship.rotation = this.game.physics.arcade.moveToXY(
                    this.enemies[i].ship,
                    this.game.rnd.integerInRange(0, this.game.width),
                    this.game.rnd.integerInRange(0, this.game.height),
                    10,
                    3000
                )
                this.enemies[i].ship.rotation -= 1.8
            }
            if (this.game.rnd.integerInRange(0, 100) == 8) {
                this.enemies[i].weapons[0].fire()
            }
            if (this.game.rnd.integerInRange(0, 10) == 6) {
                this.enemies[i].ship.tint = Math.random() * 0xffffff
            }
        }
        
        // Kollissionen IMMER Am Schluss prüfen, da Objekte allenfalls zerstört werden können
        this.checkCollisions()
    }

    render() {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00')
    }
}
