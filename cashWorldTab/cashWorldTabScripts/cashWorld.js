const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

// Isometric tile size
const tileWidth = 128;
const tileHeight = 64;

// Camera offsets and zoom
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
const moveSpeed = 10;
const zoomStep = 0.1;
const zoomMin = 0.3;
const zoomMax = 2.5;

const keysPressed = {};

document.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY);
  if (delta > 0) {
    zoom = Math.max(zoomMin, zoom - zoomStep);
  } else {
    zoom = Math.min(zoomMax, zoom + zoomStep);
  }
});

function update() {
  if (keysPressed["w"] || keysPressed["arrowup"]) offsetY += moveSpeed;
  if (keysPressed["a"] || keysPressed["arrowleft"]) offsetX += moveSpeed;
  if (keysPressed["s"] || keysPressed["arrowdown"]) offsetY -= moveSpeed;
  if (keysPressed["d"] || keysPressed["arrowright"]) offsetX -= moveSpeed;
}

function drawIsometricTile(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
  ctx.lineTo(x, y + tileHeight);
  ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2);
  ctx.closePath();
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Center view and apply zoom and pan
  const centerX = canvas.width / 2 + offsetX;
  const centerY = canvas.height / 2 + offsetY;

  ctx.translate(centerX, centerY);
  ctx.scale(zoom, zoom);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1 / zoom; // Keep stroke width consistent when zoomed

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
