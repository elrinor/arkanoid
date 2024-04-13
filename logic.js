


var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

var isKeyDown = {};

var playerBall = {
    x : 320,
    y : 450,
    r : 30,
}

var playerSpeed = 600;

class SmallBall {
    constructor(x, y, r, dx, dy, inGame){
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.inGame = inGame;
    }
}

const ballArray = [];

for (let i = 0; i < 10; i++) {
    const smallBall = new SmallBall(
      330,
      Math.random() * canvas.height,
      10,
      0,
      400,
      true
    );
    ballArray.push(smallBall);
  }
background = 'black';

document.addEventListener("keydown", function (event) {
    isKeyDown[event.key] = true;
    console.log(event.key);
});
document.addEventListener("keyup", function (event) {
    isKeyDown[event.key] = false;
});

lastTimeMs = null;

function sqr(x) {
    return x * x;
}

function gameloop(timeMs) {
    doGameLoop(timeMs);
    requestAnimationFrame(gameloop);
}

function doGameLoop(timeMs) {
    if (lastTimeMs === null) {
        lastTimeMs = timeMs;
        return;
    }

    deltaTime = (timeMs - lastTimeMs) / 1000.0;
    lastTimeMs = timeMs;

    if (isKeyDown['ArrowLeft'] === true) {
        playerBall.x -= playerSpeed * deltaTime;
    }
    if (isKeyDown['ArrowRight'] === true) {
        playerBall.x += playerSpeed * deltaTime;
    }
    if (playerBall.x + playerBall.r > canvas.width) {
        playerBall.x = canvas.width - playerBall.r;
    }
    if (playerBall.x - playerBall.r < 0) {
        playerBall.x = playerBall.r;
    }


    ballArray.forEach(element => {
        element.x += element.dx * deltaTime;
        element.y += element.dy * deltaTime;

        if (element.x - element.r < 0) {
            element.x = element.r;
            element.dx = -element.dx;
        }
        if (element.x + element.r > canvas.width) {
            element.x = canvas.width - element.r;
            element.dx = - element.dx;
        }
        if (element.y - element.r < 0) {
            element.y = element.r;
            element.dy = -element.dy;
        }
        
        if (element.y + element.r > canvas.height) {
            element.inGame = false;
            // check if all balls in the array are out of the screen 
            if (ballArray.every(element => element.inGame === false)) {
                background = "red"
            }
        }
        
        if (sqr(element.x - playerBall.x) + sqr(element.y - playerBall.y) < sqr(element.r + playerBall.r)) {
            var unit = {
                x : playerBall.x - element.x,
                y : playerBall.y - element.y
            };
            var len = Math.sqrt(sqr(unit.x) + sqr(unit.y));
            unit.x /= len;
            unit.y /= len;

            var dot = unit.x * element.dx + unit.y * element.dy;

            element.x = playerBall.x - unit.x * (element.r + playerBall.r);
            element.y = playerBall.y - unit.y * (element.r + playerBall.r);

            if (dot > 0) {
                element.dx -= 2 * dot * unit.x;
                element.dy -= 2 * dot * unit.y;

                    // Speed shit up
                element.dx *= 1.1;
                element.dy *= 1.1;
            }
        }
    });
    render();
}

function render() {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(playerBall.x, playerBall.y, playerBall.r, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();

    ballArray.forEach(element => {
        context.beginPath();
        context.arc(element.x, element.y, element.r, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
    });
}

requestAnimationFrame(gameloop);

