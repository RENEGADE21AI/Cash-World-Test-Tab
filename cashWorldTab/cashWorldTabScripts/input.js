// input.js - Keyboard/mouse input for camera control and hover detection

export class InputHandler {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.mousePos = { x: 0, y: 0 };  // Last mouse position

        // Pan with arrow keys (or WASD)
        window.addEventListener('keydown', (e) => {
            const panSpeed = 20;
            switch(e.key) {
                case 'ArrowUp':
                case 'w': this.camera.pan(0, -panSpeed); break;
                case 'ArrowDown':
                case 's': this.camera.pan(0, panSpeed); break;
                case 'ArrowLeft':
                case 'a': this.camera.pan(-panSpeed, 0); break;
                case 'ArrowRight':
                case 'd': this.camera.pan(panSpeed, 0); break;
            }
        });

        // Track mouse for debug overlay (accounting for canvas scale)
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            this.mousePos.x = (e.clientX - rect.left) * scaleX;
            this.mousePos.y = (e.clientY - rect.top) * scaleY;
        });
    }

    update() {
        // Reserved for drag-pan or future inputs
    }
}
