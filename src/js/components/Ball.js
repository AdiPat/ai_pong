import Component from './Component';


export default class Ball extends Component {

    /**
     * 
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     * @param {number} radius of ball
     * @param {number} speedX - x component of velocity
     * @param {number} speedY - y component of velocity
     * @param {string} color - hex code or named color value
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(x, y, radius, speedX, speedY, color, ctx) {
        super(x,y,speedX,speedY,color,ctx);
        this.radius = radius;
    }

    render() {
        const renderer = function(ctx, x, y) {
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        }.bind(this);

        super.render(renderer); 
    }

    /**
     * 
     * @param {number} delay - Time delay for reset
     * Resets ball position back to the centre of the board, 
     * randomly generates speed in the range [3,8] 
     * 
     */
    reset(delay=1000, speed_range=[3,8]) {

        this.setLoc(this.canvasCtx.canvas.width/2, this.canvasCtx.canvas.height/2);
        this.setSpeed(0,0);

        let [spMin, spMax] = speed_range;
        let resetFunc = function(spMin, spMax) {
            const dirX = [-1,1][Math.floor((Math.random()*10))%2]; 
            const dirY = [-1,1][Math.floor((Math.random()*10))%2]; 
            this.setSpeed(dirX * (spMin+Math.floor(Math.random()*spMax)), dirY * (spMin+Math.floor(Math.random()*spMax)));
            console.log(this.speedX, this.speedY);
        }.bind(this);

        // reset after 1 second
        setTimeout(() => resetFunc(spMin, spMax-spMin), delay);
    }
}