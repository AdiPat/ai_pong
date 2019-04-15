import Component from './Component';

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
     */
    constructor(x, y, width, height, speed, color, ctx) {
        super(x,y,0,speed,color,ctx);
        this.width = width;
        this.height = height;
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