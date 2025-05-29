// camera.js - Camera position and zoom handling

export class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;  // World center X
        this.y = 0;  // World center Y
        this.scale = 1; // Zoom factor

        // Zoom with mouse wheel
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            // Zoom in/out
            const zoomAmount = 1 - e.deltaY * 0.001;
            const oldScale = this.scale;
            this.scale = Math.max(0.1, Math.min(this.scale * zoomAmount, 5));
            // Optional: adjust camera.x/y to zoom around cursor (not shown here)
        });
    }

    // Pan camera by delta
    pan(dx, dy) {
        this.x += dx / this.scale;
        this.y += dy / this.scale;
    }

    // Convert screen coordinates to world coords (accounting for camera center and zoom)
    screenToWorld(screenX, screenY) {
        const worldX = (screenX - this.width/2) / this.scale + this.x;
        const worldY = (screenY - this.height/2) / this.scale + this.y;
        return { x: worldX, y: worldY };
    }
}
