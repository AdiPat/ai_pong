/* 
    Represents a game component
*/

export default class Component {

    constructor(x, y, speedX, speedY, color, ctx) {
        this.x = x;
        this.y = y; 
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; 
        this.canvasCtx = ctx;
    }

    // Checks whether the new co-ordinates are within bounds of the board
    checkBounds(newX, newY) {
        // TODO: checks if object is within canvas for new co-ordinates
        let max_h = this.canvasCtx.canvas.height; 
        let max_w = this.canvasCtx.canvas.width;
        let status = false; 
        if ((newX <= max_w && newX >= 0) && (newY <= max_h && newY >= 0))  
            status = true; 
        
        return status;
    }

    // sets the speed of the component
    setSpeed(vx, vy) {
        this.speedX = vx; 
        this.speedY = vy; 
    }   

    // sets location in 2D space directly
    setLoc(x, y) {
        if(!this.checkBounds(x,y)) {
            //debug console.log("Component out of bounds: ", this);
            return false;
        }
        this.x = x; 
        this.y = y;
        return true;
    }

    // Update movement
    move() {
        let newLoc = {
            x: this.x + this.speedX,
            y: this.y + this.speedY
        }

        if(this.checkBounds(newLoc.x, newLoc.y)) {
            this.x = newLoc.x;
            this.y = newLoc.y;
            return true;
        }
        // out of bounds
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
