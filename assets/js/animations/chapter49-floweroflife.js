// Animation for Chapter 49: Flower of Life (Canvas)
import animationUtils from './animation-utils.js';
// Visualization: Sacred geometry pattern showing how individual circles merge into a unified whole, representing harmony of trust and openness

const CANVAS_SIZE = 550;

const flowerOfLifeAnimation = {
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
    canvas.style.boxSizing = 'border-box';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.style.overflow = 'hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let time = 0;
    let animationId = null;
    let running = true;

    function drawCircle(cx, cy, radius, alpha) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(80, 80, 80, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function animate() {
      if (!running) return;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      time += 0.005;
      const centerX = CANVAS_SIZE / 2;
      const centerY = CANVAS_SIZE / 2;
      const baseRadius = 40;
      // Draw central circle
      drawCircle(centerX, centerY, baseRadius, 0.48);
      // Draw overlapping circles in hexagonal pattern
      const ringCount = 4;
      for (let ring = 1; ring <= ringCount; ring++) {
        const circles = ring * 6;
        const ringRadius = ring * baseRadius * Math.sqrt(3);
        for (let i = 0; i < circles; i++) {
          const angle = (i / circles) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;
          // Add pulsing effect
          const pulse = Math.sin(time * 2 + ring * 0.5 + i * 0.1) * 0.12;
          const alpha = 0.36 - ring * 0.06 + pulse;
          drawCircle(x, y, baseRadius, alpha);
        }
      }
      // Draw Vesica Piscis
      const vesicaSpacing = baseRadius * 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * vesicaSpacing;
        const y1 = centerY + Math.sin(angle) * vesicaSpacing;
        const x2 = centerX + Math.cos(angle + Math.PI) * vesicaSpacing;
        const y2 = centerY + Math.sin(angle + Math.PI) * vesicaSpacing;
        ctx.beginPath();
        ctx.arc(x1, y1, vesicaSpacing, 0, Math.PI * 2);
        ctx.arc(x2, y2, vesicaSpacing, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.12)';
        ctx.stroke();
      }
      // Rotating overlay pattern
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.1);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 200, Math.sin(angle) * 200);
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.06)';
        ctx.stroke();
      }
      ctx.restore();
      animationId = requestAnimationFrame(animate);
    }
    animate();
    // Cleanup
    return {
      cleanup() {
        running = false;
        if (animationId) cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default flowerOfLifeAnimation;
