// Animation for Chapter 42: Diagonal Petals (Canvas)
import animationUtils from './animation-utils.js';
// Visualization: ASCII patterns emerging from simple elements combining and recombining

const CHARS = '/\\|';
const GRID_SIZE = 90;
const CANVAS_SIZE = 800;
const CELL_SIZE = 15;
const CHAR_WIDTH = CELL_SIZE * 0.7;
const CHAR_HEIGHT = CELL_SIZE;

const asciiDiagonalPetalsAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Create and style canvas
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.display = 'block';
    canvas.style.background = animationUtils.colors.background;
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.objectFit = 'contain';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.style.overflow = 'hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let time = 0;
    let animationFrameId = null;
    let running = true;

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${CELL_SIZE}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333333';
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const wave1 = Math.sin((x + y) / 4 + time);
          const wave2 = Math.cos((x - y) / 4 - time * 0.7);
          const boundaryX = Math.abs(x - GRID_SIZE/2) / (GRID_SIZE/2);
          const boundaryY = Math.abs(y - GRID_SIZE/2) / (GRID_SIZE/2);
          const boundary = Math.max(boundaryX, boundaryY);
          if (boundary < 0.85) {
            const combined = wave1 * 0.6 + wave2 * 0.4;
            const fade = 1 - (boundary / 0.85);
            const value = combined * fade;
            let char = ' ';
            if (value > 0.3) char = CHARS[0];
            else if (value < -0.3) char = CHARS[1];
            else if (Math.abs(value) < 0.1) char = CHARS[2];
            if (char !== ' ') {
              const xPos = (canvas.width / 2) + (x - GRID_SIZE/2) * CHAR_WIDTH;
              const yPos = (canvas.height / 2) + (y - GRID_SIZE/2) * CHAR_HEIGHT;
              ctx.fillText(char, xPos, yPos);
            }
          }
        }
      }
      time += 0.0075;
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    // Cleanup
    return {
      cleanup() {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        // Show loader again if needed
        const loader = container.querySelector('.animation-loader');
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default asciiDiagonalPetalsAnimation;
