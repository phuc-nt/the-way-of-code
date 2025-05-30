// chapter74-canyonundulatingwalls.js - Canyon Undulating Walls animation for Chapter 74
// Themes: embracing change, freedom from fear, natural timing
// Visualization: Particles flowing along ever-changing walls, showing how freedom comes from accepting impermanence

function createCanyonUndulatingWallsAnimation(container) {
  let animationFrameId;
  let time = 0;
  let width = 550, height = 550;
  let ctx, canvas;
  let particles = [];
  const PARTICLE_COUNT = 18000;
  const FPS = 15;
  const frameDelay = 1000 / FPS;
  let lastTime = 0;
  let isRunning = true;

  function initParticles() {
    particles = [];
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const y = Math.random() * height;
      const wavePhase = y * 0.01;
      const waveAmount = Math.sin(wavePhase) * 60 + Math.sin(wavePhase * 3) * 20;
      const wallThickness = 30 + Math.sin(wavePhase * 2) * 15;
      const baseX = centerX + side * (60 + waveAmount);
      const offsetX = (Math.random() - 0.5) * wallThickness;
      particles.push({
        x: baseX + offsetX,
        y: y,
        z: (Math.random() - 0.5) * 100,
        side: side,
        wavePhase: wavePhase,
        initialY: y,
        drift: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.3
      });
    }
  }

  function animate(currentTime) {
    if (!isRunning) return;
    if (!lastTime) lastTime = currentTime;
    const elapsed = currentTime - lastTime;
    if (elapsed > frameDelay) {
      time += 0.008;
      lastTime = currentTime;
      ctx.fillStyle = 'rgba(240, 238, 230, 0.06)';
      ctx.fillRect(0, 0, width, height);
      const centerX = width / 2;
      particles.forEach(particle => {
        const currentWavePhase = particle.y * 0.01 + time * 0.1;
        const waveAmount = Math.sin(currentWavePhase) * 60 + Math.sin(currentWavePhase * 3) * 20;
        const wallThickness = 30 + Math.sin(currentWavePhase * 2) * 15;
        const targetX = centerX + particle.side * (60 + waveAmount);
        const offset = (Math.sin(particle.drift + time) - 0.5) * wallThickness;
        particle.x = particle.x * 0.95 + (targetX + offset) * 0.05;
        particle.y += particle.speed;
        particle.z += Math.sin(time * 0.5 + particle.drift) * 0.3;
        if (particle.y > height + 20) {
          particle.y = -20;
          particle.drift = Math.random() * Math.PI * 2;
        }
        const depthFactor = 1 + particle.z * 0.01;
        const opacity = 0.4 - Math.abs(particle.z) * 0.0025;
        const size = 0.8 + particle.z * 0.015;
        if (opacity > 0 && size > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(51, 51, 51, ${opacity * 0.1})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(51, 51, 51, ${opacity})`;
          ctx.fill();
        }
      });
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    isRunning = false;
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
    particles = [];
    time = 0;
  }

  function handleResize() {
    width = container.offsetWidth || 550;
    height = container.offsetHeight || 550;
    canvas.width = width;
    canvas.height = height;
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
  initParticles();
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const CanyonUndulatingWallsAnimation = {
  init: createCanyonUndulatingWallsAnimation
};

export default CanyonUndulatingWallsAnimation;
