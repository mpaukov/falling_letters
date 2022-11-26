const startButton = document.querySelector("button");
const canvas = document.getElementById("myCanvas");

startButton.addEventListener("click", handleClick);

function handleClick() {
  startButton.classList.add("hidden");
  canvas.style.backgroundImage = "none";
  document.addEventListener("keydown", handleListener);
  draw();
}

function handleListener(e) {
  console.log("e", e);
}

let ctx = canvas.getContext("2d");
let ballRadius = 24;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
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

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.closePath();
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "green";
  ctx.fillText("E", x, y + 2);
  ctx.strokeStyle = "red";
  ctx.strokeText("E", x, y + 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  requestAnimationFrame(draw);
}
