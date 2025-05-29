// tileSprites.js - Manage tile drawing (placeholder colors)

import { TILE_WIDTH, TILE_HEIGHT } from './tileMath.js';

// Colors for each biome (replace with actual images if available)
const biomeColors = {
    desert: '#EDC9AF',
    grassland: '#7CFC00',
    forest: '#228B22',
    plains: '#ADFF2F',
    tundra: '#ADD8E6'
};

// Draw a single tile (as a diamond) at screen (x,y)
export function drawTile(ctx, biome, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);
    ctx.fillStyle = biomeColors[biome] || 'gray';
    ctx.beginPath();
    ctx.moveTo(0, -TILE_HEIGHT/2);
    ctx.lineTo(TILE_WIDTH/2, 0);
    ctx.lineTo(0, TILE_HEIGHT/2);
    ctx.lineTo(-TILE_WIDTH/2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.restore();
}
