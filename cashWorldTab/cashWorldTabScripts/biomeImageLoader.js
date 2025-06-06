// biomeImageLoader.js
import { biomeColorMap } from './biomeColorMap.js';

let biomeImage = null;
let biomeCanvas = document.createElement('canvas');
let biomeCtx = biomeCanvas.getContext('2d');
let imageData = null;

// Load the biome map image once
export function loadBiomeImage(onReady) {
    biomeImage = new Image();
    biomeImage.src = 'cashWorldTabImages/biome-map-of-the-world.png';
    biomeImage.onload = () => {
        biomeCanvas.width = biomeImage.width;
        biomeCanvas.height = biomeImage.height;
        biomeCtx.drawImage(biomeImage, 0, 0);
        imageData = biomeCtx.getImageData(0, 0, biomeImage.width, biomeImage.height).data;
        onReady();
    };
}

export function getBiomeFromImage(x, y) {
    if (!imageData) return 'ocean';

    // World wrap and scaling
    const imgX = Math.floor((x % biomeImage.width + biomeImage.width) % biomeImage.width);
    const imgY = Math.floor((y % biomeImage.height + biomeImage.height) % biomeImage.height);
    const index = (imgY * biomeImage.width + imgX) * 4;

    const r = imageData[index];
    const g = imageData[index + 1];
    const b = imageData[index + 2];

    const hex = rgbToHex(r, g, b);
    return biomeColorMap[hex.toLowerCase()] || 'ocean';
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
