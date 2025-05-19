const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

// Isometric tile size
const tileWidth = 128;
const tileHeight = 64;

// Camera settings
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
const moveSpeed = 10;
const zoomStep = 0.1;
const zoomMin = 0.05;
const zoomMax = 2.5;

const gridCols = 300;
const gridRows = 300;

const keysPressed = {};
let mouseX = 0;
let mouseY = 0;

// Input events
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
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// Movement logic
function update() {
  if (keysPressed["w"] || keysPressed["arrowup"]) offsetY += moveSpeed;
  if (keysPressed["a"] || keysPressed["arrowleft"]) offsetX += moveSpeed;
  if (keysPressed["s"] || keysPressed["arrowdown"]) offsetY -= moveSpeed;
  if (keysPressed["d"] || keysPressed["arrowright"]) offsetX -= moveSpeed;
}

// Tile rendering
function drawIsometricTile(x, y, highlight = false) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
  ctx.lineTo(x, y + tileHeight);
  ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2);
  ctx.closePath();
  ctx.stroke();

  if (highlight) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fill();
  }
}

// NEW: Accurate mouse → grid coordinate conversion
function screenToGrid(mouseX, mouseY) {
  const rect = canvas.getBoundingClientRect();

  // 1. Convert screen space to canvas space
  const canvasX = (mouseX - rect.left);
  const canvasY = (mouseY - rect.top);

  // 2. Convert to world space
  const worldX = (canvasX - canvas.width / 2) / zoom - offsetX;
  const worldY = (canvasY - canvas.height / 2) / zoom - offsetY;

  // 3. Apply inverse isometric projection
  const gridX = Math.round((worldY / (tileHeight / 2) + worldX / (tileWidth / 2)) / 2);
  const gridY = Math.round((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);

  return { gridX, gridY };
}

// Rendering loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Apply camera transform
  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(zoom, zoom);
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1 / zoom;

  const { gridX: hoverX, gridY: hoverY } = screenToGrid(mouseX, mouseY);

  for (let x = -gridCols; x < gridCols; x++) {
    for (let y = -gridRows; y < gridRows; y++) {
      const screenX = (x - y) * (tileWidth / 2);
      const screenY = (x + y) * (tileHeight / 2);
      const isHover = x === hoverX && y === hoverY;
      drawIsometricTile(screenX, screenY, isHover);
    }
  }

  ctx.restore();
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
