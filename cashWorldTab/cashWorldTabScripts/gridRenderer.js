import {
  gridToScreen,
  isMouseInsideTile,
  getWorldMouseCoords,
  getVisibleTileBounds,
  tileWidth,
  tileHeight
} from "./tileMath.js";
import { zoom, offsetX, offsetY } from "./camera.js";
import { tileMap, worldWidth, worldHeight } from "./tileData.js";
import { biomeImages } from "./tileSprites.js";

const canvas = document.getElementById("cash-world-canvas");
const ctx = canvas.getContext("2d");

export function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(zoom, zoom);
  ctx.imageSmoothingEnabled = false;

  const { x: worldMouseX, y: worldMouseY } = getWorldMouseCoords();
  const bounds = getVisibleTileBounds(canvas);
  let hoverTile = null;

  for (let x = bounds.startX; x <= bounds.endX; x++) {
    if (x < 0 || x >= worldWidth) continue;

    for (let y = bounds.startY; y <= bounds.endY; y++) {
      if (y < 0 || y >= worldHeight) continue;

      const { x: screenX, y: screenY } = gridToScreen(x, y);
      const isHovered = isMouseInsideTile(worldMouseX, worldMouseY, screenX, screenY);

      const biome = tileMap[x][y].biome;
      const sprite = biomeImages[biome.toLowerCase()];
      if (sprite) {
        ctx.drawImage(sprite, screenX - tileWidth / 2, screenY, tileWidth, tileHeight);
      }

      if (isHovered && !hoverTile) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2 / zoom;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + tileWidth / 2, screenY + tileHeight / 2);
        ctx.lineTo(screenX, screenY + tileHeight);
        ctx.lineTo(screenX - tileWidth / 2, screenY + tileHeight / 2);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}
