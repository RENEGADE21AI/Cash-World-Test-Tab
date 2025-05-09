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

  // Center and apply faux-isometric transform
  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(Math.SQRT1_2, Math.SQRT1_2); // ≈ scale(0.707, 0.707)
  ctx.rotate(Math.PI / 4); // 45° in radians

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  const cols = Math.ceil(canvas.width / tileSize);
  const rows = Math.ceil(canvas.height / tileSize);

  const startX = -cols;
  const startY = -rows;
  const endX = cols;
  const endY = rows;

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
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
