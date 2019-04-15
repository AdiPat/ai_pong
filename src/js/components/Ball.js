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
        }.bind(this);

        // reset after 1 second
        setTimeout(() => resetFunc(spMin, spMax-spMin), delay);
    }

    collision(paddle, minSpeed = 3, boost=false) {
        const cf = paddle.cfactor;

        // boost bounce
        if(boost)
            cf = 1 + cf;

        let new_vx = -this.speedX * cf;

        // don't let speed drop too low
        if(Math.abs(new_vx) <= 3) {
            const vmod = Math.abs(new_vx) + minSpeed;
            new_vx = (new_vx > 0)?(vmod):(-vmod);
        }
        //const old_ang = this.getVelocityAngle(-this.speedX, this.speedY);
        this.speedX = new_vx; 
        if(this.speedX > 0) {
            this.x = 1.5 * paddle.width;
        }
            
        else {
            this.x = this.canvasCtx.canvas.width - 1.5 * paddle.width;
        }            
        //const new_ang = this.getVelocityAngle(new_vx, this.speedY);
    }

    /**
     * 
     * @param {number} vx 
     * @param {number} vy
     * Returns collision angle, added as a test function to compare elastic and inelastic
     * collision difference.
     */
    getVelocityAngle(vx = this.speedX, vy = this.speedY) {
        const ang = Math.atan(vy / vx);
        return (180/Math.PI) * ang;
    }
}