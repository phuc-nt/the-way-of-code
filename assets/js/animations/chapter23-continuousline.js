// chapter23-continuousline.js - Animation cho chương 23: Continuous Line Drawing
// Được chuyển từ raw_animation/23, chuẩn module animation-manager
import animationUtils from './animation-utils.js';

const chapter23ContinuousLine = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationFrameId = null;
    let canvas, ctx, width, height;
    let currentTime = 0;
    let centerX, centerY, currentPosition, currentAngle, radius, points;

    // Setup canvas
    canvas = document.createElement('canvas');
    width = this.settings.width;
    height = this.settings.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Initialize state
    centerX = width / 2;
    centerY = height / 2;
    currentTime = 0;
    currentPosition = { x: centerX, y: centerY };
    currentAngle = 0;
    radius = 0;
    points = [{ x: centerX, y: centerY, timestamp: 0 }];

    // Clear canvas with background color
    const clearCanvas = () => {
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw just the dot
    const drawDot = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(80, 80, 80, 1)';
      ctx.fill();
    };

    // Animation function
    function animate() {
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

    clearCanvas();
    animate();
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (ctx) ctx.clearRect(0, 0, width, height);
        points.length = 0;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter23ContinuousLine;
