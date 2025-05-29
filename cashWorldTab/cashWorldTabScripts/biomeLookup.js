// biomeLookup.js - Determine biome from temp/humidity

// Simple example biome selection
export function getBiome(temp, humidity) {
    if (temp > 0.7) {
        return humidity < 0.3 ? 'desert' : 'grassland';
    }
    if (temp > 0.3) {
        return humidity > 0.5 ? 'forest' : 'plains';
    }
    return 'tundra';
}
