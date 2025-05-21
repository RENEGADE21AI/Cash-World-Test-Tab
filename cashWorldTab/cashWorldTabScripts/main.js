import { updateCamera } from "./camera.js";
import { drawGrid } from "./gridRenderer.js";
import { setupInputListeners } from "./input.js";

setupInputListeners();

function loop() {
  updateCamera();
  drawGrid();
  requestAnimationFrame(loop);
}

loop();
