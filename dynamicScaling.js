function scaleGame() {
  const screenContainer = document.getElementById("screen-container");

  if (!screenContainer) return; // wait until DOM is ready

  const targetWidth = 2400;
  const targetHeight = 1350;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const scaleFactor = Math.min(screenWidth / targetWidth, screenHeight / targetHeight);

  screenContainer.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
  screenContainer.style.position = "absolute";
  screenContainer.style.left = "50%";
  screenContainer.style.top = "50%";

  document.documentElement.style.setProperty('--scale-factor', scaleFactor);
}

// Run immediately if DOM is already available, or defer
if (document.readyState === "complete" || document.readyState === "interactive") {
  scaleGame();
} else {
  window.addEventListener("DOMContentLoaded", scaleGame);
}

window.addEventListener("resize", scaleGame);
