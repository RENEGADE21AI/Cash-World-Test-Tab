// input.js - Keyboard/mouse input for camera control and hover detection

export class InputHandler {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.mousePos = { x: 0, y: 0 };  // Last mouse position

        // Pan with arrow keys (could also use WASD)
        window.addEventListener('keydown', (e) => {
            const panSpeed = 20;
            switch(e.key) {
                case 'ArrowUp':    this.camera.pan(0, -panSpeed); break;
                case 'ArrowDown':  this.camera.pan(0,  panSpeed); break;
                case 'ArrowLeft':  this.camera.pan(-panSpeed, 0); break;
                case 'ArrowRight': this.camera.pan( panSpeed, 0); break;
            }
        });

        // Track mouse for debug overlay
        canvas.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.offsetX;
            this.mousePos.y = e.offsetY;
        });
    }

    // Placeholder for any future updates (e.g. smooth continuous movement)
    update() {
        // Could implement drag-to-pan here if desired
    }
}
