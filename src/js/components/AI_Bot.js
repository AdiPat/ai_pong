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

    // dynamic path prediction
    predictPath() {
        // TODO: Implement this 
        return {x: this.ball.x, y: this.ball.y};
        
    }

    // checks path and moves paddle towards point
    control(paddleControls) {
        //console.log(this.game.paused);
        if(this.game.paused)
            return;

        let dir = "down"; 
        let nextPt = this.predictPath();
        console.log(nextPt.y, this.paddle.y);
        
        if(nextPt.y < this.paddle.y)
            dir = "up";

        if(nextPt.y >= this.paddle.y && nextPt.y <= this.paddle.y + this.paddle.height) {
            paddleControls[dir](this.paddle, "keyup");
        }
        else
            paddleControls[dir](this.paddle, "npc");
    }

}