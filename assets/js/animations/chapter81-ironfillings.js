// chapter81-ironfillings.js - Iron Fillings animation for Chapter 81
// Themes: wisdom beyond words, service without competition, infinite giving
// Visualization: Particles that align with invisible forces, showing how truth manifests without being named

function createIronFillingsAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  let particles = [];
  let PARTICLE_COUNT = 40000;

  function initParticles(width, height, count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 - 1,
        targetX: 0,
        targetY: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002
      });
    }
    return arr;
  }

  function drawScene(ctx, width, height, particles, time) {
    ctx.fillStyle = 'rgba(240, 238, 230, 0.05)';
    ctx.fillRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 550;
    const circles = [
      { cx: centerX, cy: centerY - 75 * scale, r: 150 * scale },
      { cx: centerX, cy: centerY + 75 * scale, r: 150 * scale },
      { cx: centerX, cy: centerY, r: 75 * scale }
    ];
    particles.forEach(particle => {
      particle.z = Math.sin(time * 0.5 + particle.phase) * 0.5;
      let minDist = Infinity;
      circles.forEach(circle => {
        const angle = Math.atan2(particle.y - circle.cy, particle.x - circle.cx);
        const pointX = circle.cx + circle.r * Math.cos(angle);
        const pointY = circle.cy + circle.r * Math.sin(angle);
        const dist = Math.sqrt(
          Math.pow(particle.x - pointX, 2) +
          Math.pow(particle.y - pointY, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          particle.targetX = pointX;
          particle.targetY = pointY;
        }
      });
      const depthFactor = 0.5 + particle.z * 0.5;
      particle.x += (particle.targetX - particle.x) * particle.speed * depthFactor;
      particle.y += (particle.targetY - particle.y) * particle.speed * depthFactor;
      particle.x += Math.sin(time + particle.phase) * 0.1;
      particle.y += Math.cos(time + particle.phase) * 0.1;
      const size = 0.3 + particle.z * 0.2;
      const opacity = 0.4 + particle.z * 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(0.1, size * scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(51, 51, 51, ${Math.max(0.1, opacity)})`;
      ctx.fill();
    });
  }

  function handleResize() {
    const containerRect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerRect.width * dpr;
    canvas.height = containerRect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    // Re-init particles for new size
    particles = initParticles(canvas.width, canvas.height, PARTICLE_COUNT);
  }

  function animate() {
    time += 0.016;
    drawScene(ctx, canvas.width, canvas.height, particles, time);
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
    particles.length = 0;
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');
  handleResize();
  window.addEventListener('resize', handleResize);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const IronFillingsAnimation = {
  init: createIronFillingsAnimation
};

export default IronFillingsAnimation;
