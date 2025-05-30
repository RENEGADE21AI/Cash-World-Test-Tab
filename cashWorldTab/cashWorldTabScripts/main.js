// main.js - Game loop and initialization

import { Camera } from './camera.js';
import { InputHandler } from './input.js';
import { ChunkManager } from './chunkManager.js';
import { GridRenderer } from './gridRenderer.js';

// Set up canvas
const canvas = document.getElementById('cash-world-canvas');
const ctx = canvas.getContext('2d');

// Initialize camera (handles pan/zoom) and input
const camera = new Camera(canvas);
const input = new InputHandler(camera, canvas);

// Game state
let debugMode = false;            // Toggle for debug overlay
let seed = Math.floor(Math.random() * 100000); // Initial random seed
const chunkManager = new ChunkManager(seed);
const gridRenderer = new GridRenderer(ctx, camera, chunkManager, input);

// Listen for key presses: F for debug, R for reset
window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        debugMode = !debugMode;
    }
    if (e.key === 'r' || e.key === 'R') {
        // Reset world: new seed, clear caches
        seed = Math.floor(Math.random() * 100000);
        chunkManager.reset(seed);
        debugMode = false;
    }
});

// Game loop: update camera/input, request chunks, render
function gameLoop() {
    input.update();                              // Handle panning/zoom from user input
    chunkManager.requestVisibleChunks(camera);   // Load/unload chunks based on camera

    // Clear and render
    gridRenderer.clear();
    gridRenderer.renderChunks();

    // Debug info (tile under cursor) on top
    if (debugMode) {
        gridRenderer.renderDebugInfo();
    }
    // Loading overlay if any chunks are still generating
    if (chunkManager.isLoading()) {
        gridRenderer.renderLoadingOverlay();
    }

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
