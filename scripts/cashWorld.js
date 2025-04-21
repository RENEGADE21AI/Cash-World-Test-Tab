const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

const tileSize = 24;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
const moveSpeed = 10;

const keysPressed = {};

// Resize canvas to match visible .game-content area
function resizeCanvas() {
  const gameContent = document.querySelector(".game-content");
  const bounds = gameContent.getBoundingClientRect();
  canvas.width = bounds.width;
  canvas.height = bounds.height;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

// Input
document.addEventListener("keydown", (e) => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keysPressed[e.key.toLowerCase()] = false);

// Zoom
canvas.addEventListener("wheel", (e) => {
  zoom += e.deltaY < 0 ? 0.1 : -0.1;
  zoom = Math.max(0.2, Math.min(5, zoom));
  e.preventDefault();
});

// Scroll / pan
function update() {
  if (keysPressed["w"]) offsetY += moveSpeed / zoom;
  if (keysPressed["a"]) offsetX += moveSpeed / zoom;
  if (keysPressed["s"]) offsetY -= moveSpeed / zoom;
  if (keysPressed["d"]) offsetX -= moveSpeed / zoom;
}

// Draw visible tiles dynamically
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  const cols = Math.ceil(canvas.width / tileSize / zoom) + 2;
  const rows = Math.ceil(canvas.height / tileSize / zoom) + 2;
  const startX = Math.floor(-offsetX / zoom / tileSize);
  const startY = Math.floor(-offsetY / zoom / tileSize);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  for (let x = startX; x < startX + cols; x++) {
    for (let y = startY; y < startY + rows; y++) {
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.restore();
}

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resizeCanvas();
loop();
