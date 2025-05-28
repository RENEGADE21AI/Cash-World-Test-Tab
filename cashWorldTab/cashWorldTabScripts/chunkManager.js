import { worldWidth, worldHeight, tileMap } from "./tileData.js";
import { getBiome } from "./biomeLookup.js";
import { SimplexNoise } from "./simplex-noise.js";

const CHUNK_SIZE = 32;
const seed = 12345;

const tempNoise = new SimplexNoise(seed);
const humidityNoise = new SimplexNoise(seed * 2);

const chunkCache = new Map(); // key: "x_y" → value: true if generated

function getChunkKey(chunkX, chunkY) {
  return `${chunkX}_${chunkY}`;
}

export function isChunkGenerated(chunkX, chunkY) {
  return chunkCache.has(getChunkKey(chunkX, chunkY));
}

export function generateChunk(chunkX, chunkY) {
  if (isChunkGenerated(chunkX, chunkY)) return;

  const startX = chunkX * CHUNK_SIZE;
  const startY = chunkY * CHUNK_SIZE;

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
      const worldX = startX + x;
      const worldY = startY + y;

      if (worldX >= worldWidth || worldY >= worldHeight) continue;

      const nx = worldX / 50;
      const ny = worldY / 50;

      const temp = (tempNoise.noise2D(nx, ny) + 1) / 2;
      const humidity = (humidityNoise.noise2D(nx + 100, ny + 100) + 1) / 2;
      const biome = getBiome(temp, humidity);

      tileMap[worldX][worldY] = {
        biome,
        temp,
        humidity,
      };
    }
  }

  chunkCache.set(getChunkKey(chunkX, chunkY), true);
}

export function generateChunksAround(cameraX, cameraY, tileDrawRadius = 30) {
  const chunkRadius = Math.ceil(tileDrawRadius / CHUNK_SIZE);

  const centerChunkX = Math.floor(cameraX / CHUNK_SIZE);
  const centerChunkY = Math.floor(cameraY / CHUNK_SIZE);

  for (let dx = -chunkRadius; dx <= chunkRadius; dx++) {
    for (let dy = -chunkRadius; dy <= chunkRadius; dy++) {
      generateChunk(centerChunkX + dx, centerChunkY + dy);
    }
  }
}
