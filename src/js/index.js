import Ball from './components/Ball';
import Paddle from './components/Paddle';
import Game from './game/Game';
import setupUI from './game/listeners';
import Player from './game/Player';


const GAME_CONFIG = require('./game/pong-conf.json')

/**
 * Initializes canvas
 */
function getCanvasContext() {
    const CANVAS_WIDTH = GAME_CONFIG.dimensions.board.width;
    const CANVAS_HEIGHT = GAME_CONFIG.dimensions.board.height;
    var canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return ctx;
}


let ctx = getCanvasContext();
let game = new Game('ai-pong', ctx, GAME_CONFIG);
setupUI(game, ctx);

// this is done when the start button is clicked, so not needed
//game.start();