import { updateCamera } from "./camera.js";
import { drawGrid } from "./gridRenderer.js";
import { setupInputListeners } from "./input.js";
import { generateBiomes } from "./biomeGenerator.js";
import { loadBiomeImages } from "./tileSprites.js";

setupInputListeners();
loadBiomeImages();
generateBiomes();

function loop() {
  updateCamera();
  drawGrid();
  requestAnimationFrame(loop);
}

loop();
