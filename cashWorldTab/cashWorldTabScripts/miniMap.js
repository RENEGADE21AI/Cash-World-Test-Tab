// miniMap.js - Minimap and full world map rendering

import { TILE_WIDTH, TILE_HEIGHT } from './tileMath.js';
import { biomeColors } from './tileSprites.js';

export class MiniMap {
    constructor(canvas, chunkManager, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chunkManager = chunkManager;
        this.camera = camera;

        this.size = 200; // square minimap
        this.scale = 2;  // pixels per tile
        this.fullMapVisible = false;

        this.fullCanvas = document.createElement('canvas');
        this.fullCanvas.width = 800;
        this.fullCanvas.height = 800;
        this.fullCanvas.id = 'world-map';
        this.fullCanvas.style.position = 'absolute';
        this.fullCanvas.style.left = 'calc(50% - 400px)';
        this.fullCanvas.style.top = 'calc(50% - 400px)';
        this.fullCanvas.style.border = '4px solid #fff';
        this.fullCanvas.style.background = '#111';
        this.fullCanvas.style.display = 'none';
        this.fullCanvas.style.zIndex = '20';

        document.getElementById("screen-container").appendChild(this.fullCanvas);

        this.fullCtx = this.fullCanvas.getContext('2d');

        canvas.addEventListener('click', () => this.toggleFullMap());
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.fullMapVisible) {
                this.fullCanvas.style.display = 'none';
                this.fullMapVisible = false;
            }
        });
    }

    toggleFullMap() {
        this.fullMapVisible = !this.fullMapVisible;
        this.fullCanvas.style.display = this.fullMapVisible ? 'block' : 'none';
    }

    drawMinimap() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.size, this.size);
        const tileScale = this.scale;

        const allKeys = Array.from(this.chunkManager.tileData.cache.keys());

        for (let key of allKeys) {
            const match = key.match(/tiledata_\d+_(-?\d+)_(-?\d+)/);
            if (!match) continue;
            const [, cxStr, cyStr] = match;
            const cx = parseInt(cxStr);
            const cy = parseInt(cyStr);
            const chunk = this.chunkManager.tileData.getChunk(cx, cy);
            if (!chunk) continue;

            for (let y = 0; y < chunk.length; y++) {
                for (let x = 0; x < chunk[0].length; x++) {
                    const tile = chunk[y][x];
                    const tx = cx * 16 + x;
                    const ty = cy * 16 + y;
                    ctx.fillStyle = biomeColors[tile.biome] || '#444';
                    ctx.fillRect(tx * tileScale, ty * tileScale, tileScale, tileScale);
                }
            }
        }

        // Draw camera view rectangle
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        const view = this.camera;
        const x = view.x / TILE_WIDTH;
        const y = view.y / TILE_HEIGHT;
        const w = view.width / TILE_WIDTH;
        const h = view.height / TILE_HEIGHT;

        ctx.strokeRect(x * tileScale, y * tileScale, w * tileScale, h * tileScale);
    }

    drawFullMap() {
        const ctx = this.fullCtx;
        ctx.clearRect(0, 0, this.fullCanvas.width, this.fullCanvas.height);
        const tileScale = 2;

        const keys = Array.from(this.chunkManager.tileData.cache.keys());

        for (let key of keys) {
            const match = key.match(/tiledata_\d+_(-?\d+)_(-?\d+)/);
            if (!match) continue;
            const [, cxStr, cyStr] = match;
            const cx = parseInt(cxStr);
            const cy = parseInt(cyStr);

            const chunk = this.chunkManager.tileData.getChunk(cx, cy);
            if (!chunk) continue;

            for (let y = 0; y < chunk.length; y++) {
                for (let x = 0; x < chunk[0].length; x++) {
                    const tile = chunk[y][x];
                    const tx = cx * 16 + x;
                    const ty = cy * 16 + y;
                    ctx.fillStyle = biomeColors[tile.biome] || '#444';
                    ctx.fillRect(tx * tileScale, ty * tileScale, tileScale, tileScale);
                }
            }
        }
    }

    update() {
        this.drawMinimap();
        if (this.fullMapVisible) {
            this.drawFullMap();
        }
    }
}
