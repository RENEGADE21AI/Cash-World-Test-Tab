const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

const tileWidth = 128;
const tileHeight = 64;

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

// Keyboard & zoom input
document.addEventListener("keydown", (e) => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keysPressed[e.key.toLowerCase()] = false);
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY);
  if (delta > 0) zoom = Math.max(zoomMin, zoom - zoomStep);
  else zoom = Math.min(zoomMax, zoom + zoomStep);
});
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function update() {
  if (keysPressed["w"] || keysPressed["arrowup"]) offsetY += moveSpeed;
  if (keysPressed["a"] || keysPressed["arrowleft"]) offsetX += moveSpeed;
  if (keysPressed["s"] || keysPressed["arrowdown"]) offsetY -= moveSpeed;
  if (keysPressed["d"] || keysPressed["arrowright"]) offsetX -= moveSpeed;
}

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

// Forward projection: grid → screen coords
function gridToScreen(gridX, gridY) {
  const screenX = (gridX - gridY) * (tileWidth / 2);
  const screenY = (gridX + gridY) * (tileHeight / 2);
  return { x: screenX, y: screenY };
}

// Point-in-diamond test (for hover accuracy)
function isPointInDiamond(px, py, tileX, tileY) {
  const cx = tileX;
  const cy = tileY + tileHeight / 2;
  const dx = Math.abs(px - cx) / (tileWidth / 2);
  const dy = Math.abs(py - cy) / (tileHeight / 2);
  return dx + dy <= 1;
}

// Accurate hover detection using diamond hit test
function findHoveredTile(mouseX, mouseY) {
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-factor')) || 1;
  const rect = canvas.getBoundingClientRect();

  const scaledX = (mouseX - rect.left) / scaleFactor;
  const scaledY = (mouseY - rect.top) / scaleFactor;

  const worldX = (scaledX - canvas.width / 2) / zoom - offsetX;
  const worldY = (scaledY - canvas.height / 2) / zoom - offsetY;

  // Estimate tile location
  const estX = Math.floor((worldY / (tileHeight / 2) + worldX / (tileWidth / 2)) / 2);
  const estY = Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);

  // Search 3x3 surrounding tiles for accurate hit
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const gx = estX + dx;
      const gy = estY + dy;
      const { x: sx, y: sy } = gridToScreen(gx, gy);
      if (isPointInDiamond(worldX, worldY, sx, sy)) {
        return { gridX: gx, gridY: gy };
      }
    }
  }

  return { gridX: estX, gridY: estY }; // fallback
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(zoom, zoom);
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1 / zoom;

  const { gridX: hoverX, gridY: hoverY } = findHoveredTile(mouseX, mouseY);

  for (let x = -gridCols; x < gridCols; x++) {
    for (let y = -gridRows; y < gridRows; y++) {
      const { x: screenX, y: screenY } = gridToScreen(x, y);
      const isHover = x === hoverX && y === hoverY;
      drawIsometricTile(screenX, screenY, isHover);
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
