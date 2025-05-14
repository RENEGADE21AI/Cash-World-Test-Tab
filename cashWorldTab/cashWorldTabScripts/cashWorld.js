const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

// Isometric tile dimensions
const tileWidth = 128;
const tileHeight = 64;

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

function drawIsometricTile(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y); // top
  ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2); // right
  ctx.lineTo(x, y + tileHeight); // bottom
  ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2); // left
  ctx.closePath();
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Translate to center of canvas with camera offset
  const centerX = canvas.width / 2 + offsetX;
  const centerY = canvas.height / 2 + offsetY;
  ctx.translate(centerX, centerY);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  const gridCols = 30;
  const gridRows = 30;

  for (let x = -gridCols; x < gridCols; x++) {
    for (let y = -gridRows; y < gridRows; y++) {
      const screenX = (x - y) * (tileWidth / 2);
      const screenY = (x + y) * (tileHeight / 2);
      drawIsometricTile(screenX, screenY);
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
