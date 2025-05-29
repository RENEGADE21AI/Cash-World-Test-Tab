// tileMath.js - Grid math for isometric tile positioning

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

// Convert tile (grid) coords to screen (isometric) coords
export function isoToScreen(gridX, gridY) {
    const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
    const screenY = (gridX + gridY) * (TILE_HEIGHT / 2);
    return { x: screenX, y: screenY };
}

// Convert screen (isometric) coords to tile (grid) coords
export function screenToIso(screenX, screenY) {
    const gridX = (screenX / (TILE_WIDTH/2) + screenY / (TILE_HEIGHT/2)) / 2;
    const gridY = (screenY / (TILE_HEIGHT/2) - screenX / (TILE_WIDTH/2)) / 2;
    return { x: gridX, y: gridY };
}
