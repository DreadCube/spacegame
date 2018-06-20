export default class Star {
    game = null

    constructor(game, x, y, r) {
        this.game = game

        this.star = this.game.add.sprite(x, y, 'star')
        this.star.anchor.setTo(0.5, 0.5)
        this.star.width = 8;
        this.star.height = 8;

    
        this.star.update = () => this.update()
    }

    update() {
    	if(this.game.rnd.integerInRange(0, 100) === 100) {
    		this.tweenTint(this.star, '0xffffff', '0x686868', 500)
    	}
    }

    tweenTint(obj, startColor, endColor, time) {
	 	let colorBlend = {step: 0}
	 	let colorTween = this.game.add.tween(colorBlend).to({step: 100}, time)
    	colorTween.onUpdateCallback(() => {      
      		obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)    
      	});
       	obj.tint = startColor
        colorTween.start()
    }

}

