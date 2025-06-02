// Animation for Chapter 45: Continuous Line Drawing (Canvas)
import animationUtils from './animation-utils.js';
// Visualization: A single continuous line that appears unrefined yet creates perfect harmony through its natural movement

const CANVAS_SIZE = 550;

const continuousLineDrawingAnimation = {
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
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let currentTime = 0;
    let currentPosition = { x: centerX, y: centerY };
    let currentAngle = 0;
    let radius = 0;
    let points = [{ x: centerX, y: centerY, timestamp: 0 }];
    let running = true;
    let animationFrameId = null;

    function clearCanvas() {
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawDot(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(80, 80, 80, 1)';
      ctx.fill();
    }

    function animate() {
      if (!running) return;
      currentTime += 0.00375;
      clearCanvas();
      radius += 0.0375;
      currentAngle += 0.025;
      const newX = centerX + Math.cos(currentAngle) * radius;
      const newY = centerY + Math.sin(currentAngle) * radius;
      currentPosition.x = newX;
      currentPosition.y = newY;
      points.push({ x: currentPosition.x, y: currentPosition.y, timestamp: currentTime });
      if (radius > 260) {
        radius = 0;
        points = [{ x: centerX, y: centerY, timestamp: currentTime }];
        currentPosition = { x: centerX, y: centerY };
        currentAngle = 0;
      }
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const age = Math.min((currentTime - p1.timestamp) / 10, 1);
        const startGray = 170;
        const endGray = 85;
        const intensity = Math.floor(startGray + (endGray - startGray) * age);
        const startAlpha = 0.3;
        const endAlpha = 1.0;
        const alpha = startAlpha + (endAlpha - startAlpha) * age;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${intensity}, ${intensity}, ${intensity}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      drawDot(currentPosition.x, currentPosition.y);
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
        points.length = 0;
      }
    };
  }
};

export default continuousLineDrawingAnimation;
