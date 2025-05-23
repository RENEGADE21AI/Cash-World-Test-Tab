export function getBiome(temp, humidity) {
  if (temp < 0.3) {
    if (humidity < 0.3) return "tundra";
    if (humidity < 0.6) return "forest";
    return "swamp";
  } else if (temp < 0.6) {
    if (humidity < 0.3) return "desert";
    if (humidity < 0.6) return "plains";
    return "jungle";
  } else {
    if (humidity < 0.3) return "desert";
    return "jungle";
  }
}
