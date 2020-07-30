const container = document.querySelector("#container");
const bird = document.querySelector("#bird");
const score = document.querySelector("#score").firstElementChild;
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
let gameOverFlag = false;

eventsHandler();

function start() {
  startBt.style.display = "none";
  birdSpeed = 0;
  count = 0;
  gameOverFlag = false;
  update();
  generateBlock();
}

function restart() {
  document.querySelectorAll(".block").forEach((block) => block.remove());
  bird.style.top = "-20px";
  document.querySelector("#restart").style.display = "none";
  score.textContent = 0;
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
    updateScore();
    checkCollision();
    generateBlock();
    gameOver(updateInterval);
  }, 17);
}

function updateBird() {
  const birdTop = Number(
    window.getComputedStyle(bird).getPropertyValue("top").replace("px", "")
  );
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
    hole.innerHTML = `<div class="top"></div>
    <div class="bottom"></div>`;
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
    const blockLeft = Number(block.style.left.replace("px", ""));

    if (block.getBoundingClientRect().right < containerBounds.left) {
      block.remove();
    } else {
      block.style.left = blockLeft - blockSpeed + "px";
    }
  });
}

function checkCollision() {
  const blocks = document.querySelectorAll(".block");
  blocks.forEach((block) => {
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
  });
}

function gameOver(updateInterval) {
  if (gameOverFlag) {
    gameOverFlag = false;
    clearInterval(updateInterval);
    document.querySelector("#restart").style.display = "block";
    document.querySelector("#restart-content").children[1].textContent =
      score.textContent;
  }
}

function updateScore() {
  const blocks = document.querySelectorAll(".block");
  blocks.forEach((block) => {
    const blockBounds = block.getBoundingClientRect();
    const birdBounds = bird.getBoundingClientRect();
    if (
      birdBounds.left > blockBounds.right + 1 &&
      block.getAttribute("passed") === "false"
    ) {
      score.textContent = Number(score.textContent) + 1;
      block.setAttribute("passed", "true");
    }
  });
}
