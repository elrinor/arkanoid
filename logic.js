


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

var smallBall = {
    x : 330,
    y : 20,
    r : 10,
    dx : 0,
    dy : 400,
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

    smallBall.x += smallBall.dx * deltaTime;
    smallBall.y += smallBall.dy * deltaTime;

    if (smallBall.x - smallBall.r < 0) {
        smallBall.x = smallBall.r;
        smallBall.dx = -smallBall.dx;
    }
    if (smallBall.x + smallBall.r > canvas.width) {
        smallBall.x = canvas.width - smallBall.r;
        smallBall.dx = -smallBall.dx;
    }
    if (smallBall.y - smallBall.r < 0) {
        smallBall.y = smallBall.r;
        smallBall.dy = -smallBall.dy;
    }
    if (smallBall.y + smallBall.r > canvas.height) {
        background = 'red'; // ded.
    }

    if (sqr(smallBall.x - playerBall.x) + sqr(smallBall.y - playerBall.y) < sqr(smallBall.r + playerBall.r)) {
        var unit = {
            x : playerBall.x - smallBall.x,
            y : playerBall.y - smallBall.y
        };
        var len = Math.sqrt(sqr(unit.x) + sqr(unit.y));
        unit.x /= len;
        unit.y /= len;

        var dot = unit.x * smallBall.dx + unit.y * smallBall.dy;

        smallBall.x = playerBall.x - unit.x * (smallBall.r + playerBall.r);
        smallBall.y = playerBall.y - unit.y * (smallBall.r + playerBall.r);

        if (dot > 0) {
            smallBall.dx -= 2 * dot * unit.x;
            smallBall.dy -= 2 * dot * unit.y;

            // Speed shit up
            smallBall.dx *= 1.1;
            smallBall.dy *= 1.1;
        }
    }

    render();
}

function render() {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(playerBall.x, playerBall.y, playerBall.r, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.arc(smallBall.x, smallBall.y, smallBall.r, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
}

requestAnimationFrame(gameloop);

