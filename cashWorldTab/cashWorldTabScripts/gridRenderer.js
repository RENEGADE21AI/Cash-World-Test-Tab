import { gridToScreen, isMouseInsideTile, getWorldMouseCoords, tileWidth, tileHeight } from "./tileMath.js";
import { zoom, offsetX, offsetY } from "./camera.js";

const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

const gridCols = 300;
const gridRows = 300;

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

export function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(zoom, zoom);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1 / zoom;

  const { x: worldMouseX, y: worldMouseY } = getWorldMouseCoords();
  let hoverTile = null;

  for (let x = -gridCols; x < gridCols; x++) {
    for (let y = -gridRows; y < gridRows; y++) {
      const { x: screenX, y: screenY } = gridToScreen(x, y);
      const isHovered = isMouseInsideTile(worldMouseX, worldMouseY, screenX, screenY);
      if (isHovered && !hoverTile) hoverTile = { x, y };
      drawIsometricTile(screenX, screenY, isHovered);
    }
  }

  ctx.restore();
}
