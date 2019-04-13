import Ball from './components/Ball';
import Paddle from './components/Paddle';
import Game from './game/Game';
import setupListeners from './game/listeners';


var CONFIGS = require('./game/pong-conf.json')


// TODO: Rewrite this 
function getCanvasContext() {
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 480;
    var canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return ctx;
}

// Generate objects for testing 
function getComponents() {
    const pDim = CONFIGS.dimensions.paddle;
    const ballDim = CONFIGS.dimensions.ball; 
    const colors = CONFIGS.colors;
    const ballLoc = CONFIGS.locs.ball; 
    let b = new Ball(ballLoc.x, ballLoc.y, ballDim.radius, -5, 5, colors.ball, ctx);
    let p0 = new Paddle(0, 100, pDim.width, pDim.height, 5, colors.paddle, ctx);
    let p1 = new Paddle(800-7, 200, pDim.width, pDim.height, 5, colors.paddle, ctx);
    return {
        'ball': b,
        'paddle-0': p0,
        'paddle-1': p1
    };
}


let ctx = getCanvasContext();
let objs = getComponents();
let game = new Game('ai-pong', ctx, objs);
setupListeners(game, ctx);


// this is done when the start button is clicked, so not needed
//game.start();