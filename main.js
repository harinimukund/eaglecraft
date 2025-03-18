var paddle2 = 10, paddle1 = 10;
var paddle1X = 10, paddle1Height = 110;
var paddle2Y = 685, paddle2Height = 70;
var score1 = 0, score2 = 0;
var paddle1Y;
var playerscore = 0;
var pcscore = 0;

var ball = {
    x: 350 / 2,
    y: 480 / 2,
    r: 20,
    dx: 3,
    dy: 3
};

var countdown = 3; // Countdown timer variable
var gameStarted = false; // Flag to check if the game has started

function setup() {
    var canvas = createCanvas(700, 600);
    canvas.parent("canvas");
    video = createCapture(VIDEO);
    video.hide();
    video.size(700, 600);
    pose_model = ml5.poseNet(video, ModelLoaded);

    // Start the countdown
    startCountdown();
}

function ModelLoaded() {
    pose_model.on("pose", getResults);
}

function startCountdown() {
    let countdownInterval = setInterval(function () {
        countdown--;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            gameStarted = true; // Start the game after countdown
        }
    }, 1000);
}

function draw() {
    background(0);
    fill("black");
    stroke("black");
    rect(680, 0, 20, 700);
    rect(0, 0, 20, 700);

    paddleInCanvas();
    
    // Left paddle
    fill(250, 0, 0);
    stroke(0, 0, 250);
    strokeWeight(0.5);
    paddle1Y = mouseY;
    rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100);

    // PC paddle
    fill("#FFA500");
    stroke("#FFA500");
    var paddle2y = ball.y - paddle2Height / 2;
    rect(paddle2Y, paddle2y, paddle2, paddle2Height, 100);

    midline();
    drawScore();
    models();

    if (countdown > 0) {
        textSize(30);
        fill("white");
        textAlign(CENTER, CENTER);
        text("Game starts in: " + countdown, width / 2, height / 2);
    } else {
        move();
    }
}

function move() {
    if (!gameStarted) return; // Wait for countdown to finish

    fill(50, 350, 0);
    stroke(255, 0, 0);
    strokeWeight(0.5);
    ellipse(ball.x, ball.y, ball.r, 20);
    
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.r > width - ball.r / 2) {
        ball.dx = -ball.dx - 0.5;
    }

    if (ball.x - 2.5 * ball.r / 2 < 0) {
        if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
            ball.dx = -ball.dx + 0.5;
            playerscore++;
        } else {
            pcscore++;
            reset();
            navigator.vibrate(100);
        }
    }

    if (pcscore == 4) {
        fill("#FFA500");
        stroke(0);
        rect(0, 0, width, height - 1);
        fill("white");
        stroke("white");
        textSize(25);
        text("Game Over!☹☹", width / 2, height / 2);
        text("Reload The Page!", width / 2, height / 2 + 30);
        noLoop();
        pcscore = 0;
    }

    if (ball.y + ball.r > height || ball.y - ball.r < 0) {
        ball.dy = -ball.dy;
    }
}

function reset() {
    ball.x = width / 2 + 100;
    ball.y = height / 2 + 100;
    ball.dx = 3;
    ball.dy = 3;
    gameStarted = false; // Pause the game
    countdown = 3; // Restart countdown
    startCountdown(); // Start countdown again
}

function midline() {
    for (i = 0; i < 480; i += 10) {
        var y = 0;
        fill("white");
        stroke(0);
        rect(width / 2, y + i, 10, 480);
    }
}

function drawScore() {
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250, 0, 0);
    text("Player:", 100, 50);
    text(playerscore, 140, 50);
    text("Computer:", 500, 50);
    text(pcscore, 555, 50);
}

function models() {
    textSize(18);
    fill(255);
    noStroke();
    text("Width:" + width, 135, 15);
    text("Speed:" + abs(ball.dx), 50, 15);
    text("Height:" + height, 235, 15);
}

function paddleInCanvas() {
    if (mouseY + paddle1Height > height) {
        mouseY = height - paddle1Height;
    }
    if (mouseY < 0) {
        mouseY = 0;
    }
}
