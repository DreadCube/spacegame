class Game {
	constructor() {
		this.game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'SpaceParty', {
			preload: this.preload.bind(this),
			create: this.create.bind(this),
			update: this.update.bind(this),
			render: this.render.bind(this)
		});

		Phaser.Plugin.SaveCPU();
	}

	preload() {
		this.game.time.advancedTiming = true;
		this.game.load.image('ship', 'assets/sprites/ship32x32.svg');
		this.game.load.image('meteor', 'assets/sprites/meteor.svg');
	}

	create() {

		// Arcade Game, daher Arcade Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.stage.backgroundColor = 'black';

		// Player Objekt initialisieren
		this.player = new Ship(64, 64);

		new Meteor(5, 5);
		new Meteor(300, 400);
		//Kamera folgt dem Spieler
		//this.player.ship.fixedToCamera = true;

		// 
		//this.game.camera.follow(this.player.ship);
		//this.player.anchor.setTo(0.5, 1);




	}

	update() {
		//this.player.ship.body.setZeroVelocity();
	}

	render() {
		this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");   
	}
}