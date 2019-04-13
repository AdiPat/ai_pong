import Component from './Component';

export default class Paddle extends Component {
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
}