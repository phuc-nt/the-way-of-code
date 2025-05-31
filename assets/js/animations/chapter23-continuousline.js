// chapter23-continuousline.js - Animation cho chương 23: Fibonacci Rectangle Spiral
// Được chuyển từ raw_animation/23, chuẩn module animation-manager
import animationUtils from './animation-utils.js';

const chapter23FibonacciRectangleSpiral = {
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
    let time = 0;
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

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

    // Animation function
    function animate() {
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(width / 2, height / 2);
      
      // Animate the number of rectangles
      const maxRectangles = Math.min(60, Math.floor((time * 0.02) % 80));
      
      // Begin from silence at the center
      let rectangleWidth = 300;
      let rectangleHeight = rectangleWidth / phi;
      let scale = 1;
      let angle = time * 0.00025; // Half speed global rotation
      
      for (let i = 0; i < maxRectangles; i++) {
        ctx.save();
        
        // Calculate position along Fibonacci spiral
        const spiralAngle = i * 0.174533; // Approximately 10 degrees per step
        const radius = scale * 100;
        
        // Position rectangle along the spiral
        const x = Math.cos(spiralAngle) * radius;
        const y = Math.sin(spiralAngle) * radius;
        
        ctx.translate(x, y);
        ctx.rotate(spiralAngle + angle);
        
        // Draw the rectangle with lighter lines
        const alpha = 0.5 - i * 0.01;
        ctx.strokeStyle = `rgba(83, 81, 70, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-rectangleWidth/2, -rectangleHeight/2, rectangleWidth, rectangleHeight);
        
        // Add subtle internal divisions
        if (i % 3 === 0) {
          // Draw diagonals
          ctx.beginPath();
          ctx.moveTo(-rectangleWidth/2, -rectangleHeight/2);
          ctx.lineTo(rectangleWidth/2, rectangleHeight/2);
          ctx.moveTo(rectangleWidth/2, -rectangleHeight/2);
          ctx.lineTo(-rectangleWidth/2, rectangleHeight/2);
          ctx.strokeStyle = `rgba(50, 50, 50, ${alpha * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        
        ctx.restore();
        
        // Update for next rectangle
        // Scale down by the golden ratio
        rectangleWidth *= 0.95;
        rectangleHeight *= 0.95;
        scale *= 0.98;
      }
      
      // Draw the natural response to source (spiral curve)
      ctx.beginPath();
      for (let i = 0; i <= maxRectangles; i++) {
        const spiralAngle = i * 0.174533;
        const radius = Math.pow(0.98, i) * 100;
        const x = Math.cos(spiralAngle) * radius;
        const y = Math.sin(spiralAngle) * radius;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
      
      time += 0.75; // 75% speed time increment
      animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (ctx) ctx.clearRect(0, 0, width, height);
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter23FibonacciRectangleSpiral;
