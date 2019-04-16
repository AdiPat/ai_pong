import Ball from './components/Ball';
import Paddle from './components/Paddle';
import Game from './game/Game';
import setupUI from './game/listeners';
import Player from './game/Player';


let GAME_CONFIG = require('./game/pong-conf.json')


const breakpoints = {
    large: 1024,
    medium: 864,
    msmall: 768,
    small: 560
};

/**
 * Adapts to device screen size
 */
function adaptCanvas(canvas) {
    const canvas_sizes = {
        large: [480, 800],
        medium: [480, 640],
        msmall: [480, window.innerWidth-16],
        small: [320, window.innerWidth-16]
    };

    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = GAME_CONFIG.dimensions.board.width;
    canvas.height = GAME_CONFIG.dimensions.board.height;

    if(w < breakpoints.medium) {
        canvas.height = canvas_sizes.medium[0];
        canvas.width = canvas_sizes.medium[1];
    }

    if(w < breakpoints.msmall) {
        canvas.height = canvas_sizes.msmall[0];
        canvas.width = canvas_sizes.msmall[1];
    }

    if(w < breakpoints.small) {
        canvas.height = canvas_sizes.small[0];
        canvas.width = canvas_sizes.small[1];
    }
    return canvas;
}


/**
 * Initializes canvas
 */
function getCanvasContext() {
    var canvas = document.querySelector('#canvas');
    canvas = adaptCanvas(canvas);
    // alter configs if needed
    GAME_CONFIG.dimensions.board.width = canvas.width;
    GAME_CONFIG.dimensions.board.height = canvas.height;
    console.log(canvas.width, canvas.height);
    let ctx = canvas.getContext('2d');
    return ctx;
}

// adapts objects according to screen size
function adaptConfig(ctx, config) {

    if(ctx.canvas.width < breakpoints.msmall) {
        config.dimensions.ball.radius = 5;
        config.dimensions.paddle.height = 50;
        config.dimensions.paddle.width = 5; 
    }

    return config;
}


let ctx = getCanvasContext();
let config = adaptConfig(ctx, GAME_CONFIG); 
let game = new Game('ai-pong', ctx, config);
window.gameObj = game; // testing
setupUI(game, ctx);

// this is done when the start button is clicked, so not needed
//game.start();