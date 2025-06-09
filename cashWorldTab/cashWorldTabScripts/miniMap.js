// miniMap.js
import { TILE_WIDTH, TILE_HEIGHT } from './tileMath.js';
import { biomeColorMap } from './biomeColorMap.js';

export class MiniMap {
    constructor(canvas, chunkManager, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chunkManager = chunkManager;
        this.camera = camera;

        this.size = 200;
        this.scale = 1;
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

        document.querySelector('.game-content').appendChild(this.fullCanvas);
        this.fullCtx = this.fullCanvas.getContext('2d');

        canvas.addEventListener('click', () => this.toggleFullMap());
        this.fullCanvas.addEventListener('click', (e) => this.handleFullMapClick(e));
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideFullMap();
        });
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1 : -1;
            this.scale = Math.max(1, Math.min(8, this.scale + delta));
        });
    }

    toggleFullMap() {
        this.fullMapVisible = !this.fullMapVisible;
        this.fullCanvas.style.display = this.fullMapVisible ? 'block' : 'none';
    }

    hideFullMap() {
        this.fullMapVisible = false;
        this.fullCanvas.style.display = 'none';
    }

    drawMinimap() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.size, this.size);
        const scale = this.scale;

        const camTileX = this.camera.x / TILE_WIDTH;
        const camTileY = this.camera.y / TILE_HEIGHT;

        for (let y = 0; y < this.size / scale; y++) {
            for (let x = 0; x < this.size / scale; x++) {
                const gx = Math.floor(camTileX - this.size / (2 * scale) + x);
                const gy = Math.floor(camTileY - this.size / (2 * scale) + y);
                const biome = this.chunkManager.getBiomeAt(gx, gy);
                ctx.fillStyle = biomeColorMap[biome] ? biomeColorMap[biome] : '#444';
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }

        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.size / 2 - 5, this.size / 2 - 5, 10, 10);
    }

    drawFullMap() {
        const ctx = this.fullCtx;
        ctx.clearRect(0, 0, this.fullCanvas.width, this.fullCanvas.height);
        const tileScale = 1;

        for (let y = 0; y < 365; y++) {
            for (let x = 0; x < 723; x++) {
                const biome = this.chunkManager.getBiomeAt(x, y);
                ctx.fillStyle = biomeColorMap[biome] ? biomeColorMap[biome] : '#444';
                ctx.fillRect(x * tileScale, y * tileScale, tileScale, tileScale);
            }
        }

        const camX = this.camera.x / TILE_WIDTH;
        const camY = this.camera.y / TILE_HEIGHT;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(camX, camY, 5, 5);
    }

    handleFullMapClick(e) {
        const rect = this.fullCanvas.getBoundingClientRect();
        const tx = Math.floor((e.clientX - rect.left));
        const ty = Math.floor((e.clientY - rect.top));
        this.camera.x = tx * TILE_WIDTH;
        this.camera.y = ty * TILE_HEIGHT;
        this.hideFullMap();
    }

    update() {
        this.drawMinimap();
        if (this.fullMapVisible) this.drawFullMap();
    }
}
