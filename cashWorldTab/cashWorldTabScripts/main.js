// main.js - Entry point and game loop

import { Camera } from './camera.js';
import { InputHandler } from './input.js';
import { ChunkManager } from './chunkManager.js';
import { GridRenderer } from './gridRenderer.js';
import { MiniMap } from './miniMap.js';
import { loadBiomeImage, findLandSpawn } from './biomeImageLoader.js';

const canvas = document.getElementById('cash-world-canvas');
const ctx = canvas.getContext('2d');

const camera = new Camera(canvas);
const input = new InputHandler(camera, canvas);

function updateCameraSize() {
    camera.width = canvas.width;
    camera.height = canvas.height;
}
window.addEventListener("resize", updateCameraSize);
updateCameraSize();

let debugMode = false;
let seed = Math.floor(Math.random() * 100000);
const chunkManager = new ChunkManager(seed);
const gridRenderer = new GridRenderer(ctx, camera, chunkManager, input);

// Create and position minimap
const miniMapCanvas = document.createElement('canvas');
miniMapCanvas.width = 200;
miniMapCanvas.height = 200;
miniMapCanvas.id = 'minimap';
miniMapCanvas.style.position = 'absolute';
miniMapCanvas.style.bottom = '20px';
miniMapCanvas.style.right = '20px';
miniMapCanvas.style.border = '2px solid #fff';
miniMapCanvas.style.background = '#000';
miniMapCanvas.style.zIndex = '10';
document.querySelector('.game-content').appendChild(miniMapCanvas);

const minimap = new MiniMap(miniMapCanvas, chunkManager, camera);

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') debugMode = !debugMode;
    if (e.key.toLowerCase() === 'r') {
        seed = Math.floor(Math.random() * 100000);
        chunkManager.reset(seed);
        debugMode = false;
        findLandSpawn((x, y) => {
            camera.x = x;
            camera.y = y;
        });
    }
});

loadBiomeImage(() => {
    findLandSpawn((x, y) => {
        camera.x = x;
        camera.y = y;
        requestAnimationFrame(gameLoop);
    });
});

function gameLoop() {
    input.update();
    chunkManager.requestVisibleChunks(camera);
    gridRenderer.clear();
    gridRenderer.renderChunks();
    if (debugMode) gridRenderer.renderDebugInfo();
    if (chunkManager.isLoading()) gridRenderer.renderLoadingOverlay();
    minimap.update();
    requestAnimationFrame(gameLoop);
}
