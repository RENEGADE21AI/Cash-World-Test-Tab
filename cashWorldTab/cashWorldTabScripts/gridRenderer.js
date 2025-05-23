import { gridToScreen, isMouseInsideTile, getWorldMouseCoords, tileWidth, tileHeight } from "./tileMath.js";
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
  let hoverTile = null;

  for (let x = 0; x < worldWidth; x++) {
    for (let y = 0; y < worldHeight; y++) {
      const { x: screenX, y: screenY } = gridToScreen(x, y);
      const isHovered = isMouseInsideTile(worldMouseX, worldMouseY, screenX, screenY);

      const biome = tileMap[x][y].biome;
      const sprite = biomeImages[biome.toLowerCase()];
      if (sprite) ctx.drawImage(sprite, screenX - tileWidth / 2, screenY, tileWidth, tileHeight);

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
