import Ball from '../components/Ball';
import Paddle from "../components/Paddle";
import Player from "./Player";
import { playSound } from "./utils";

export default class Game {

    /**
     * @param {string} name - The name of the game 
     * @param {CanvasRenderingContext2D} ctx - Canvas Context object for rendering
     * @param {Object} objects - Game components to be drawn
     * @param {Object} config - Game configurations
     */
    constructor(name, ctx, config) {
        this.name = name;
        this.canvasCtx = ctx;
        this.config = config;
        this.objects = this.generateObjectsFromConfig();
        this.paused = false;
        this.max_counter = config.score_counter;
        this.counter = 0; // no. of turns for which score is unchanged
        this.score = [0, 0];
        this.type = config.game_type_keys["AI mode"];
        this.player = new Player(this, 2, config.game_type[this.type], [config.keys.p0, config.keys.p1]);
    }

    /**
    * Generates game objects, TODO: this should go into Game
    */
    generateObjectsFromConfig() {
        const CONFIGS = this.config;
        const pDim = CONFIGS.dimensions.paddle;
        const boardDim = CONFIGS.dimensions.board;
        const ballDim = CONFIGS.dimensions.ball;
        const colors = CONFIGS.colors;
        const ballLoc = CONFIGS.locs.ball;
        const locs = CONFIGS.locs;
        const ballSpeed = CONFIGS.speed.ball;
        const pSpeed = CONFIGS.speed.p0;
        let b = new Ball(ballLoc.x, ballLoc.y, ballDim.radius, ballSpeed.x, ballSpeed.y, colors.ball, this.canvasCtx);
        let p0 = new Paddle(locs.p0.x, locs.p0.y, pDim.width, pDim.height, pSpeed.y, colors.paddle, this.canvasCtx);
        let p1 = new Paddle(locs.p1.x, locs.p1.y, pDim.width, pDim.height, pSpeed.y, colors.paddle, this.canvasCtx);
        return {
            'ball': b,
            'paddle-0': p0,
            'paddle-1': p1
        };
    }

    debug() {
        // to see shadow ball in action
        this.objects['ball_shadow'].color = 'cyan';
    }
    /**
     * Updates all objects
     */
    update() {
        //this.debug();
        Object.keys(this.objects).forEach((k) => {
            let curObj = this.objects[k];
            curObj.move();
        });
    }

    /** 
     * Changes game mode to 1P, 2P, AI 
    */
    changeMode(game_type) {
        this.type = game_type;
        this.player = new Player(this, 2, this.config.game_type[game_type], [this.config.keys.p0, this.config.keys.p1]);
        setTimeout(() => { this.player.resetNPC() }, 1000);
    }

    /**
     * Clears board for re-drawing
     */
    clearBoard() {
        const ctx = this.canvasCtx;
        const canvas = this.canvasCtx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#1b1b1c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw dottted line
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.setLineDash([5,10]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        //ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);
    }

    /**
     * Renders all game objects
     */
    render() {
        this.clearBoard();

        const ctx = this.canvasCtx;
        const canvas = this.canvasCtx.canvas;
        // render scores
        ctx.font = this.config.font;
        //ctx.fillStyle = this.config.colors.score;
        ctx.fillStyle = "white";
        ctx.fillText(`${this.score[0]}`, (1 / 4) * canvas.width, 40);
        ctx.fillText(`${this.score[1]}`, (3 / 4) * canvas.width, 40);

        Object.keys(this.objects).forEach((k) => {
            let curObj = this.objects[k];
            curObj.render();
        });
    }

    /**
     * Updates score depending on direction of the ball
     */
    updateScore() {
        const ball = this.objects['ball']
        let pid = (ball.speedX > 0) ? 0 : 1; // ball is moving towards left
        this.score[pid] += 1;
        console.log(this.score);
    }

    /**
     * Checks for collisions and peforms the necessary adjustments
     */
    detectCollisions() {
        const ball = this.objects['ball'];
        const p0 = this.objects['paddle-0'];
        const p1 = this.objects['paddle-1'];

        const xlimit = this.canvasCtx.canvas.width;
        const ylimit = this.canvasCtx.canvas.height;

        let check_ball_collisions = function (ball, p0, p1, xlimit, ylimit, isShadow = false) {
            if (!isShadow) {
                const boost = (this.counter) >= (this.max_counter*2);

                // add a small error to smooth out animations
                if((ball.x - ball.radius <= p0.width) && (ball.y >= (p0.y - 5) && ball.y <= (p0.y + p0.height + 5))) {
                    // left paddle
                    playSound(this.config.audio.bounce);
                    //console.log(this.counter, this.max_counter*2, boost);
                    ball.collision(p0, 6, boost);
                    this.counter = (boost)?(1):(this.counter + 1);
                    this.player.resetNPCByID(0);
                }
                else if((ball.x + ball.radius >= xlimit-p1.width) && (ball.y > (p1.y - 5) && ball.y < p1.y + (p1.height+5))) {
                    playSound(this.config.audio.bounce);
                    //console.log(this.counter, this.max_counter*2, boost);
                    ball.collision(p1, 6, boost);
                    this.counter = (boost)?(1):(this.counter + 1);
                    this.player.resetNPCByID(1);
                }
                else if((ball.x + ball.radius >= xlimit) || (ball.x - ball.radius <= 0)) {
                        // play sound
                        playSound(this.config.audio.fail);
                        // update score
                        this.updateScore();
                        // reset ball and npc
                        ball.reset(1000);
                        this.player.resetNPC(1000);
                }
            }

            // ball and vertical bounds
            if((ball.y + ball.radius >= ylimit)) {
                ball.setLoc(ball.x, ylimit - 1.5 * ball.radius);
                ball.setSpeed(ball.speedX, -ball.speedY);
            }
            else if((ball.y - ball.radius <= 0)) {
                ball.setLoc(ball.x, 0+ 1.5*ball.radius);
                ball.setSpeed(ball.speedX, -ball.speedY);
            }
        }.bind(this);

        check_ball_collisions(ball, p0, p1, xlimit, ylimit);

        if (this.player.isNPCPresent())
            check_ball_collisions(this.objects['ball_shadow'], p0, p1, xlimit, ylimit, true);


        /* 
         * Ideally this should be in the Paddle class
         * as it checks if the paddle is within bounds considering paddle height.
         * The base class only checks if the point is within bounds.
         */
        if (p0.y + p0.height >= ylimit) {
            p0.setLoc(0, ylimit - p0.height);
        }
        if (p0.y <= 0) {
            p0.setLoc(0, 0);
        }

        if (p1.y + p1.height >= ylimit) {
            p1.setLoc(xlimit - p1.width, ylimit - p1.height);
        }

        if (p1.y <= 0) {
            p1.setLoc(xlimit - p1.width, 0);
        }
    }

    /**
     * Game loop
     */
    loop() {
        if (!this.paused) {
            this.detectCollisions();
            // if npc exists, perform npc movements
            this.player.types.forEach((v, idx) => {
                if (!v) {
                    let controls = this.player.getNPCControls();
                    this.player.npc[idx].control(controls);
                }
            });
            this.update();
            this.render();
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * Initializes keys
     */
    init() {
        const KEY_SPACE = this.config.keys.general.space; // temp 
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == KEY_SPACE) {
                // check if the game has been started first
                console.log("SPACE")
                if(!this.paused) 
                    this.pause();
                else 
                    this.resume();

            }
        });
    }

    /**
     * Starts the game
     */
    start() {
        this.init();
        requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * @param {string} game_type Type of game: {P1,P2,AI}
     * Restarts game with a new game type
     */
    restart(game_type = "AI") {
        this.score = [0, 0];
        this.objects.ball.reset();
        this.objects['paddle-0'].reset();
        this.objects['paddle-1'].reset();
        this.changeMode(game_type);
    }

    pause() {
        const menuElem = document.querySelector('.menu-box');
        if (!this.paused) {
            menuElem.style.zIndex = '500';
            menuElem.style.opacity = '1';
        }
        this.paused = true;
    }

    resume() {
        const menuElem = document.querySelector('.menu-box');
        if (this.paused) {
            menuElem.style.zIndex = '-10';
            menuElem.style.opacity = '0';
        }
        this.paused = false;
    }

}