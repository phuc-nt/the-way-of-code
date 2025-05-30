// Animation for Chapter 68: Glowing Eye
// Visualization: Particles that transform through gentle convergence, showing how power emerges through harmony

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const GlowingEyeAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = BG_COLOR;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = CANVAS_SIZE + 'px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Create canvas
    let canvas = container.querySelector('canvas.glowing-eye-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'glowing-eye-canvas';
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      container.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.35;
    const PARTICLE_COUNT = 30000;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = i < PARTICLE_COUNT / 2 ? 'dark' : 'light';
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      let initialAngle = angle;
      if (side === 'dark') {
        initialAngle = angle < Math.PI ? angle : angle - Math.PI;
      } else {
        initialAngle = angle >= Math.PI ? angle : angle + Math.PI;
      }
      const x = centerX + Math.cos(initialAngle) * r;
      const y = centerY + Math.sin(initialAngle) * r;
      particles.push({
        x: x,
        y: y,
        side: side,
        initialAngle: initialAngle,
        initialRadius: r,
        convergencePhase: Math.random() * Math.PI * 2,
        convergenceSpeed: 0.005 + Math.random() * 0.005,
        size: 0.3 + Math.random() * 0.4,
        targetX: x,
        targetY: y,
        transitionPhase: 0,
        transitionSpeed: 0.004 + Math.random() * 0.002
      });
    }
    let time = 0;
    let isRunning = true;
    let lastTime = 0;
    const FPS = 15;
    const frameDelay = 1000 / FPS;
    let animationFrameId = null;

    function cleanup() {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.length = 0;
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function animate(currentTime) {
      if (!isRunning) return;
      if (!lastTime) lastTime = currentTime;
      const elapsed = currentTime - lastTime;
      if (elapsed > frameDelay) {
        time += 0.008;
        lastTime = currentTime;
        ctx.fillStyle = 'rgba(240, 238, 230, 0.1)';
        ctx.fillRect(0, 0, width, height);
        particles.forEach(particle => {
          particle.convergencePhase += particle.convergenceSpeed;
          particle.transitionPhase += particle.transitionSpeed;
          const convergenceCycle = Math.sin(particle.convergencePhase);
          const isConverging = convergenceCycle > 0;
          if (isConverging) {
            const convergenceStrength = convergenceCycle;
            particle.targetX = centerX;
            particle.targetY = centerY;
            const distanceToCenter = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
            const moveSpeed = 0.02 * convergenceStrength * (distanceToCenter / radius);
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          } else {
            const transitionProgress = Math.abs(convergenceCycle);
            let newAngle, newRadius;
            newAngle = particle.initialAngle + Math.PI;
            newRadius = particle.initialRadius;
            const sCurveEffect = Math.sin(newAngle * 2) * radius * 0.5;
            const curvedAngle = newAngle + (sCurveEffect / newRadius) * transitionProgress;
            particle.targetX = centerX + Math.cos(curvedAngle) * newRadius;
            particle.targetY = centerY + Math.sin(curvedAngle) * newRadius;
            const moveSpeed = 0.03 * transitionProgress;
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          }
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const particleAngle = Math.atan2(dy, dx);
          const normalizedAngle = (particleAngle + Math.PI * 2) % (Math.PI * 2);
          const isDarkArea = (normalizedAngle >= Math.PI);
          let color, alpha;
          if (isConverging) {
            color = particle.side === 'dark' ? '20, 20, 20' : '90, 90, 90';
            alpha = 0.3 * convergenceCycle;
          } else {
            const transition = Math.abs(convergenceCycle);
            if (particle.side === 'dark') {
              color = `${20 + transition * 70}, ${20 + transition * 70}, ${20 + transition * 70}`;
            } else {
              color = `${90 - transition * 70}, ${90 - transition * 70}, ${90 - transition * 70}`;
            }
            alpha = 0.3 * transition;
          }
          const distanceToCenter = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
          if (distanceToCenter < radius * 0.2) {
            alpha += (1 - distanceToCenter / (radius * 0.2)) * 0.2;
          }
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fill();
        });
        const centralGlow = Math.sin(time * 0.1) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2 + centralGlow * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(51, 51, 51, ${0.1 + centralGlow * 0.2})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup
    };
  }
};

export default GlowingEyeAnimation;
