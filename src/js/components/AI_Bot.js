import Ball from "./Ball";
/*
*
* AI opponent
* This class abstracts all AI operations
*
*/

export default class AI_Bot {

    /**
     * 
     * @param {Game} game - Main game object
     * @param {Ball} ball - The ball in play
     * @param {Paddle} paddle - Paddle that the bot controls
     * @param {number} difficulty - Decides how "intelligent" the bot is
     */
    constructor(game, ball, paddle, difficulty=1.2) {
        this.game = game;
        this.ball = ball; 
        this.paddle = paddle;
        this.difficulty = difficulty;
        let shadowBall = new Ball(this.ball.x, this.ball.y, this.ball.radius, this.ball.speedX * this.difficulty, this.ball.speedY * this.difficulty, 'transparent', this.game.canvasCtx);
        shadowBall.setBaseSpeed(game.config.speed.base_speed);
        this.game.objects['ball_shadow'] = shadowBall;
    }

    /**
     * 
     * Dynamically predict the path where the paddle must move,
     * we care only about the y co-ordinate. However, x can be
     * used to introduce some error in the prediction.
     *   
     */
    predictPath() {
        const sb = this.game.objects['ball_shadow'];
        const max_w = this.game.config.dimensions.board.width;
        const board_centre = max_w / 2;

        /**
         * Use shadow ball location only if the ball is moving towards the paddle.
         * Otherwise, just let the paddle stay where it is.
         */
        if(this.paddle.x > board_centre) {
            if(this.ball.speedX > 0)
                return {x: sb.x, y: sb.y};
        }
        else if (this.paddle.x < board_centre) {
            if(this.ball.speedX < 0)
                return {x: sb.x, y: sb.y};
        }

        return {x: this.paddle.x, y: this.paddle.y };
    }

    setDifficulty(dfactor) {
        this.difficulty = dfactor;
        this.reset();
    }


    /**
     * 
     * Reset position and speed of shadow ball according to actual ball.
     */
    reset() {
        this.game.objects['ball_shadow'].setLoc(this.ball.x, this.ball.y);
        this.game.objects['ball_shadow'].setSpeed(this.ball.speedX * this.difficulty, this.ball.speedY * this.difficulty);
    }

    /**
     * 
     * @param {Object} paddleControls - Interface to move the paddle
     * Controls movement of the paddle according to the predicted path of the ball.
     * 
     */
    control(paddleControls) {
        if(this.game.paused)
            return;

        let dir = "down"; 
        let nextPt = this.predictPath();
        
        if(nextPt.y < this.paddle.y + this.paddle.height/2)
            dir = "up";

        if(nextPt.y >= this.paddle.y + this.paddle.height/4 && nextPt.y <= this.paddle.y + this.paddle.height) {
            paddleControls[dir](this.paddle, "stop"); // stop moving if the point is exactly in the middle
        }
        else
            paddleControls[dir](this.paddle, "move"); // move up/down
    }

}