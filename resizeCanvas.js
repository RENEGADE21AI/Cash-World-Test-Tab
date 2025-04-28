function resizeCanvas() {
  const canvas = document.getElementById("cash-world-canvas");
  const gameContent = document.querySelector('.game-content');
  if (!canvas || !gameContent) return;

  const rect = gameContent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
