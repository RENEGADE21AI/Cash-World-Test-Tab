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

// Input handling
document.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});
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

// Project grid → screen
function gridToScreen(x, y) {
  return {
    x: (x - y) * (tileWidth / 2),
    y: (x + y) * (tileHeight / 2),
  };
}

// Check if a point is in a diamond
function isMouseInsideTile(mouseX, mouseY, screenX, screenY) {
  const cx = screenX;
  const cy = screenY + tileHeight / 2;
  const dx = Math.abs(mouseX - cx) / (tileWidth / 2);
  const dy = Math.abs(mouseY - cy) / (tileHeight / 2);
  return dx + dy <= 1;
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(zoom, zoom);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1 / zoom;

  // Adjusted mouse position into world space
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-factor')) || 1;
  const worldMouseX = (mouseX / scaleFactor - canvas.width / 2) / zoom - offsetX;
  const worldMouseY = (mouseY / scaleFactor - canvas.height / 2) / zoom - offsetY;

  let hoverTile = null;

  for (let x = -gridCols; x < gridCols; x++) {
    for (let y = -gridRows; y < gridRows; y++) {
      const { x: screenX, y: screenY } = gridToScreen(x, y);
      const isHovered = isMouseInsideTile(worldMouseX, worldMouseY, screenX, screenY);

      if (isHovered && !hoverTile) {
        hoverTile = { x, y };
      }

      drawIsometricTile(screenX, screenY, isHovered);
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
