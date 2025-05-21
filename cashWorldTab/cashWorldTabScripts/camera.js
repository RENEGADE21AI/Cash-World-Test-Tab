export let offsetX = 0;
export let offsetY = 0;
export let zoom = 1;

const moveSpeed = 100;
const zoomStep = 0.1;
const zoomMin = 0.05;
const zoomMax = 2.5;

export const keysPressed = {};
export let mouseX = 0;
export let mouseY = 0;

export function updateCamera() {
  if (keysPressed["w"] || keysPressed["arrowup"]) offsetY += moveSpeed;
  if (keysPressed["a"] || keysPressed["arrowleft"]) offsetX += moveSpeed;
  if (keysPressed["s"] || keysPressed["arrowdown"]) offsetY -= moveSpeed;
  if (keysPressed["d"] || keysPressed["arrowright"]) offsetX -= moveSpeed;
}

export function zoomIn() {
  zoom = Math.min(zoomMax, zoom + zoomStep);
}

export function zoomOut() {
  zoom = Math.max(zoomMin, zoom - zoomStep);
}

export function updateMousePosition(e) {
  const rect = document.getElementById("cash-world-canvas").getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}
