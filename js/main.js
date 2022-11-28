import config from "./config.json" assert { type: "json" };

const startButton = document.querySelector("button");
const canvas = document.getElementById("myCanvas");

let intervalIdx = 0;
let timeoutIdx = 0;
let ctx = canvas.getContext("2d");
let dy = 2;
let score = 0;
let goldScore = 0;
let totalScore = 0;
let letters = [];
let explosions = [];

startButton.addEventListener("click", handleClick);

function handleClick() {
  startButton.classList.add("hidden");
  if (timeoutIdx) {
    clearTimeout(timeoutIdx);
  }
  canvas.classList.add("canvas");
  document.addEventListener("keydown", handleListener);
  intervalIdx = setInterval(() => {
    letters.push(letter());
  }, config.timeLetterRespawn);
  setTimeout(() => {
    clearInterval(intervalIdx);
    intervalIdx = 0;
  }, config.timeInterval);
  draw();
}

function handleListener(e) {
  new Audio(config.audio.click).play();
  const key = e.key.toUpperCase();
  const delLetters = letters.filter((letter) => letter.letter === key);
  delLetters.forEach((letter) => {
    if (letter.fillColor === "gold" && letter.strokeColor === "gold") {
      goldScore += 1;
    } else score += 1;
    totalScore = score + 2 * goldScore;
    explosions.push(new explosion(letter.x, letter.y));
  });
  letters = letters.filter((letter) => letter.letter !== key);
}

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
  drawExplosion();
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
  ctx.font = "36px serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + totalScore, 20, 20);
}

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = config.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 60);
  ctx.fillText(`Gold Score: ${goldScore}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    `Total Score: ${totalScore}`,
    canvas.width / 2,
    canvas.height / 2 + 60
  );
  startButton.classList.remove("hidden");
  document.removeEventListener("keydown", handleListener);
  timeoutIdx = setTimeout(() => {
    canvas.classList.remove("canvas");
  }, 5000);
  letters = [];
  explosions = [];
}

function letter() {
  const probability = Math.floor(Math.random() * 4);
  let fillColor;
  let strokeColor;
  if (probability === 3) {
    fillColor = config.colors[config.colors.length - 1];
    strokeColor = fillColor;
  } else {
    fillColor =
      config.colors[Math.floor(Math.random() * (config.colors.length - 1))];
    strokeColor =
      config.colors[Math.floor(Math.random() * (config.colors.length - 1))];
  }
  return {
    letter: config.letters[Math.floor(Math.random() * config.letters.length)],
    x: Math.floor(Math.random() * (canvas.width - 48)) + 24,
    y: 0,
    fillColor,
    strokeColor,
  };
}

function drawExplosion() {
  if (explosions.length === 0) {
    return;
  }

  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i];
    const projectiles = explosion.projectiles;

    if (projectiles.length === 0) {
      explosions.splice(i, 1);
      return;
    }

    const projectilesRemove = projectiles.slice();

    for (let ii = 0; ii < projectiles.length; ii++) {
      const projectile = projectiles[ii];

      // remove projectile if radius is below 0
      if (projectile.radius < 0) {
        projectilesRemove.splice(ii, 1);
        continue;
      }

      // draw
      ctx.beginPath();
      ctx.arc(
        projectile.x,
        projectile.y,
        projectile.radius,
        Math.PI * 2,
        0,
        false
      );
      ctx.closePath();
      ctx.fillStyle =
        "hsl(" + projectile.h + "," + projectile.s + "%," + projectile.l + "%)";
      ctx.fill();

      // update
      projectile.x -= projectile.vx;
      projectile.y -= projectile.vy;
      projectile.radius -= 0.02;

      // collisions
      if (projectile.x > canvas.width || projectile.x < 0) {
        projectile.vx *= -1;
      }
      if (projectile.y > canvas.height || projectile.y < 0) {
        projectile.vy *= -1;
      }
    }

    explosion.projectiles = projectilesRemove;
  }
}

function explosion(x, y) {
  this.projectiles = [];
  new Audio(config.audio.fire).play();
  for (let i = 0; i < 100; i++) {
    this.projectiles.push(new projectile(x, y));
  }
}

function projectile(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 2 + Math.random() * 4;
  this.vx = -10 + Math.random() * 20;
  this.vy = -10 + Math.random() * 20;
  this.h = 200;
  this.s = Math.floor(Math.random() * 100 + 70);
  this.l = Math.floor(Math.random() * 70 + 30);
}
