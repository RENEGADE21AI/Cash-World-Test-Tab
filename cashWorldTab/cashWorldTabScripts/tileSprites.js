// tileSprites.js
import { TILE_WIDTH, TILE_HEIGHT } from './tileMath.js';

export const biomeColors = {
  desert: "#e2ca76",
  coniferous_forest: "#2f9a01",
  grassland: "#8dd031",
  deciduous_forest: "#37b500",
  rainforest: "#157f15",
  tundra: "#dce1e1",
  shrubland: "#aacb4b",
  ocean: "#3d85c6"
};

export function drawTile(ctx, biome, screenX, screenY, scale) {
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.scale(scale, scale);
  ctx.fillStyle = biomeColors[biome] || 'gray';
  ctx.beginPath();
  ctx.moveTo(0, -TILE_HEIGHT / 2);
  ctx.lineTo(TILE_WIDTH / 2, 0);
  ctx.lineTo(0, TILE_HEIGHT / 2);
  ctx.lineTo(-TILE_WIDTH / 2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.restore();
}
