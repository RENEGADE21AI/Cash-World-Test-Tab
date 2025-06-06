// chunkManager.js
import { getBiomeFromImage, loadBiomeImage } from './biomeImageLoader.js';
import { TileData } from './tileData.js';
import { screenToIso } from './tileMath.js';

export class ChunkManager {
  constructor(seed) {
    this.seed = seed;
    this.CHUNK_SIZE = 16;
    this.tileData = new TileData(seed);
    this.loadedChunks = new Map();
    this.loadingChunks = new Set();
    this.ready = false;

    loadBiomeImage(() => {
      this.ready = true;
    });
  }

  reset(newSeed) {
    this.seed = newSeed;
    this.tileData.clearCache();
    this.tileData = new TileData(newSeed);
    this.loadedChunks.clear();
    this.loadingChunks.clear();
    this.ready = false;
    loadBiomeImage(() => {
      this.ready = true;
    });
  }

  isLoading() {
    return this.loadingChunks.size > 0 || !this.ready;
  }

  requestVisibleChunks(camera) {
    if (!this.ready) return;

    const centerScreen = { x: camera.width / 2, y: camera.height / 2 };
    const worldCenter = camera.screenToWorld(centerScreen.x, centerScreen.y);
    const gridCenter = screenToIso(worldCenter.x, worldCenter.y);
    const centerTileX = Math.floor(gridCenter.x);
    const centerTileY = Math.floor(gridCenter.y);

    const centerCX = Math.floor(centerTileX / this.CHUNK_SIZE);
    const centerCY = Math.floor(centerTileY / this.CHUNK_SIZE);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        this.requestChunk(centerCX + dx, centerCY + dy);
      }
    }

    this.unloadDistantChunks(centerCX, centerCY);
  }

  requestChunk(cx, cy) {
    const key = `${cx},${cy}`;
    if (this.loadedChunks.has(key) || this.loadingChunks.has(key)) return;

    const cached = this.tileData.getChunk(cx, cy);
    if (cached) {
      this.loadedChunks.set(key, cached);
    } else {
      this.loadingChunks.add(key);
      setTimeout(() => {
        const chunk = this.generateChunk(cx, cy);
        this.tileData.saveChunk(cx, cy, chunk);
        this.loadedChunks.set(key, chunk);
        this.loadingChunks.delete(key);
      }, 50);
    }
  }

  unloadDistantChunks(centerCX, centerCY) {
    for (let key of Array.from(this.loadedChunks.keys())) {
      const [cx, cy] = key.split(',').map(Number);
      if (Math.abs(cx - centerCX) > 2 || Math.abs(cy - centerCY) > 2) {
        this.loadedChunks.delete(key);
      }
    }
  }

  generateChunk(cx, cy) {
    const size = this.CHUNK_SIZE;
    let data = new Array(size);

    for (let ty = 0; ty < size; ty++) {
      data[ty] = new Array(size);
      for (let tx = 0; tx < size; tx++) {
        const globalX = cx * size + tx;
        const globalY = cy * size + ty;
        const biome = getBiomeFromImage(globalX, globalY);
        data[ty][tx] = { biome };
      }
    }

    return data;
  }
}
