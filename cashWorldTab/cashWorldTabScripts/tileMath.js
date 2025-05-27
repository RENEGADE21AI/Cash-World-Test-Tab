import { offsetX, offsetY, zoom, mouseX, mouseY } from "./camera.js";

export const tileWidth = 128;
export const tileHeight = 64;

export function gridToScreen(x, y) {
  return {
    x: (x - y) * (tileWidth / 2),
    y: (x + y) * (tileHeight / 2),
  };
}

export function isMouseInsideTile(mx, my, screenX, screenY) {
  const cx = screenX;
  const cy = screenY + tileHeight / 2;
  const dx = Math.abs(mx - cx) / (tileWidth / 2);
  const dy = Math.abs(my - cy) / (tileHeight / 2);
  return dx + dy <= 1;
}

export function getWorldMouseCoords() {
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-factor')) || 1;
  const canvas = document.getElementById("cash-world-canvas");

  return {
    x: (mouseX / scaleFactor - canvas.width / 2) / zoom - offsetX,
    y: (mouseY / scaleFactor - canvas.height / 2) / zoom - offsetY,
  };
}

export function getVisibleTileBounds(canvas) {
  const scaleFactor = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--scale-factor')
  ) || 1;

  const visibleWidth = canvas.width / zoom / scaleFactor;
  const visibleHeight = canvas.height / zoom / scaleFactor;

  const tilesWide = Math.ceil(visibleWidth / tileWidth);
  const tilesHigh = Math.ceil(visibleHeight / tileHeight);

  const centerX = Math.floor(-offsetX / tileWidth);
  const centerY = Math.floor(-offsetY / tileHeight);

  return {
    startX: Math.max(0, centerX - tilesWide),
    endX: centerX + tilesWide,
    startY: Math.max(0, centerY - tilesHigh),
    endY: centerY + tilesHigh,
  };
}
