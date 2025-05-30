// chapter80-moire6circles.js - Moiré Six Circles animation for Chapter 80
// Themes: contentment in simplicity, community wisdom, natural satisfaction
// Visualization: Circles that create complex patterns through simple overlapping, showing beauty in basic forms

function createMoireSixCirclesAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;

  function drawPattern(time) {
    ctx.fillStyle = '#F0EEE6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.8;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numClusters = 6;
    const radius = Math.min(canvas.width, canvas.height) * 0.22; // Tăng kích thước pattern
    for (let i = 0; i < numClusters; i++) {
      const angle = (i / numClusters) * Math.PI * 2;
      const oscillation = Math.sin(time * 0.005 + angle) * (radius * 0.25);
      const pulseEffect = Math.sin(time * 0.003) * (radius * 0.05);
      const circleX = centerX + Math.cos(angle) * (radius + oscillation);
      const circleY = centerY + Math.sin(angle) * (radius + oscillation);
      const maxRadius = radius * 0.9;
      for (let r = 5; r < maxRadius; r += maxRadius / 30) {
        ctx.beginPath();
        for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
          const waveDistortion = Math.sin(theta * 6 + time * 0.01 + angle) * (r * 0.03);
          const radiusDistortion = Math.sin(time * 0.005 + r * 0.1) * 2;
          const x = circleX + (r + waveDistortion + radiusDistortion + pulseEffect) * Math.cos(theta);
          const y = circleY + (r + waveDistortion + radiusDistortion + pulseEffect) * Math.sin(theta);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  function handleResize() {
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height) * 0.95;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function animate() {
    time += 1;
    drawPattern(time);
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  
  canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.aspectRatio = '1/1';
  container.appendChild(canvas);
  
  ctx = canvas.getContext('2d');
  handleResize();
  window.addEventListener('resize', handleResize);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const MoireSixCirclesAnimation = {
  init: createMoireSixCirclesAnimation
};

export default MoireSixCirclesAnimation;
