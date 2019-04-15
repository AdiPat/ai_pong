import Component from './Component';
import { randomFloat } from '../game/utils';

export default class Paddle extends Component {

    /**
     * 
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     * @param {number} width Paddle width
     * @param {number} height Paddle height
     * @param {number} speed Paddle speed
     * @param {string} color - hex code or named color value
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cfactor - Collision factor
     */
    constructor(x, y, width, height, speed, color, ctx, cfactor = randomFloat(0.6, 0.95)) {
        super(x,y,0,speed,color,ctx);
        this.width = width;
        this.height = height;
        this.cfactor = cfactor;
    }

    render() {
        const renderer = function(ctx, x, y) {
            ctx.rect(x,y, this.width, this.height);
        }.bind(this);
        // bind current object to renderer
        super.render(renderer);
    }

    /**
     * Resets paddle speed and position
     */
    reset() {
        this.setSpeed(0,0);
        this.y = (this.canvasCtx.canvas.height - this.height)/2;
    }
}