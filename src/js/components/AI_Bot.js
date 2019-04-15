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
        let shadowBall = new Ball(this.ball.x, this.ball.y, this.ball.radius, this.ball.speedX * this.difficulty, this.ball.speedY * this.difficulty, 'cyan', this.game.canvasCtx);
        this.game.objects['ball_shadow'] = shadowBall;
    }

    // TODO: Fix this dynamic path prediction
    predictPath() {
        const sb = this.game.objects['ball_shadow'];

        return {x: sb.x, y: sb.y};
    }

    reset() {
        //this.game.objects['shadow'] = shadowBall;
        this.game.objects['ball_shadow'].setLoc(this.ball.x, this.ball.y);
        this.game.objects['ball_shadow'].setSpeed(this.ball.speedX * this.difficulty, this.ball.speedY * this.difficulty);
    }

    // checks path and moves paddle towards point
    control(paddleControls) {
        //console.log(this.game.paused);
        if(this.game.paused)
            return;

        let dir = "down"; 
        let nextPt = this.predictPath();
        //debug 
        //console.log(nextPt.y, this.paddle.y);
        
        if(nextPt.y < this.paddle.y + this.paddle.height/2)
            dir = "up";

        if(nextPt.y >= this.paddle.y && nextPt.y <= this.paddle.y + this.paddle.height) {
            paddleControls[dir](this.paddle, "keyup");
        }
        else
            paddleControls[dir](this.paddle, "npc");
    }

}