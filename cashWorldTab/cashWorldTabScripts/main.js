import { updateCamera } from "./camera.js";
import { drawGrid } from "./gridRenderer.js";
import { setupInputListeners } from "./input.js";
import { loadBiomeImages } from "./tileSprites.js";
import { generateChunksAround } from "./chunkManager.js";
import { offsetX, offsetY } from "./camera.js";
import { tileWidth, tileHeight } from "./tileMath.js";

setupInputListeners();
loadBiomeImages();

function loop() {
  const cameraTileX = Math.floor(-offsetX / tileWidth);
  const cameraTileY = Math.floor(-offsetY / tileHeight);

  generateChunksAround(cameraTileX, cameraTileY);
  updateCamera();
  drawGrid();

  requestAnimationFrame(loop);
}

loop();
