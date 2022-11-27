import config from "./config.json" assert { type: "json" };

const startButton = document.querySelector("button");
const canvas = document.getElementById("myCanvas");

let intervalIdx = 0;

startButton.addEventListener("click", handleClick);

function handleClick() {
  startButton.classList.add("hidden");
  canvas.style.backgroundImage = "none";
  document.addEventListener("keydown", handleListener);
  intervalIdx = setInterval(() => {
    letters.push({
      letter: config.letters[Math.floor(Math.random() * config.letters.length)],
      x: Math.floor(Math.random() * canvas.width),
      y: 0,
      fillColor:
        config.colors[Math.floor(Math.random() * config.colors.length)],
      strokeColor:
        config.colors[Math.floor(Math.random() * config.colors.length)],
    });
  }, 300);
  setTimeout(() => {
    clearInterval(intervalIdx);
    intervalIdx = 0;
  }, 20000);
  draw();
}

function handleListener(e) {
  const length = letters.length;
  letters = letters.filter((letter) => letter.letter !== e.key.toUpperCase());
  const newLength = letters.length;
  score += length - newLength;
}

let ctx = canvas.getContext("2d");
let ballRadius = 24;
let x = Math.floor(Math.random() * canvas.width);
let y = 30;
let dx = 2;
let dy = 2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];

let letters = [];

function drawLetters() {
  ctx.font = config.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < letters.length; i += 1) {
    ctx.fillStyle = letters[i].fillColor;
    ctx.fillText(letters[i].letter, letters[i].x, letters[i].y);
    ctx.strokeStyle = letters[i].strokeColor;
    ctx.strokeText(letters[i].letter, letters[i].x, letters[i].y);
    letters[i].y += dy;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  letters = collisions();
  drawLetters();
  drawScore();
  if (intervalIdx !== 0) {
    requestAnimationFrame(draw);
  } else {
    requestAnimationFrame(gameOver);
  }
}

function collisions() {
  return letters.filter((letter) => letter.y < canvas.height);
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 20, 20);
}

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "52px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
}
