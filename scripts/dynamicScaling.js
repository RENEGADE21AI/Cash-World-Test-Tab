// dynamicScaling.js
function scaleGame() {
    const screenContainer = document.getElementById("screen-container");

    const targetWidth = 2400;
    const targetHeight = 1350;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let scaleFactor = Math.min(screenWidth / targetWidth, screenHeight / targetHeight);

    screenContainer.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
    screenContainer.style.position = "absolute";
    screenContainer.style.left = "50%";
    screenContainer.style.top = "50%";

    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
}

window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
