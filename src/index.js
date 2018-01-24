import Game from './game'

window.game = new Game()

if (module.hot) {
    module.hot.accept()
}
