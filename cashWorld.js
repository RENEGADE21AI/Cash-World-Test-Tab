const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

const tileSize = 24;
let scale = 1;
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
const moveSpeed = 10;

const keysPressed = {};

document.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

canvas.addEventListener("wheel", (e) => {
  const zoomSpeed = 0.1;
  if (e.deltaY < 0) {
    scale += zoomSpeed;
  } else {
    scale = Math.max(0.1, scale - zoomSpeed);
  }
  e.preventDefault();
});

function update() {
  if (keysPressed["w"]) offsetY += moveSpeed / scale;
  if (keysPressed["a"]) offsetX += moveSpeed / scale;
  if (keysPressed["s"]) offsetY -= moveSpeed / scale;
  if (keysPressed["d"]) offsetX -= moveSpeed / scale;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const cols = Math.ceil(canvas.width / tileSize / scale) + 2;
  const rows = Math.ceil(canvas.height / tileSize / scale) + 2;
  const startX = -offsetX / scale - tileSize;
  const startY = -offsetY / scale - tileSize;

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  for (let x = Math.floor(startX / tileSize); x < startX / tileSize + cols; x++) {
    for (let y = Math.floor(startY / tileSize); y < startY / tileSize + rows; y++) {
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
