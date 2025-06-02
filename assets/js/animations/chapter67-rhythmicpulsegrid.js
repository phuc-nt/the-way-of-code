// Animation for Chapter 67: Rhythmic Pulse Grid
import animationUtils from './animation-utils.js';
// Visualization: A grid where dots move with patience and humility, showing how simplicity leads to harmony

const CANVAS_SIZE = 550;

const RhythmicPulseGridAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = animationUtils.colors.background;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = CANVAS_SIZE + 'px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Create canvas
    let canvas = container.querySelector('canvas.rhythmic-pulse-grid-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'rhythmic-pulse-grid-canvas';
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      container.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    let time = 0;
    let animationFrameId = null;
    const lineCount = 20;
    const lineSpacing = canvas.height / (lineCount + 1);
    const verticalLineCount = 20;
    const verticalLineSpacing = canvas.width / (verticalLineCount + 1);
    const dotPatterns = [];
    for (let i = 0; i < 3; i++) {
      const pattern = [];
      const frequency = 0.5 + i * 0.3;
      const amplitude = 100 + i * 50;
      for (let j = 0; j < 15; j++) {
        pattern.push({
          baseX: canvas.width / 2,
          baseY: (j + 1) * (canvas.height / 16),
          frequency: frequency,
          amplitude: amplitude,
          phase: j * 0.2
        });
      }
      dotPatterns.push(pattern);
    }
    let running = true;

    function cleanup() {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotPatterns.length = 0;
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function animate() {
      if (!running) return;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.0045;
      // Draw horizontal lines
      for (let i = 1; i <= lineCount; i++) {
        const y = i * lineSpacing;
        ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      // Draw vertical lines
      for (let i = 1; i <= verticalLineCount; i++) {
        const x = i * verticalLineSpacing;
        ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      // Draw dot patterns
      dotPatterns.forEach((pattern, patternIndex) => {
        pattern.forEach(dot => {
          const x = dot.baseX + Math.sin(time * dot.frequency + dot.phase) * dot.amplitude;
          const y = dot.baseY;
          const nearestLine = Math.round(y / lineSpacing) * lineSpacing;
          const sizeMultiplier = 1 + Math.sin(time * 1.5 + patternIndex + dot.phase) * 0.3;
          const size = 3 * sizeMultiplier;
          ctx.fillStyle = `rgba(40, 40, 40, ${0.6 + Math.sin(time * 1.125 + dot.phase) * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, nearestLine, size, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup
    };
  }
};

export default RhythmicPulseGridAnimation;
