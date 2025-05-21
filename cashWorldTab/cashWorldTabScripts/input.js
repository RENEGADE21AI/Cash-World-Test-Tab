import { keysPressed, updateMousePosition, zoomIn, zoomOut } from "./camera.js";

export function setupInputListeners() {
  document.addEventListener("keydown", (e) => {
    keysPressed[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keysPressed[e.key.toLowerCase()] = false;
  });

  const canvas = document.getElementById("cash-world-canvas");

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    if (delta > 0) zoomOut();
    else zoomIn();
  });

  canvas.addEventListener("mousemove", (e) => {
    updateMousePosition(e);
  });
}
