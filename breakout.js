const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 100;
const BRICK_ROWS = 8;
const BRICK_COLUMNS = 12;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 30;
const PADDLE_SPEED = 6;
const BALL_SPEED = 3;

let score = 0; // 점수를 저장하는 변수

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: BALL_SPEED,
    dy: -BALL_SPEED
};


let paddle = {
    x: (canvas.width - PADDLE_WIDTH) / 2,
    dx: 0
};

let bricks = [];
for (let c = 0; c < BRICK_COLUMNS; c++) {
    bricks[c] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
let isGameOver = false; // 게임 오버 상태를 저장하는 변수

let animationId;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20); // 점수를 화면에 그리는 함수
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMNS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                let brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < BRICK_COLUMNS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + BRICK_WIDTH && ball.y > b.y && ball.y < b.y + BRICK_HEIGHT) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++; // 점수를 증가시킴
                    if(score == BRICK_ROWS*BRICK_COLUMNS) { // 모든 벽돌을 제거했는지 확인
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function updateBall() {
    if (ball.x + ball.dx > canvas.width - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < BALL_RADIUS) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - BALL_RADIUS - PADDLE_HEIGHT) {
        if (ball.x > paddle.x && ball.x < paddle.x + PADDLE_WIDTH) {
            ball.dy = -ball.dy;
        } else {
            document.getElementById('gameOver').style.display = 'block'; // 공이 바닥에 닿으면 게임 오버
            isGameOver = true; // 게임 오버 상태를 true로 변경합니다.
            return;
        }
    }

    // 게임 오버가 아닐 경우에만 공의 위치를 업데이트합니다.
    if (!isGameOver) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
}

function updatePaddle() {
    if (!isGameOver) {
        paddle.x += paddle.dx;
        if (paddle.x < 0) {
            paddle.x = 0;
        } else if (paddle.x + PADDLE_WIDTH > canvas.width) {
            paddle.x = canvas.width - PADDLE_WIDTH;
        }
    }
}

function resetBall() {
    if (!isGameOver) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = BALL_SPEED;
        ball.dy = -BALL_SPEED;
    }
}

function createNewBricks() {
    for (let c = 0; c < BRICK_COLUMNS; c++) {
        bricks[c] = [];
        for (let r = 0; r < BRICK_ROWS; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function keyDownHandler(e) {
    if (!isGameOver) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            paddle.dx = PADDLE_SPEED;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            paddle.dx = -PADDLE_SPEED;
        }
    }
}

function keyUpHandler(e) {
    if (!isGameOver) {
        if (e.key == "Right" || e.key == "ArrowRight" || e.key == "Left" || e.key == "ArrowLeft") {
            paddle.dx = 0;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    updateBall();
    updatePaddle();

    if (ball.y + ball.dy > canvas.height - BALL_RADIUS) {
        // 게임 오버 처리
        document.getElementById('gameOver').style.display = 'block';
        cancelAnimationFrame(animationId); // 애니메이션을 취소합니다.
    } else {
        animationId = requestAnimationFrame(draw); // 애니메이션 ID를 저장합니다.
    }
}

document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('gameOver').style.display = 'none';
    isGameOver = false; // 게임 오버 상태를 false로 변경합니다.
    resetBall();
    createNewBricks(); // 게임을 재시작할 때 새로운 벽돌 생성
    cancelAnimationFrame(animationId); // 이전 애니메이션 프레임을 취소합니다.
    animationId = requestAnimationFrame(draw); // 애니메이션을 다시 시작합니다.
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

draw();