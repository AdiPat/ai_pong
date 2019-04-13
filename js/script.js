/*
*
* Canvas 
*
*/ 

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
var canvas = document.querySelector('#canvas');
ctx = canvas.getContext('2d'); 
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


/*
*
* Meta Data
*
*/ 

const KEY_SPACE = 32;
var playOn = false; // true if game is not paused
var isStarted = false;

gameData = {
    backgroundColor: '#000000', 
    plateColor: "gold",
    ballColor: "orangered",
    plateSpeed: 40,
    scores: [0, 0],
    scoreCounter: 0, // represents for how many turns the score hasn't changed
    plateHeight: 100,
    plateWidth: 5,
    ballRadius: 8,
    soundBounce: new Audio('../sounds/bounce.wav'),
    soundFail: new Audio('../sounds/fail.wav')
}


var keyToDirection = {
    38: 'up', // up arrow
    87: 'up', // w
    40: 'down', // down arrow
    83: 'down', // s
    37: 'left', // left arrow
    65: 'left', // a
    39: 'right', // right arrow
    68: 'right', // d
};

// score manager 
scoreManager = {
    scores: [0, 0],
    updateScore: (id) => {
        // when score is updated, reset scoreCounter
        gameData.scoreCounter = 0;
        scoreManager.scores[id] += 1;
    },
    renderScore: () => {
        ctx.font = '30px Montserrat';
        ctx.fillStyle = 'gold';
        ctx.fillText(scoreManager.scores[0], canvas.width / 4, 30);
        ctx.fillText(scoreManager.scores[1], 3 * (canvas.width / 4), 30);
    }
}


/*
*
* Game Component Classes
*
*/ 

class Plate {
    constructor(width, height, startX, startY) {
        this.width = width;
        this.height = height;
        this.x = startX;
        this.y = startY;
    }

    renderPlate() {
        ctx.fillStyle = gameData.plateColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkPlateBounds() {
        if ((this.y - gameData.plateHeight >= 0) || (this.y + gameData.plateHeight <= canvas.height)) {
            return true;
        }
        return false;
    }

    // moves plate in specified direction with given speed
    movePlate(speed, direction) {
        //console.log(speed, direction, this.x, this.y);
        if (direction == 'up') {
            if (this.y - speed - gameData.plateHeight >= 0)
                this.y -= speed;
            else
                this.y = 0;
        } else if (direction == 'down') {
            if (this.y + speed + gameData.plateHeight <= canvas.height)
                this.y += speed;
            else
                this.y = canvas.height - gameData.plateHeight;
        }
    }
    
    // controls movement of the plate based on mouse or kbd input
    controlPlate(speed, direction, mousePos=undefined) {
        //console.log(speed, direction, mousePos);
        if(mousePos) {
            // TODO: If the mouse moves too fast, the plate doesn't adjust it's position properly
            // if mouse position has exceeded bounds, set plate to touch edges
            if(mousePos.y + this.height <= CANVAS_HEIGHT)
                this.y = (mousePos.y);// directly update
        }
        if (!direction)
            return;

        this.movePlate(speed, direction);
    }
}

class Ball {
    constructor(centerX, centerY, radius, color, speedX, speedY, type = "default") {
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type;
    }

    // Draws the ball on the canvas 
    renderBall() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // sets the position of the ball, x and y are co-ordinates of the centre
    setBallPos(x, y) {
        this.x = x;
        this.y = y;
    }

    // speedX,speedY: X and Y components of ball velocity
    setBallSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }

    // translates ball as per speed
    moveBall() {
        // check horizontal bounds
        if (this.x + this.speedX < canvas.width && this.x + this.speedX > 0)
            this.x += this.speedX;
        else {
            // invisible ball for path prediction
            if (this.type === 'invisible') {
                // the job of this ball is just till it hits the bound, then it gets reset
                if (this.x + this.speedX >= canvas.width - gameData.plateWidth) {
                    this.speedX = 0;
                    this.speedY = 0;
                }
            } else {
                // if ball has gone past either plate, update scores
                if (this.x + this.speedX >= canvas.width)
                    scoreManager.updateScore(0);
                else if (this.x + this.speedX <= gameComponents.plates[0].x + gameComponents.plates[1].width) {
                    scoreManager.updateScore(1);
                }

                playSound('fail');
                
                // set new ball position to the centre and reset speed
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.speedX = this.speedY = 0;


                // fire ball again in 2sec
                setTimeout(() => {
                    var dirs = [1,-1]
                    var direction = dirs[Math.floor(Math.random())%2];
                    gameComponents.ball.speedX = (-1) * (Math.ceil(Math.random() * 8) + 1);
                    gameComponents.ball.speedY = Math.ceil(Math.random() * 8) + 1;
                }, 2000);

            }

        }

        // check vertical bounds
        if (this.y + this.speedY < canvas.height && this.y + this.speedY > 0)
            this.y += this.speedY;
        else
            this.speedY = -this.speedY;


    }
}

/*
*
* AI opponent
*
*/




/*
*
* Game Helper Functions
*
*/ 


const playSound = (effect) => {
    // "fail" -> "soundFail" to play sound
    var soundId = 'sound' + effect[0].toUpperCase() + effect.slice(1);
    gameData[soundId].play();
};

// checks if ball and plate collide
const checkCollisions = () => {
    // get plate co-ordinates
    const plate0 = gameComponents.plates[0];
    const plate1 = gameComponents.plates[1];
    const ball = gameComponents.ball;

    // checks left edge of ball w.r.t plate and if the ball is actually hitting the plate 
    // i.e. ball.y is within bounds of vertical co-ordinates of plate
    if (ball.x - ball.radius < plate0.x + plate0.width && ball.y < plate0.y + plate0.height && ball.y > plate0.y) {
        ball.speedX = -ball.speedX;
        // TODO: add some error so that perpendicular collisions don't stay in the same line
        playSound('bounce');
        // whenever there is a bounce against player's plate, update score counter
        gameData.scoreCounter += 1;
        

    }
    // check the same for plate 1
    if (ball.x > plate1.x - plate1.width && ball.y < plate1.y + plate1.height && ball.y > plate1.y) {
        //console.log("Collided with plate1: ", plate1, ball);
        ball.speedX = -ball.speedX;
        playSound('bounce');
    }
}


/*
*
* Core Game functions
*
*/ 


const setupEventListeners = () => {
    //document.addEventListener('resize', resizeCanvas, false);

    // TODO: Not working open menu on space
    document.addEventListener('keydown', (event) => {

        // check if the game has been started first
        if (isStarted && event.keyCode == KEY_SPACE) {
            const menuElem = document.querySelector('.menu-box');
            playOn = !playOn; // pause game
            
            if (playOn) {
                menuElem.style.zIndex = '-10';
                menuElem.style.opacity = '0';
            } else {
                clearFrame();
                menuElem.style.zIndex = '500';
                menuElem.style.opacity = '1';
                return;
            }
        } // space 

        // don't detect arrow keys if the game is paused
        if(isStarted && playOn)
            gameComponents.plates[0].controlPlate(gameData.plateSpeed, keyToDirection[event.keyCode]);
    });

    document.querySelector('.btn-start').addEventListener('click', (e) => {
        e.target.style.zIndex = '-100';
        e.target.style.opacity = '0';
        canvas.style.border = '1px solid lightgrey';
        playOn = true;
        isStarted = true; // starts game
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mousePos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        // move plate 0 
        // TODO: Add function to move the plate
        //gameComponents.plates[0].y = mousePos.y;
        gameComponents.plates[0].controlPlate(null,null, mousePos);
    });


}

// Clears canvas and draws an empty board
const clearFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gameData.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (playOn) {
        // vertical line seperating both sides
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);
    }
}


const updateGame = () => {
    //console.log(`Play on = ${playOn}`)
    if (!playOn) {
        return;
    }// don't update if the game is paused / not started
        
    // if scoreCounter crosses 5 , increase ball speed
    if (gameData.scoreCounter > 5) {
        gameComponents.ball.setBallSpeed(gameComponents.ball.speedX + 5, gameComponents.ball.speedY + 5);
        gameData.scoreCounter = 0;
    }
    clearFrame();
    scoreManager.renderScore();
    checkCollisions();
    gameComponents.plates[0].renderPlate();
    gameComponents.plates[1].renderPlate();
    gameComponents.ball.moveBall();
    gameComponents.ball.renderBall();
};


// sets up all game objects
function init() {
    // clean this
    return {
        plates: [
            new Plate(gameData.plateWidth, gameData.plateHeight, 0, canvas.height / 2),
            new Plate(gameData.plateWidth, gameData.plateHeight, canvas.width - gameData.plateWidth, canvas.height / 4)],
        ball: new Ball(canvas.width / 2, canvas.height / 2, gameData.ballRadius, gameData.ballColor, -5, 5),
    };
}

// starts the game
function run() {
    setupEventListeners(); 
    this.gameComponents = init();
    clearFrame();
    this.interval = setInterval(updateGame, 16.6667);
}

run();