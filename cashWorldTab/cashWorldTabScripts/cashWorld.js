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
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();
  }
}

function screenToGrid(mouseX, mouseY) {
  const centerX = canvas.width / 2 + offsetX;
  const centerY = canvas.height / 2 + offsetY;

  const x = (mouseX - centerX) / zoom;
  const y = (mouseY - centerY) / zoom;

  const gridX = Math.floor((x / (tileWidth / 2) + y / (tileHeight / 2)) / 2);
  const gridY = Math.floor((y / (tileHeight / 2) - x / (tileWidth / 2)) / 2);

  return { gridX, gridY };
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  const centerX = canvas.width / 2 + offsetX;
  const centerY = canvas.height / 2 + offsetY;

  ctx.translate(centerX, centerY);
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

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
