// chapter39-flowingpattern.js - Animation cho Chapter 39
// Visualization: Points flow together in humble unity, finding wholeness in their connection

import animationUtils from './animation-utils.js';

const chapter39Animation = {
  settings: {
    backgroundColor: '#F0EEE6',
    width: 550,
    height: 550,
    gridSize: 8
  },

  init(container) {
    if (!container) return null;
    const canvas = animationUtils.createSquareCanvas(container);
    const ctx = canvas.getContext('2d');
    const width = this.settings.width;
    const height = this.settings.height;
    const gridSize = this.settings.gridSize;
    // Khởi tạo các điểm flow
    const flowPoints = [];
    for (let x = gridSize/2; x < width; x += gridSize) {
      for (let y = gridSize/2; y < height; y += gridSize) {
        flowPoints.push({
          x,
          y,
          vx: 0,
          vy: 0,
          angle: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          noiseOffset: Math.random() * 1000
        });
      }
    }
    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    // Mouse event (optional, but keep for unity effect)
    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    canvas.addEventListener('mousemove', handleMouseMove);
    // Perlin-like noise
    function noise(x, y, t) {
      const sin1 = Math.sin(x * 0.01 + t);
      const sin2 = Math.sin(y * 0.01 + t * 0.8);
      const sin3 = Math.sin((x + y) * 0.005 + t * 1.2);
      return (sin1 + sin2 + sin3) / 3;
    }
    let animationFrameId;
    function animate() {
      ctx.fillStyle = 'rgba(240, 238, 230, 0.15)';
      ctx.fillRect(0, 0, width, height);
      time += 0.005;
      flowPoints.forEach(point => {
        const noiseValue = noise(point.x, point.y, time);
        const angle = noiseValue * Math.PI * 4;
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const pushFactor = (1 - dist / 150) * 0.5;
          point.vx += dx / dist * pushFactor;
          point.vy += dy / dist * pushFactor;
        }
        point.vx += Math.cos(angle) * 0.1;
        point.vy += Math.sin(angle) * 0.1;
        point.vx *= 0.95;
        point.vy *= 0.95;
        const nextX = point.x + point.vx;
        const nextY = point.y + point.vy;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextX, nextY);
        const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        const alpha = Math.min(0.6, speed * 5);
        ctx.strokeStyle = `rgba(80, 80, 80, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 80, 80, ${alpha * 0.5})`;
        ctx.fill();
        if (nextX < 0) point.x = width;
        if (nextX > width) point.x = 0;
        if (nextY < 0) point.y = height;
        if (nextY > height) point.y = 0;
        point.x += (point.x % gridSize === gridSize/2 ? 0 : (gridSize/2 - point.x % gridSize) * 0.01);
        point.y += (point.y % gridSize === gridSize/2 ? 0 : (gridSize/2 - point.y % gridSize) * 0.01);
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    animationUtils.fadeOutLoader(container);
    // Cleanup
    return function cleanup() {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      flowPoints.length = 0;
    };
  }
};

export default chapter39Animation;
