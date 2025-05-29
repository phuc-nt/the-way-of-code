// chapter21-bouncingpointcloud.js - Animation cho chương 21: Bouncing Point Cloud
// Visualization: Points freely follow an unpredictable leader, finding their way through openness
// Themes: following intuition, no fixed path, open mind leads forward

import animationUtils from './animation-utils.js';

const chapter21BouncingPointCloud = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550,
    numPoints: 25000,
    ballRadius: 120,
    minSpeed: 0.75,
    maxSpeed: 1.5,
    targetFPS: 18
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationFrameId = null;
    let canvas, ctx, width, height;
    let points = [], ball, time = 0, lastFrameTime = 0;
    const frameInterval = 1000 / this.settings.targetFPS;

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

    // Leader ball
    ball = {
      x: width / 2,
      y: height / 2,
      radius: this.settings.ballRadius,
      vx: (Math.random() * 2 - 1) * 2,
      vy: (Math.random() * 2 - 1) * 2
    };

    // Calculate field value at a point
    const calculateField = (x, y) => {
      const dx = x - ball.x;
      const dy = y - ball.y;
      const distSq = dx * dx + dy * dy;
      return ball.radius * ball.radius / distSq;
    };

    // Generate initial points
    for (let i = 0; i < this.settings.numPoints; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const field = calculateField(x, y);
      points.push({
        x,
        y,
        z: Math.random() * 2 - 1,
        size: 0.5 + Math.random() * 1.5,
        field,
        active: field > 1,
        targetX: x,
        targetY: y,
        originalX: x,
        originalY: y,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Animation function
    const animate = (currentTime) => {
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        ctx.fillStyle = animationUtils.colors.background;
        ctx.fillRect(0, 0, width, height);
        time += 0.0005;
        // Update ball position
        ball.x += ball.vx;
        ball.y += ball.vy;
        // Bounce off edges
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = Math.abs(ball.vx) * (0.9 + Math.random() * 0.2);
          ball.vy += (Math.random() * 2 - 1) * 0.5;
        }
        if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx = -Math.abs(ball.vx) * (0.9 + Math.random() * 0.2);
          ball.vy += (Math.random() * 2 - 1) * 0.5;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = Math.abs(ball.vy) * (0.9 + Math.random() * 0.2);
          ball.vx += (Math.random() * 2 - 1) * 0.5;
        }
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy = -Math.abs(ball.vy) * (0.9 + Math.random() * 0.2);
          ball.vx += (Math.random() * 2 - 1) * 0.5;
        }
        // Ensure min/max velocity
        const minSpeed = this.settings.minSpeed;
        const maxSpeed = this.settings.maxSpeed;
        const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (currentSpeed < minSpeed) {
          ball.vx = (ball.vx / currentSpeed) * minSpeed;
          ball.vy = (ball.vy / currentSpeed) * minSpeed;
        }
        const speedFactor = Math.min(1, maxSpeed / currentSpeed);
        ball.vx *= speedFactor;
        ball.vy *= speedFactor;
        // Update and draw points
        for (const point of points) {
          const field = calculateField(point.x, point.y);
          const prevActive = point.active;
          point.active = field > 1;
          if (point.active !== prevActive) {
            if (point.active) {
              const angle = Math.random() * Math.PI * 2;
              const dist = 5 + Math.random() * 10;
              point.targetX = point.x + Math.cos(angle) * dist;
              point.targetY = point.y + Math.sin(angle) * dist;
            } else {
              point.targetX = point.originalX;
              point.targetY = point.originalY;
            }
          }
          if (point.active) {
            const angle = Math.atan2(point.y - ball.y, point.x - ball.x);
            const distFromCenter = Math.sqrt((point.x - ball.x) * (point.x - ball.x) + (point.y - ball.y) * (point.y - ball.y));
            const tangentialAngle = angle + Math.PI / 2;
            const flowSpeed = 0.25 * (1 - distFromCenter / ball.radius);
            point.x += Math.cos(tangentialAngle) * flowSpeed;
            point.y += Math.sin(tangentialAngle) * flowSpeed;
            const radialPulse = Math.sin(time * 2 + point.phase) * 0.2;
            point.x += Math.cos(angle) * radialPulse;
            point.y += Math.sin(angle) * radialPulse;
            if (calculateField(point.x, point.y) < 1) {
              point.x = point.x + (ball.x - point.x) * 0.1;
              point.y = point.y + (ball.y - point.y) * 0.1;
            }
          } else {
            const distToTarget = Math.sqrt((point.targetX - point.x) * (point.targetX - point.x) + (point.targetY - point.y) * (point.targetY - point.y));
            if (distToTarget > 100 || Math.random() < 0.001) {
              const dx = ball.x - point.x;
              const dy = ball.y - point.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 200 + Math.random() * 100) {
                point.targetX = ball.x + (Math.random() * 2 - 1) * 100;
                point.targetY = ball.y + (Math.random() * 2 - 1) * 100;
              }
            }
            point.x += (point.targetX - point.x) * 0.01;
            point.y += (point.targetY - point.y) * 0.01;
          }
          point.x += Math.sin(time * 0.3 + point.y * 0.01) * 0.1;
          point.y += Math.cos(time * 0.3 + point.x * 0.01) * 0.1;
          if (point.x < 0) point.x = width;
          if (point.x > width) point.x = 0;
          if (point.y < 0) point.y = height;
          if (point.y > height) point.y = 0;
          let alpha;
          if (point.active) {
            alpha = Math.min(0.9, 0.3 + field * 0.4);
          } else {
            const dx = point.x - ball.x;
            const dy = point.y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / (ball.radius * 2.5));
            alpha = 0.05 + proximity * 0.2;
          }
          ctx.fillStyle = `rgba(51, 51, 51, ${alpha})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fill();
        }
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    // Cleanup
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

export default chapter21BouncingPointCloud;
