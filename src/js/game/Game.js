export default class Game {

    /**
     * 
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
        const keys = Object.keys(this.objects);

        for (var k in keys) {
            let curObj = this.objects[k];
            // get bounds
            for (var kj in keys) {
                let nextObj = this.objects[kj];
                // check if both are not touching
            }
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