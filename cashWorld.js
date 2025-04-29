const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

const tileSize = 24;
let offsetX = 0;
let offsetY = 0;
const moveSpeed = 10;
const keysPressed = {};

document.addEventListener("keydown", (e) => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keysPressed[e.key.toLowerCase()] = false);

function update() {
  if (keysPressed["w"]) offsetY += moveSpeed;
  if (keysPressed["a"]) offsetX += moveSpeed;
  if (keysPressed["s"]) offsetY -= moveSpeed;
  if (keysPressed["d"]) offsetX -= moveSpeed;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(offsetX, offsetY);

  const cols = Math.ceil(canvas.width / tileSize);
  const rows = Math.ceil(canvas.height / tileSize);

  const startX = Math.floor(-offsetX / tileSize);
  const startY = Math.floor(-offsetY / tileSize);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  for (let x = startX; x < startX + cols; x++) {
    for (let y = startY; y < startY + rows; y++) {
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
