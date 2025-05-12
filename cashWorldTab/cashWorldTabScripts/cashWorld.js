const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

// Faux-isometric tile dimensions
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Center + rotate to faux-isometric
  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(Math.SQRT1_2, Math.SQRT1_2); // ≈ 0.707
  ctx.rotate(Math.PI / 4); // 45 degrees

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  const cols = Math.ceil(canvas.width / tileWidth) + 2;
  const rows = Math.ceil(canvas.height / tileHeight) + 2;

  const startX = -cols;
  const startY = -rows;

  for (let x = startX; x < startX + cols; x++) {
    for (let y = startY; y < startY + rows; y++) {
      ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
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
