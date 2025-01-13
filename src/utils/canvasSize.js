export const setCanvasSize = (canvas, ctx) => {
  const ratio = window.devicePixelRatio || 1;

  // Maintain CSS dimensions
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;

  // Set the actual canvas resolution
  canvas.width = Math.floor(innerWidth * ratio);
  canvas.height = Math.floor(innerHeight * ratio);

  // Scale the context to match the device resolution
  ctx.scale(ratio, ratio);
};
