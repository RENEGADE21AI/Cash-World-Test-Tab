import { tileMap, worldWidth, worldHeight } from "./tileData.js";
import { getBiome } from "./biomeLookup.js";
import { SimplexNoise } from "./simplex-noise.js";

const seed = 12345;
const tempNoise = new SimplexNoise(seed);
const humidityNoise = new SimplexNoise(seed * 2);

export function generateBiomes() {
  for (let x = 0; x < worldWidth; x++) {
    for (let y = 0; y < worldHeight; y++) {
      const nx = x / 50;
      const ny = y / 50;

      const temp = (tempNoise.noise2D(nx, ny) + 1) / 2;
      const humidity = (humidityNoise.noise2D(nx + 100, ny + 100) + 1) / 2;

      const biome = getBiome(temp, humidity);

      tileMap[x][y] = {
        biome,
        temp,
        humidity
      };
    }
  }
}
