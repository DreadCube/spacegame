export default class Meteor {
    game = null
    meteor = null

    constructor(game, x, y, r) {
        this.game = game

        this.meteor = this.game.add.sprite(x, y, 'meteor')
    }
}
