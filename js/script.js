const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH_HEIGHT_RATIO = 5 / 3;

var playOn = false; // is the game running or paused?

// initialize canvas 
var canvas = document.querySelector('#canvas');
ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


// game data
gameData = {
    backgroundColor: '#000000', // black
    plateColor: "gold",
    ballColor: "orangered",
    plateSpeed: 40,
    scores: [0, 0], // p1 and p2
    scoreCounter: 0, // for how long has the score not changed?
    plateHeight: 100,
    plateWidth: 10,
    ballRadius: 15,
    soundBounce: new Audio('../sounds/bounce.wav'),
    soundFail: new Audio('../sounds/fail.wav'),
    AIDifficultyFactor: 1.1,
    prevBeta: 0
}

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

// effect = 'fail', 'bounce'
const playSound = (effect) => {
    gameData[`sound${effect[0].toUpperCase() + effect.substring(1,effect.length)}`].play();
};

// movement 

var keyToDirection = {
    38: 'up', // up arrow
    87: 'up', // w
    40: 'down', // down arrow
    83: 'down', // s
    37: 'left', // left arrow
    65: 'left', // a
    39: 'right', // right arrow
    68: 'right' // d
};

// plate to deflect ball
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

    movePlate(speed, direction) {
        //wconsole.log(speed, direction);
        if (direction === 'up') {
            if (this.y - speed > 0)
                this.y -= speed;
            else
                this.y = 0;
        } else if (direction == 'down') {
            if (this.y + speed + gameData.plateHeight < canvas.height)
                this.y += speed;
            else
                this.y = canvas.height - gameData.plateHeight;
        }
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

    renderBall() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    setBallPos(x, y) {
        this.x = x;
        this.y = y;
    }

    setBallSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }

    //in deg
    moveBall() {
        if (this.x + this.speedX < canvas.width && this.x + this.speedX > 0)
            this.x += this.speedX;
        else {

            if (this.type === 'invisible') {
                if (this.x + this.speedX >= canvas.width - gameData.plateWidth) {
                    this.speedX = 0;
                    this.speedY = 0;
                }
            } else {
                if (this.x + this.speedX >= canvas.width)
                    scoreManager.updateScore(0);
                else if (this.x + this.speedX <= gameComponents.plates[0].x + gameComponents.plates[1].width) {
                    scoreManager.updateScore(1);
                }

                playSound('fail');

                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.speedX = this.speedY = 0;



                setTimeout(() => {

                    gameComponents.ball.speedX = -1 * (Math.ceil(Math.random() * 8) + 1);
                    gameComponents.ball.speedY = Math.ceil(Math.random() * 8) + 1;
                }, 2000);

            }

        }

        if (this.y + this.speedY < canvas.height && this.y + this.speedY > 0)
            this.y += this.speedY;
        else
            this.speedY = -this.speedY;


    }
}

// game functions 

const controlPlate = (id, direction, type='gyro') => {
    if (!direction)
        return;
    if(type='gyro')
        gameComponents.plates[id].movePlate(5, direction);
    else
        gameComponents.plates[id].movePlate(gameData.plateSpeed, direction);
}

const checkPlateCollision = () => {
    // get plate co-ordinates
    const plate0 = gameComponents.plates[0];
    const plate1 = gameComponents.plates[1];
    const ball = gameComponents.ball;
    const invBall = gameComponents.invBall;

    if (ball.x - ball.radius < plate0.x + plate0.width && ball.y < plate0.y + plate0.height && ball.y > plate0.y) {
        ball.speedX = -ball.speedX;
        playSound('bounce');
        // whenever there is a bounce against player's plate, update score counter
        gameData.scoreCounter += 1;
        // launch invisible ball invBall
        invBall.setBallPos(ball.x, ball.y);
        invBall.setBallSpeed(ball.speedX * gameData.AIDifficultyFactor, ball.speedY * gameData.AIDifficultyFactor);
    }

    if (ball.x > plate1.x - plate1.width && ball.y < plate1.y + plate1.height && ball.y > plate1.y) {
        //console.log("Collided with plate1: ", plate1, ball);
        ball.speedX = -ball.speedX;
        playSound('bounce');
    }
}

// move plate 1 dynamically 

const setupEventListeners = () => {
    //document.addEventListener('resize', resizeCanvas, false);

    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 32) {
            const menuElem = document.querySelector('.menu-box');
            playOn = !playOn; // pause game
            if (playOn) {
                menuElem.style.zIndex = '-10';
                menuElem.style.opacity = '0';
            } else {
                clearFrame();
                menuElem.style.zIndex = '500';
                menuElem.style.opacity = '1';
            }
        } // space 
        controlPlate(0, keyToDirection[event.keyCode]);
    });

    document.querySelector('.btn-start').addEventListener('click', (e) => {
        e.target.style.zIndex = '-100';
        e.target.style.opacity = '0';
        canvas.style.border = '1px solid lightgrey';
        playOn = true;
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mousePos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        // move plate 0 
        gameComponents.plates[0].y = mousePos.y;
    });

    window.onresize = () => {
        resizeCanvas();
        clearFrame();
    };

}

function resizeCanvas() {
    if (window.innerWidth < 800) {
        canvas.width = screen.width - 30;
        if(window.innerWidth < 600)
            canvas.width = screen.width - 10;
        if(window.innerWidth < 400)
            canvas.width = screen.width - 10;
        canvas.height = (1 / CANVAS_WIDTH_HEIGHT_RATIO) * canvas.width;
        console.log(canvas.width, canvas.height);

        gameComponents = {
            plates: [new Plate(gameData.plateWidth, screen.height/10, 0, canvas.height / 2),
              new Plate(gameData.plateWidth, screen.height / 10, canvas.width - gameData.plateWidth, canvas.height / 4)],
            ball: new Ball(canvas.width / 2, canvas.height / 2, 7, gameData.ballColor, -5, 5),
            invBall: new Ball(canvas.width / 2, canvas.height / 2, 7, 'transparent', 0, 0, "invisible")
        };
    }
    //canvas.width = window.innerWidth;
    //canvas.height = (1/CANVAS_WIDTH_HEIGHT_RATIO) * canvas.width;
}

const clearFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gameData.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (playOn) {

        ctx.fillStyle = "lightgrey";
        ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);
    }
}


const updateGame = () => {
    if (!playOn) // don't update if the game is paused / not started
        return;
    // if scoreCounter crosses 20 , increase ball speed
    if (gameData.scoreCounter > 5) {
        gameComponents.ball.setBallSpeed(gameComponents.ball.speedX + 5, gameComponents.ball.speedY + 5);
        gameComponents.invBall.setBallSpeed(gameComponents.ball.speedX * gameData.AIDifficultyFactor, gameComponents.ball.speedY * gameData.AIDifficultyFactor);
        gameData.scoreCounter = 0;
    }
    clearFrame();
    scoreManager.renderScore();
    checkPlateCollision();
    // adjust computer controlled plate to predict the path of the ball
    gameComponents.plates[0].renderPlate();
    gameComponents.plates[1].y = gameComponents.invBall.y -
        gameComponents.plates[1].height / 2;

    gameComponents.plates[1].renderPlate();
    gameComponents.invBall.moveBall();
    gameComponents.ball.moveBall();
    gameComponents.ball.renderBall();

    // render inv ball
    gameComponents.invBall.renderBall();
};

const initGyroscope = () => {
    if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            if(event.beta > gameData.prevBeta)
                controlPlate(0, 'down', 'gyro');
            if(event.beta < gameData.prevBeta)
                controlPlate(0, 'up', 'gyro');
            gameData.prevBeta = event.beta;
      });   
    }
};

const init = () => {
    //resizeCanvas();
    //clearFrame();
    initGyroscope();
    setupEventListeners();
    return {
        plates: [new Plate(gameData.plateWidth, gameData.plateHeight, 0, canvas.height / 2),
              new Plate(gameData.plateWidth, gameData.plateHeight, canvas.width - gameData.plateWidth, canvas.height / 4)],
        ball: new Ball(canvas.width / 2, canvas.height / 2, gameData.ballRadius, gameData.ballColor, -5, 5),
        invBall: new Ball(canvas.width / 2, canvas.height / 2, gameData.ballRadius, 'transparent', 0, 0, "invisible")
    };
}

var gameComponents = init();
resizeCanvas();
clearFrame();
var interval = setInterval(updateGame, 16.6667); // 60fps