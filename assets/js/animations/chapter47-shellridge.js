// Animation for Chapter 47: Shell Ridge Pattern (Canvas)
// Visualization: A shell pattern that reveals the universe's structure through its simple, repeating forms

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const shellRidgePatternAnimation = {
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
    canvas.style.boxSizing = 'border-box';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = BG_COLOR;
    container.style.overflow = 'hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let time = 0;
    let running = true;
    let animationFrameId = null;

    function drawRidgePattern() {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let r = 0; r < 25; r++) {
        const baseRadius = 10 + r * 12;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const distortion = Math.sin(a * 8 + time * 0.75 + r * 0.5) * 8 +
                             Math.sin(a * 12 - time * 1 + r * 0.3) * 5;
          const radius = baseRadius + distortion;
          const x = centerX + Math.cos(a) * radius;
          const y = centerY + Math.sin(a) * radius;
          if (a === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.lineWidth = 1.5 + Math.sin(r * 0.5 + time) * 0.5;
        ctx.strokeStyle = `rgba(51, 51, 51, ${0.6 - r * 0.02})`;
        ctx.stroke();
        for (let t = 0; t < 60; t++) {
          const angle = (t / 60) * Math.PI * 2;
          const textureRadius = baseRadius + Math.sin(angle * 8 + time * 1.5) * 5;
          const tx = centerX + Math.cos(angle) * textureRadius;
          const ty = centerY + Math.sin(angle) * textureRadius;
          ctx.beginPath();
          ctx.arc(tx, ty, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(85, 85, 85, ${0.2 - r * 0.01})`;
          ctx.fill();
        }
      }
    }

    function animate() {
      if (!running) return;
      time += 0.005;
      drawRidgePattern();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return {
      cleanup() {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default shellRidgePatternAnimation;
