// Animation for Chapter 50: Flowing Ribbons (Canvas)
import animationUtils from './animation-utils.js';
// Visualization: A flowing grid that yields to invisible forces, showing how structure can remain while embracing constant change

const CANVAS_SIZE = 550;
const GRID_DENSITY = 100;
const RIBBON_WIDTH = CANVAS_SIZE * 0.85;
const RIBBON_OFFSET = (CANVAS_SIZE - RIBBON_WIDTH) / 2;
const PI4 = Math.PI * 4;
const PI7 = Math.PI * 7;

const flowingRibbonsAnimation = {
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
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: false });
    // Pre-calculate sin values for performance
    const sinCache = new Float32Array(628);
    for (let i = 0; i < 628; i++) {
      sinCache[i] = Math.sin(i / 100);
    }
    const verticalLines = new Float32Array(GRID_DENSITY * 2 * (GRID_DENSITY + 1));
    const horizontalLines = new Float32Array(GRID_DENSITY * 2 * (GRID_DENSITY + 1));
    let time = 0;
    let animationId;

    function deform(x, y, t, progress) {
      const p = Math.max(0, Math.min(1, progress));
      const wave1 = sinCache[Math.floor(Math.abs((p * PI4 + t * 0.01) * 100) % 628)] * 30;
      const wave2 = sinCache[Math.floor(Math.abs((p * PI7 - t * 0.008) * 100) % 628)] * 15;
      const harmonic = sinCache[Math.floor(Math.abs((x * 0.02 + y * 0.015 + t * 0.005) * 100) % 628)] * 10;
      return { offsetX: wave1 + harmonic, offsetY: wave2 };
    }

    function animate() {
      // Clear with background color
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.strokeStyle = '#777777';
      ctx.lineWidth = 0.5;
      let vIdx = 0;
      let hIdx = 0;
      // Calculate vertical lines
      for (let i = 0; i < GRID_DENSITY; i++) {
        const x = RIBBON_OFFSET + (i / GRID_DENSITY) * RIBBON_WIDTH;
        for (let j = 0; j <= GRID_DENSITY; j++) {
          const progress = (j / GRID_DENSITY) * 1.2 - 0.1;
          const y = progress * CANVAS_SIZE;
          const { offsetX, offsetY } = deform(x, y, time, progress);
          verticalLines[vIdx++] = x + offsetX;
          verticalLines[vIdx++] = y + offsetY;
        }
      }
      // Calculate horizontal lines
      for (let j = 0; j < GRID_DENSITY; j++) {
        const progress = (j / GRID_DENSITY) * 1.2 - 0.1;
        const y = progress * CANVAS_SIZE;
        for (let i = 0; i <= GRID_DENSITY; i++) {
          const x = RIBBON_OFFSET + (i / GRID_DENSITY) * RIBBON_WIDTH;
          const { offsetX, offsetY } = deform(x, y, time, progress);
          horizontalLines[hIdx++] = x + offsetX;
          horizontalLines[hIdx++] = y + offsetY;
        }
      }
      // Draw vertical lines
      vIdx = 0;
      for (let i = 0; i < GRID_DENSITY; i++) {
        ctx.beginPath();
        ctx.moveTo(verticalLines[vIdx], verticalLines[vIdx + 1]);
        vIdx += 2;
        for (let j = 1; j <= GRID_DENSITY; j++) {
          ctx.lineTo(verticalLines[vIdx], verticalLines[vIdx + 1]);
          vIdx += 2;
        }
        ctx.stroke();
      }
      // Draw horizontal lines
      hIdx = 0;
      for (let j = 0; j < GRID_DENSITY; j++) {
        ctx.beginPath();
        ctx.moveTo(horizontalLines[hIdx], horizontalLines[hIdx + 1]);
        hIdx += 2;
        for (let i = 1; i <= GRID_DENSITY; i++) {
          ctx.lineTo(horizontalLines[hIdx], horizontalLines[hIdx + 1]);
          hIdx += 2;
        }
        ctx.stroke();
      }
      time += 0.3;
      animationId = requestAnimationFrame(animate);
    }
    animate();
    // Cleanup function
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }
};

export default flowingRibbonsAnimation;
