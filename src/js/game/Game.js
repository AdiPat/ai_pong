import Paddle from "../components/Paddle";

export default class Game {

    /**
     * @param {string} name - The name of the game 
     * @param {CanvasRenderingContext2D} ctx - Canvas Context object for rendering
     * @param {Object} objects - Game components to be drawn
     */
    constructor(name, ctx, objects) {
        this.name = name;
        this.canvasCtx = ctx;
        this.objects = objects;
        this.paused = false;
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

        //
        Object.keys(this.objects).forEach((k) => {
            let curObj = this.objects[k];
            curObj.render();
        });
    }

    /**
     * TODO: Checks for collisions and makes corrections
     */
    detectCollisions() {
        const ball = this.objects['ball'];
        const p0 = this.objects['paddle-0'];
        const p1 = this.objects['paddle-1'];

        
        // TODO: Dirty, but works for now
        if((ball.x + ball.radius >= 800) || (ball.x - ball.radius <= 0)) {
            if((ball.y > p0.y && ball.y < p0.y + p0.height) || (ball.y > p1.y && ball.y < p1.y + p1.height))
                ball.setSpeed(-ball.speedX, ball.speedY);
            else {
                // relaunch ball
                ball.setLoc(240, 400);
                ball.setSpeed(-3, 3);
            }
        }
    
        // ball and vertical bounds
        if((ball.y + ball.radius >= 480) || (ball.y - ball.radius <= 0))
            ball.setSpeed(ball.speedX, -ball.speedY);


        // paddles
        if(p0.y + p0.height >= 480) {
            p0.setLoc(0,480 - p0.height);
        } 
        if(p0.y - p0.height <= 0) {
            p0.setLoc(0,0);
        }

        if(p1.y + p1.height >= 480) {
            p1.setLoc(800 - p1.width,480 - p1.height);
        } 

        if(p1.y - p1.height <= 0) {
            p1.setLoc(800 - p1.width,0);
        }
    }

    /**
     * Game loop
     */
    loop() {
        if (!this.paused) {
            this.detectCollisions();
            this.update();
            this.render();
        }
    }

    /**
     * Starts the game
     */
    start() {
        this.interval = setInterval(this.loop.bind(this), 16.6667);
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

}