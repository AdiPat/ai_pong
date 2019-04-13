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
            // TODO: Check if 'this' is correctly referenced
            ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        }.bind(this);

        super.render(renderer); 
    }
}