// chunkManager.js - Async chunk loading/unloading and caching

import { getBiome } from './biomeLookup.js';
import { TileData } from './tileData.js';

export class ChunkManager {
    constructor(seed) {
        this.seed = seed;
        this.CHUNK_SIZE = 16;             // e.g. 16x16 tiles per chunk
        this.tileData = new TileData(seed);
        this.loadedChunks = new Map();    // Key "cx,cy" => chunk array
        this.loadingChunks = new Set();   // Tracks chunks currently generating
    }

    // Reset for a new seed
    reset(newSeed) {
        this.seed = newSeed;
        this.tileData = new TileData(newSeed);
        this.loadedChunks.clear();
        this.loadingChunks.clear();
    }

    // Check if any chunks are still loading
    isLoading() {
        return this.loadingChunks.size > 0;
    }

    // Request chunks that should be visible based on camera pos
    requestVisibleChunks(camera) {
        // Determine center tile coordinates
        const centerScreen = { x: camera.width/2, y: camera.height/2 };
        const worldCenter = camera.screenToWorld(centerScreen.x, centerScreen.y);
        const gridCenter = screenToIso(worldCenter.x, worldCenter.y);
        const centerTileX = Math.floor(gridCenter.x);
        const centerTileY = Math.floor(gridCenter.y);

        // Calculate chunk coords of center
        const centerCX = Math.floor(centerTileX / this.CHUNK_SIZE);
        const centerCY = Math.floor(centerTileY / this.CHUNK_SIZE);

        // Load chunks in a 3x3 region around center
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                this.requestChunk(centerCX + dx, centerCY + dy);
            }
        }
        // Unload distant chunks to save memory
        this.unloadDistantChunks(centerCX, centerCY);
    }

    // Start loading a specific chunk (if not already loaded/loading)
    requestChunk(cx, cy) {
        const key = `${cx},${cy}`;
        if (this.loadedChunks.has(key) || this.loadingChunks.has(key)) {
            return; // already done or in progress
        }
        // Check localStorage cache via TileData
        const cached = this.tileData.getChunk(cx, cy);
        if (cached) {
            this.loadedChunks.set(key, cached);
        } else {
            // Simulate async generation with a Promise + setTimeout
            this.loadingChunks.add(key);
            // Random delay for variation
            const delay = 200 + Math.random() * 800;
            new Promise(resolve => setTimeout(resolve, delay))
                .then(() => {
                    const chunk = this.generateChunk(cx, cy);
                    this.tileData.saveChunk(cx, cy, chunk);     // Save to cache (persists with localStorage:contentReference[oaicite:4]{index=4})
                    this.loadedChunks.set(key, chunk);
                    this.loadingChunks.delete(key);
                });
        }
    }

    // Remove chunks too far from (centerCX, centerCY)
    unloadDistantChunks(centerCX, centerCY) {
        for (let key of Array.from(this.loadedChunks.keys())) {
            const [cx, cy] = key.split(',').map(Number);
            // If chunk is more than 2 away in either direction, drop it
            if (Math.abs(cx - centerCX) > 2 || Math.abs(cy - centerCY) > 2) {
                this.loadedChunks.delete(key);
            }
        }
    }

    // Generate chunk data synchronously (temperature, humidity, biome)
    generateChunk(cx, cy) {
        const size = this.CHUNK_SIZE;
        let data = new Array(size);
        for (let ty = 0; ty < size; ty++) {
            data[ty] = new Array(size);
            for (let tx = 0; tx < size; tx++) {
                const globalX = cx * size + tx;
                const globalY = cy * size + ty;
                // Example: simple pseudo-random based on coordinates (could use noise)
                const temp = Math.random();
                const humidity = Math.random();
                const biome = getBiome(temp, humidity);
                data[ty][tx] = { temp, humidity, biome };
            }
        }
        return data;
    }
}
