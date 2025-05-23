export const worldWidth = 300;
export const worldHeight = 300;

export const tileMap = Array.from({ length: worldWidth }, () =>
  Array.from({ length: worldHeight }, () => ({
    biome: 'plains', // default
    temp: 0,
    humidity: 0,
  }))
);
