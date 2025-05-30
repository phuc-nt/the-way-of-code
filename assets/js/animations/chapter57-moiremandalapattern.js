// Animation for Chapter 57: Moire Mandala Pattern
// Visualization: Circles that organize themselves into complex patterns, demonstrating how order emerges without force
import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const moireMandalaPatternAnimation = {
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
    canvas.style.background = BG_COLOR;
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    function drawPattern(time = 0) {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.6;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const layers = [
        { count: 1, radius: 0, circleSize: 60 },
        { count: 6, radius: 60, circleSize: 60 },
        { count: 12, radius: 110, circleSize: 50 },
        { count: 18, radius: 160, circleSize: 45 },
        { count: 24, radius: 205, circleSize: 40 }
      ];
      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          const angle = (i / layer.count) * Math.PI * 2;
          const breathingEffect = Math.sin(time * 0.0015 + layerIndex * 0.5) * 2;
          const rotation = time * 0.00025 * (layerIndex % 2 === 0 ? 1 : -1);
          const circleX = centerX + Math.cos(angle + rotation) * layer.radius;
          const circleY = centerY + Math.sin(angle + rotation) * layer.radius;
          for (let r = 3; r < layer.circleSize; r += 3) {
            ctx.beginPath();
            for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
              const distortion = Math.sin(theta * 8 + time * 0.0025 + angle) * (r * 0.01);
              const x = circleX + (r + distortion + breathingEffect) * Math.cos(theta);
              const y = circleY + (r + distortion + breathingEffect) * Math.sin(theta);
              if (theta === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      });
      const centralSize = 80;
      for (let r = 3; r < centralSize; r += 3) {
        ctx.beginPath();
        for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
          const distortion = Math.sin(theta * 6 + time * 0.0025) * (r * 0.015);
          const breathing = Math.sin(time * 0.002) * 1.5;
          const x = centerX + (r + distortion + breathing) * Math.cos(theta);
          const y = centerY + (r + distortion + breathing) * Math.sin(theta);
          if (theta === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(() => drawPattern(time + 1));
    }
    drawPattern();
    function handleResize() {
      // Optionally, handle responsive canvas if needed
    }
    window.addEventListener('resize', handleResize);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (container && canvas) container.removeChild(canvas);
      }
    };
  }
};

export default moireMandalaPatternAnimation;
