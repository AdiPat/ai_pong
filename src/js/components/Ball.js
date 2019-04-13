import Component from './Component';

export default class Ball extends Component {
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