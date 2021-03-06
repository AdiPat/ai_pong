import Component from './Component';
import { randomDir, randomFloat } from '../game/utils';


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
    reset(delay=1000, change_speed=true, speed_range=[2,12]) {

        this.setLoc(this.canvasCtx.canvas.width/2, this.canvasCtx.canvas.height/2);
        this.setSpeed(0,0);

        let [spMin, spMax] = speed_range;
        let resetFunc = function(spMin, spMax) {
            const dirX = randomDir();
            const dirY = randomDir();

            let speeds = {
                x: dirX * this.speedX,
                y: dirY * this.speedY
            };

            if(change_speed) {
                speeds = {
                    x: dirX * randomFloat(spMin, spMax),
                    y: dirY * randomFloat(spMin, spMax)
                };
            }
            
            //console.log(speeds);
            this.setSpeed(speeds.x, speeds.y);
        }.bind(this);

        // reset after 1 second
        setTimeout(() => resetFunc(spMin, spMax), delay);
    }

    collision(paddle, minSpeed = 6, boost=false) {
        let cf = paddle.cfactor;

        // boost bounce
        if(boost)
            cf = 1 + cf;

        // if(boost)
        //     console.log(`BOOOST >>>>> ${cf}`)

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