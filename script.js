const container = document.querySelector("#container");
const bird = document.querySelector("#bird");
const scoreElm = document.querySelector("#score").firstElementChild;
const startBt = document.querySelector("#play");
const restartBt = document.querySelector("#rst-bt");
const containerBounds = container.getBoundingClientRect();
const gravity = 0.82;
const birdJump = 20;
const limitFactor = 0.9; //limit the increase to prvent going up or down to fast
const blockSpeed = 4.5;
const blockWidthOffset = 5;
let birdSpeed = 0;
let count = 0;
let score = 0;
let gameOverFlag = false;

eventsHandler();

function start() {
  bird.style.top = "-20px";
  startBt.style.display = "none";
  birdSpeed = 0;
  count = 0;
  gameOverFlag = false;
  update();
  generateBlock();
}

function restart() {
  document.querySelectorAll(".block").forEach((block) => block.remove());

  document.querySelector("#restart").style.display = "none";
  score = 0;
  scoreElm.textContent = score;
  start();
}

function eventsHandler() {
  document.addEventListener("keyup", (e) => {
    if (e.keyCode === 32) jump();
  });
  container.addEventListener("click", jump);
  startBt.addEventListener("click", start);
  restartBt.addEventListener("click", restart);
}

function update() {
  const updateInterval = setInterval(() => {
    updateBird();
    updateBlock();
    generateBlock();
    gameOver(updateInterval);
  }, 17);
}

function updateBird() {
  const birdTop = Number(bird.style.top.replace("px", ""));
  if (bird.getBoundingClientRect().bottom <= containerBounds.bottom) {
    birdSpeed += gravity;
    birdSpeed *= limitFactor;
    bird.style.top = `${birdTop + birdSpeed}px`;
  } else {
    gameOverFlag = true; // bird fell on the ground
  }
}

function jump() {
  if (bird.getBoundingClientRect().top > containerBounds.top) {
    birdSpeed -= birdJump;
  }
}

function generateBlock() {
  if (count >= 70) {
    //generate block every 70*17 ms
    count = 0;
    const block = document.createElement("div");
    console.log();
    block.style.left = containerBounds.right + "px";
    block.style.height = containerBounds.height + "px";
    block.classList.add("block");
    block.setAttribute("passed", "false");
    const hole = document.createElement("div");
    hole.classList.add("hole");
    const blockEnd1 = document.createElement("div");
    const blockEnd2 = document.createElement("div");
    blockEnd1.classList.add("top");
    blockEnd2.classList.add("bottom");
    hole.appendChild(blockEnd1);
    hole.appendChild(blockEnd2);
    hole.style.top = getRandomHolePos() + "%";
    block.appendChild(hole);
    container.appendChild(block);
  }
  ++count;
}

function getRandomHolePos() {
  return 12 + Math.floor(Math.random() * (60 - 15));
}

function updateBlock() {
  const blocks = document.querySelectorAll(".block");
  //
  blocks.forEach((block) => {
    blockMove(block);
    checkCollision(block);
    updateScore(block);
  });
}

function blockMove(block) {
  const blockLeft = Number(block.style.left.replace("px", ""));

  if (block.getBoundingClientRect().right < containerBounds.left) {
    block.remove();
  } else {
    block.style.left = blockLeft - blockSpeed + "px";
  }
}

function checkCollision(block) {
  const blockBounds = block.getBoundingClientRect();
  const birdBounds = bird.getBoundingClientRect();
  const holeBounds = block.firstElementChild.getBoundingClientRect();
  if (
    birdBounds.right > blockBounds.left - blockWidthOffset + 3 &&
    birdBounds.left < blockBounds.right + blockWidthOffset - 3 &&
    (birdBounds.top < holeBounds.top - 3 ||
      birdBounds.bottom > holeBounds.bottom + 3)
  ) {
    gameOverFlag = true;
  }
}

function updateScore(block) {
  const blockBounds = block.getBoundingClientRect();
  const birdBounds = bird.getBoundingClientRect();
  if (
    birdBounds.left > blockBounds.right + 1 &&
    block.getAttribute("passed") === "false"
  ) {
    score++;
    scoreElm.textContent = score;
    block.setAttribute("passed", "true");
  }
}

function setHighScore() {
  const highScore = localStorage.getItem("highscore");
  if (highScore === null || score > Number(highScore)) {
    localStorage.setItem("highscore", score);
    document.querySelector("#high-score").firstElementChild.textContent = score;
  }
  else {
    document.querySelector("#high-score").firstElementChild.textContent = highScore;
  } 
}

function gameOver(updateInterval) {
  if (gameOverFlag) {
    gameOverFlag = false;
    clearInterval(updateInterval);
    document.querySelector("#restart").style.display = "block";
    document.querySelector("#rst-score").firstElementChild.textContent = score;
    setHighScore();
  }
}
