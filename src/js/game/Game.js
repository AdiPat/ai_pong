import Paddle from "../components/Paddle";
import Player from "./Player";
import { playSound } from "./utils";

export default class Game {

    /**
     * @param {string} name - The name of the game 
     * @param {CanvasRenderingContext2D} ctx - Canvas Context object for rendering
     * @param {Object} objects - Game components to be drawn
     */
    constructor(name, ctx, objects, config) {
        this.name = name;
        this.canvasCtx = ctx;
        this.objects = objects;
        this.config = config;
        this.paused = false;
        this.score = [0,0];
        this.type = config.game_type_keys["AI mode"];
        this.player = new Player(this, 2, config.game_type['AI'], [config.keys.p0, config.keys.p1]);
    }

    /**
     * Update all objects
     */
    update() {
        Object.keys(this.objects).forEach((k) => {
            let curObj = this.objects[k];
            curObj.move();
        });
    }

    /** 
     * Changes game mode to 1P, 2P, AI 
     *
    */
    changeMode(game_type) {
        this.player = new Player(this, 2, this.config.game_type[game_type], [this.config.keys.p0, this.config.keys.p1]);
        setTimeout(() => { this.player.resetNPC() }, 1000);
    }

    /**
     * Renders all game objects
     */
    render() {
        //
        const ctx = this.canvasCtx;
        const canvas = this.canvasCtx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);

        // render scores
        ctx.font = this.config.font;
        ctx.fillStyle = this.config.colors.score;
        ctx.fillText(`${this.score[0]}`, (1 / 4) * canvas.width, 40);
        ctx.fillText(`${this.score[1]}`, (3 / 4) * canvas.width, 40);

        //
        Object.keys(this.objects).forEach((k) => {
            let curObj = this.objects[k];
            curObj.render();
        });
    }

    updateScore() {
        const ball = this.objects['ball']
        let pid = (ball.speedX > 0) ? 0 : 1; // ball is moving towards left
        this.score[pid] += 1;
        console.log(this.score);
    }

    /**
     * TODO: Checks for collisions and makes corrections
     */
    detectCollisions() {
        const ball = this.objects['ball'];
        const p0 = this.objects['paddle-0'];
        const p1 = this.objects['paddle-1'];


        const xlimit = this.canvasCtx.canvas.width;
        const ylimit = this.canvasCtx.canvas.height;


        
        // Abstract this out and add a special case for shadow ball

        let check_ball_collisions = function (ball, p0, p1, xlimit, ylimit, isShadow = false) {
            if (!isShadow) {
                if ((ball.x + ball.radius >= xlimit) || (ball.x - ball.radius <= 0)) {
                    if ((ball.y > p0.y && ball.y < p0.y + p0.height) || (ball.y > p1.y && ball.y < p1.y + p1.height)) {
                        playSound(this.config.audio.bounce);
                        // reset npc
                        ball.setSpeed(-ball.speedX, ball.speedY);
                        this.player.resetNPC();
                    }
                    else {
                        // play sound
                        playSound(this.config.audio.fail);
                        // update score
                        this.updateScore();
                        // reset npc
                        // reset ball
                        ball.reset(); // this is fired after 1s
                        // if we reset NPC immediately, speed gets set to 0
                        setTimeout(() => { this.player.resetNPC() }, 1000);
                        //this.player.resetNPC();
                    }
                }
            }

            // ball and vertical bounds
            if ((ball.y + ball.radius >= ylimit) || (ball.y - ball.radius <= 0))
                ball.setSpeed(ball.speedX, -ball.speedY);
        }.bind(this);

        check_ball_collisions(ball, p0, p1, xlimit, ylimit);

        if(this.player.isNPCPresent())
            check_ball_collisions(this.objects['ball_shadow'], p0, p1, xlimit, ylimit, true);

        // paddles
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
            //
            this.update();
            this.render();
        }
    }

    /**
     * Starts the game
     */
    start() {
        console.log(this.player);
        this.interval = setInterval(this.loop.bind(this), 16.6667);
    }

    restart(game_type="AI") {
        if (!this.paused) {
            this.score = [0, 0];
            this.objects.ball.reset();
        }
        this.changeMode(game_type);
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

}