const player = document.getElementById("player");
const obstacles = document.getElementById("obstacles");
const gameOver = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const scoreDisplay = document.getElementById("score");

let isGameOver = false;
let score = 0;
let obstacleInterval;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = random(0, 160) + "px";
  obstacles.appendChild(obstacle);

  moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
  let distance = 0;
  const speed = 4;

  function animate() {
    if (isGameOver) return;

    distance += speed;
    obstacle.style.top = distance + "px";

    if (distance >= 600) {
      obstacle.remove();
      score++;
      scoreDisplay.textContent = score;
    }

    if (checkCollision(obstacle)) {
      gameOverGame();
      return;
    }

    if (!isGameOver) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function checkCollision(obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  return (
    playerRect.bottom >= obstacleRect.top &&
    playerRect.top <= obstacleRect.bottom &&
    playerRect.right >= obstacleRect.left &&
    playerRect.left <= obstacleRect.right
  );
}

function gameOverGame() {
  isGameOver = true;
  clearInterval(obstacleInterval);
  finalScore.textContent = score;
  gameOver.style.display = "flex";
}

function startGame() {
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = "0";
  gameOver.style.display = "none";
  obstacles.innerHTML = "";
  obstacleInterval = setInterval(createObstacle, 1000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.offsetLeft > 0) {
    player.style.left = player.offsetLeft - 20 + "px";
  } else if (e.key === "ArrowRight" && player.offsetLeft < 160) {
    player.style.left = player.offsetLeft + 20 + "px";
  }
});

function restartGame() {
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = "0";
    gameOver.style.display = "none";
    obstacles.innerHTML = "";
    startGame(); // 게임을 다시 시작합니다.
}
document.getElementById('restart-button').addEventListener('click', restartGame);


startGame();