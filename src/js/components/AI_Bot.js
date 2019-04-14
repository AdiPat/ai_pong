import Ball from "./Ball";

/*
*
* AI opponent
* Abstracts all AI operations
*
*/

export default class AI_Bot {

    constructor(game, ball, paddle, difficulty=1.2) {
        this.game = game;
        this.ball = ball; 
        this.paddle = paddle;
        this.difficulty = difficulty;
    }

    // TODO: Fix this dynamic path prediction
    predictPath() {
        let boostFactor = this.difficulty; 
        if(this.ball.speedX < 0)
            boostFactor = 1;

        // simulate a shadow ball that's faster than the actual ball
        // TODO: Doesn't work as desired. Does this run within 16ms? 
        const t = Math.abs(this.ball.x / this.ball.speedX);
        var vx, vy = [this.ball.speedX * boostFactor, this.ball.speedY * boostFactor];
        let max_h, max_w = [this.game.config.dimensions.board.height, this.game.config.dimensions.board.width];
        const dtotal = Math.abs(vx * t); // total x distance covered 
        let cur_x = 0; // current covered distance by shadow ball
        let nextPoint = {x: 0, y: 0};
        let t_rem = t;
        while(cur_x <= dtotal) {
            const dvertical = (vy > 0)?(max_h - this.ball.y):(this.ball.y);

            let tcur = Math.abs(dvertical/vy);
            if(tcur >= t) {
                nextPoint.x = dtotal;
                nextPoint.y = (vy > 0)?(t_rem * vy):(max_h - t_rem * vy);
                break;
            }
            t_rem -= tcur;
            cur_x += Math.abs(tcur * vx);
            vy *= -1; // collision, change direction   
        }


        return {x: nextPoint.x, y: nextPoint.y};
        
    }

    // checks path and moves paddle towards point
    control(paddleControls) {
        //console.log(this.game.paused);
        if(this.game.paused)
            return;

        let dir = "down"; 
        let nextPt = this.predictPath();
        // debug console.log(nextPt.y, this.paddle.y);
        
        if(nextPt.y < this.paddle.y)
            dir = "up";

        if(nextPt.y >= this.paddle.y && nextPt.y <= this.paddle.y + this.paddle.height) {
            paddleControls[dir](this.paddle, "keyup");
        }
        else
            paddleControls[dir](this.paddle, "npc");
    }

}