class Game {
	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'SpaceParty', {
			preload: this.preload.bind(this),
			create: this.create.bind(this),
			update: this.update.bind(this),
			render: this.render.bind(this)
		});
	}

	preload() {
		this.game.load.image('ship', 'assets/sprites/ship.png');
		this.game.load.path = 'assets/particlestorm/particles/';
		this.game.load.images(['flare_point', 'bullet', 'block3', 'block4', '4x4']);
	}

	create() {


	    this.emitter = this.game.add.emitter(0, 0, 100);
	    this.emitter.makeParticles('4x4');
	    this.emitter.gravity = 100;


		// Arcade Game, daher Arcade Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.stage.backgroundColor = 'black';


		this.player = this.game.add.sprite(64, 64, 'ship');
		this.player.anchor.setTo(0.5, 1);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.player.body.allowRotation = false;
	}

	update() {
		this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 60, this.game.input.activePointer, 500);
		this.player.rotation = this.player.rotation - 1.8;

		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		
		//this.emitter.setRotation(this.player.rotation, this.player.rotation);
		this.emitter.start(true, 500, null, 1);
	}

	render() {
		this.game.debug.spriteInfo(this.player, 32, 32);
	}

	getRotated(cx, cy, x, y, angle) {
	    var radians = (Math.PI/180) * angle;
	    var translatedX = (x - cx) * Math.cos(radians) - (y - cy) * Math.sin(radians) + cx;
	    var translatedY = (x - cx) * Math.sin(radians) - (y - cy) * Math.cos(radians) + cy;
	    return {x: parseInt(translatedX), y: parseInt(translatedY)};
	}
}