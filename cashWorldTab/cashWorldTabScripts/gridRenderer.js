// gridRenderer.js - Drawing tiles, LOD, overlays, and debug info

import { isoToScreen, screenToIso, TILE_WIDTH, TILE_HEIGHT } from './tileMath.js';
import { drawTile } from './tileSprites.js';

export class GridRenderer {
    constructor(ctx, camera, chunkManager, input) {
        this.ctx = ctx;
        this.camera = camera;
        this.chunkManager = chunkManager;
        this.input = input;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.camera.width, this.camera.height);
    }

    // Draw all visible chunks' tiles
    renderChunks() {
        const ctx = this.ctx;
        const cam = this.camera;

        // Level-of-Detail: skip tiles if zoomed out
        let step = 1;
        if (cam.scale < 0.5) step = 2;      // skip every other tile
        if (cam.scale < 0.25) step = 4;     // skip 3 out of 4

        // For each loaded chunk
        for (let key of this.chunkManager.loadedChunks.keys()) {
            const [cx, cy] = key.split(',').map(Number);
            const chunk = this.chunkManager.loadedChunks.get(key);

            // Draw each tile in chunk
            for (let ty = 0; ty < chunk.length; ty += step) {
                for (let tx = 0; tx < chunk[0].length; tx += step) {
                    const tile = chunk[ty][tx];
                    if (!tile) continue;
                    const gridX = cx * this.chunkManager.CHUNK_SIZE + tx;
                    const gridY = cy * this.chunkManager.CHUNK_SIZE + ty;

                    // Convert tile coordinate to screen position
                    const isoPos = isoToScreen(gridX, gridY);
                    // Apply camera transform and center on canvas
                    const screenX = (isoPos.x - cam.x) * cam.scale + cam.width/2;
                    const screenY = (isoPos.y - cam.y) * cam.scale + cam.height/2;

                    // Optionally, cull tiles outside viewport for performance
                    if (screenX < -TILE_WIDTH || screenX > cam.width + TILE_WIDTH ||
                        screenY < -TILE_HEIGHT || screenY > cam.height + TILE_HEIGHT) {
                        continue;
                    }

                    // Draw tile sprite or color
                    drawTile(ctx, tile.biome, screenX, screenY, cam.scale);
                }
            }
        }
    }

    // Draw a semi-transparent loading overlay
    renderLoadingOverlay() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.camera.width, this.camera.height);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', this.camera.width/2, this.camera.height/2);
    }

    // Draw debug info about hovered tile
    renderDebugInfo() {
        const ctx = this.ctx;
        const cam = this.camera;
        const { x: mx, y: my } = this.input.mousePos;
        // Convert mouse to world coords, then to grid coords
        const world = cam.screenToWorld(mx, my);
        const iso = screenToIso(world.x, world.y);
        const tileX = Math.floor(iso.x);
        const tileY = Math.floor(iso.y);

        // Find which chunk contains this tile
        const cx = Math.floor(tileX / this.chunkManager.CHUNK_SIZE);
        const cy = Math.floor(tileY / this.chunkManager.CHUNK_SIZE);
        const key = `${cx},${cy}`;
        let infoText = `Tile (${tileX},${tileY}) - No data`;
        if (this.chunkManager.loadedChunks.has(key)) {
            const chunk = this.chunkManager.loadedChunks.get(key);
            const tx = ((tileX % this.chunkManager.CHUNK_SIZE) + this.chunkManager.CHUNK_SIZE) % this.chunkManager.CHUNK_SIZE;
            const ty = ((tileY % this.chunkManager.CHUNK_SIZE) + this.chunkManager.CHUNK_SIZE) % this.chunkManager.CHUNK_SIZE;
            const tile = chunk[ty] && chunk[ty][tx];
            if (tile) {
                infoText = `Tile (${tileX},${tileY}) Biome: ${tile.biome} ` +
                           `Temp: ${tile.temp.toFixed(2)} Hum: ${tile.humidity.toFixed(2)}` +
                           ` Seed: ${this.chunkManager.seed}`;
            }
        }
        // Draw text background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(mx + 10, my + 10, 250, 60);
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(infoText, mx + 15, my + 30);
    }
}
