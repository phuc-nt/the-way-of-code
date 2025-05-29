// chapter38-morphingshapesstipple.js - Animation cho Chapter 38
// Visualization: Forms emerge effortlessly from depth, achieving completeness without force

import animationUtils from './animation-utils.js';

const chapter38Animation = {
  settings: {
    backgroundColor: '#F0EEE6',
    width: 550,
    height: 550,
    numPoints: 25000,
    frameRate: 30
  },

  init(container) {
    if (!container) return null;
    const canvas = animationUtils.createSquareCanvas(container);
    const ctx = canvas.getContext('2d');
    const width = this.settings.width;
    const height = this.settings.height;
    const numPoints = this.settings.numPoints;
    // Define shapes
    const shapes = [
      (x, y, t) => {
        const cx = width / 2, cy = height / 2;
        const dx = x - cx, dy = y - cy;
        const angle = Math.atan2(dy, dx);
        const noise = Math.sin(angle * 2 + t * 0.25) * 15 + Math.sin(angle * 4 + t * 0.15) * 10 + Math.sin(angle * 6 + t * 0.1) * 5;
        const radius = 150 + noise;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < radius;
      },
      (x, y, t) => {
        const cx = width / 2, cy = height / 2;
        const dx = x - cx, dy = y - cy;
        const angle = Math.atan2(dy, dx);
        const points = 5 + Math.floor(t % 3);
        const radius = 120 + Math.sin(angle * points + t * 0.5) * 60;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < radius;
      },
      (x, y, t) => {
        const cx = width / 2, cy = height / 2;
        for (let i = 0; i < 5; i++) {
          const angle = t * 0.1 + i * Math.PI * 2 / 5;
          const circleX = cx + Math.cos(angle) * 70;
          const circleY = cy + Math.sin(angle) * 70;
          const dx = x - circleX, dy = y - circleY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) return true;
        }
        return false;
      }
    ];
    // Initialize points
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        size: 0.5 + Math.random() * 1,
        opacity: 0.2 + Math.random() * 0.4,
        speed: 0.00075 + Math.random() * 0.00175,
        inside: false
      });
    }
    // Update targets
    function updateTargets(shapeIndex, t) {
      const shape = shapes[shapeIndex];
      let insideCount = 0;
      for (const point of points) {
        if (shape(point.x, point.y, t)) {
          point.inside = true;
          insideCount++;
        } else {
          point.inside = false;
        }
      }
      const desiredInside = numPoints * 0.7;
      if (insideCount < desiredInside) {
        for (const point of points) {
          if (!point.inside && insideCount < desiredInside) {
            let attempts = 0, foundInside = false;
            while (attempts < 5 && !foundInside) {
              const newX = Math.random() * width;
              const newY = Math.random() * height;
              if (shape(newX, newY, t)) {
                point.targetX = newX;
                point.targetY = newY;
                point.inside = true;
                insideCount++;
                foundInside = true;
              }
              attempts++;
            }
          }
        }
      }
      for (const point of points) {
        if (!point.inside) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 160 + Math.random() * 80;
          point.targetX = width / 2 + Math.cos(angle) * distance;
          point.targetY = height / 2 + Math.sin(angle) * distance;
        }
      }
    }
    // Animation
    let time = 0;
    let animationFrameId = null;
    let lastFrameTime = 0;
    const frameInterval = 1000 / this.settings.frameRate;
    function animate(currentTime) {
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        ctx.fillStyle = chapter38Animation.settings.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        time += 0.0025;
        const cycleTime = 10;
        const shapeCycle = (time / cycleTime) % shapes.length;
        const currentShape = Math.floor(shapeCycle);
        const nextShape = (currentShape + 1) % shapes.length;
        const blendFactor = (shapeCycle - currentShape);
        if (Math.floor(time * 60) % 20 === 0) {
          updateTargets(currentShape, time);
        }
        for (const point of points) {
          point.x += (point.targetX - point.x) * point.speed;
          point.y += (point.targetY - point.y) * point.speed;
          point.x += Math.sin(time * 0.15 + point.y * 0.005) * 0.05;
          point.y += Math.cos(time * 0.15 + point.x * 0.005) * 0.05;
          const insideCurrent = shapes[currentShape](point.x, point.y, time);
          const insideNext = shapes[nextShape](point.x, point.y, time);
          let targetOpacity;
          if (insideCurrent && insideNext) {
            targetOpacity = 0.7;
          } else if (insideCurrent) {
            targetOpacity = 0.7 * (1 - blendFactor);
          } else if (insideNext) {
            targetOpacity = 0.7 * blendFactor;
          } else {
            targetOpacity = 0.1;
          }
          point.opacity += (targetOpacity - point.opacity) * 0.05;
          ctx.fillStyle = `rgba(51, 51, 51, ${point.opacity})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fill();
        }
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    // Cleanup
    return function cleanup() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      points.length = 0;
    };
  }
};

export default chapter38Animation;
