/* 
*    Represents a game component
*/
import { getSign } from '../game/utils';

export default class Component {

    /**
     * 
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     * @param {number} speedX - x component of velocity
     * @param {number} speedY - y component of velocity
     * @param {string} color - hex code or named color value
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(x, y, speedX, speedY, color, ctx) {
        this.x = x;
        this.y = y; 
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; 
        this.canvasCtx = ctx;
        this.base_speed = 1;
    }

    /**
     * 
     * @param {number} newX New x co-ordinate
     * @param {number} newY New y co-ordinate
     * Checks if the new position is within bounds
     * We assume the game area occupies all of the canvas.
     */
    checkBounds(newX, newY) {
        let max_h = this.canvasCtx.canvas.height; 
        let max_w = this.canvasCtx.canvas.width;
        let status = false; 
        if ((newX <= max_w && newX >= 0) && (newY <= max_h && newY >= 0))  
            status = true; 
        
        return status;
    }

    /**
     * 
     * @param {number} vx Horizontal velocity component
     * @param {number} vy Vertical velocity component
     * Sets speeds (with direction) for the component
     * 
     */
    setSpeed(vx, vy) {
        this.speedX = vx; 
        this.speedY = vy; 
    }   

    /**
     * 
     * @param {number} k 
     */
    boostSpeed(k, base=true) {
        if(base) {
            this.setSpeed(getSign(this.speedX) * this.base_speed * k, k * getSign(this.speedY) * this.base_speed);
        }
        else
            this.setSpeed(k * this.speedX, k * this.speedY);
    }

    setBaseSpeed(bspeed) {
        this.base_speed = bspeed; 
    }


    /**
     * 
     * Flips speed direction
     */
    reverseX() {
        this.speedX = -this.speedX;
    }

    reverseY() {
        this.speedY = -this.speedY; 
    }

    /**
     * 
     * @param {number} x x co-ordinate
     * @param {number} y y co-ordinate
     * Sets location of the component in 2D space
     */
    setLoc(x, y) {
        if(!this.checkBounds(x,y)) {
            //debug console.log("Component out of bounds: ", this);
            return false;
        }
        this.x = x; 
        this.y = y;
        return true;
    }

    /**
     * Moves the component according to it's current speed in the current frame
     */
    move() {
        let newLoc = {
            x: this.x + this.speedX,
            y: this.y + this.speedY
        }

        const w = this.canvasCtx.canvas.width;
        const h = this.canvasCtx.canvas.height;
        const delta = 3; // 3px error

        if(this.checkBounds(newLoc.x, newLoc.y)) {
            this.x = newLoc.x;
            this.y = newLoc.y;
            return true;
        }
        else {
            // calculate new bounds
            if(newLoc.x >= w)
                this.x = w - delta;
            if(newLoc.x <= 0)
                this.x = delta;
            if(newLoc.y >= h)
                this.y = h - delta;
            if(newLoc.y <= 0)
                this.y = delta;
            return true;
        }
        //console.log("Component out of bounds: ", this);
        return false;
    }

    /**
     * 
     * @param {function} renderer - The callback function to render the component
     */
    render(renderer) {
        this.canvasCtx.fillStyle = this.color;
        renderer(this.canvasCtx, this.x, this.y);
        this.canvasCtx.fill();
    }
}
