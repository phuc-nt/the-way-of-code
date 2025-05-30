// chapter77-zoomedparticleanimation.js - Zoomed Particle Animation for Chapter 77
// Themes: giving without expectation, endless abundance, natural success
// Visualization: A form that continuously gives and receives, showing the cycle of natural abundance

function createZoomedParticleAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  let particles = [];
  let zoomLevel, zoomOffsetX, zoomOffsetY, centerX, centerY, isSmallContainer;

  function resizeCanvas() {
    canvas.width = container.offsetWidth || 550;
    canvas.height = canvas.width; // Make it square
    isSmallContainer = canvas.width < 440;
    zoomLevel = 2.5;
    zoomOffsetX = canvas.width / 18;
    zoomOffsetY = canvas.height / 18 - 60;
    centerX = canvas.width / (2 * zoomLevel) + zoomOffsetX;
    centerY = canvas.height / (2 * zoomLevel) + zoomOffsetY;
  }

  function initParticles() {
    particles = [];
    const numParticles = isSmallContainer ? 15 : 50;
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const radius = Math.random() * 180 + 80;
      const clusterChance = Math.random();
      const clusterOffset = clusterChance < 0.2 ? 40 : (clusterChance > 0.8 ? -40 : 0);
      particles.push({
        x: centerX + Math.cos(angle) * (radius + clusterOffset),
        y: centerY + Math.sin(angle) * (radius + clusterOffset),
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        size: Math.random() * 1.5 + 0.8,
        connections: [],
        noiseOffset: Math.random() * 1000,
        idealSpace: 60 + Math.random() * 20,
        allowClustering: clusterChance < 0.35
      });
    }
  }

  function animate() {
    time += 0.0025;
    ctx.fillStyle = '#F0EEE6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.connections = []);
    const maxConnectionDistance = isSmallContainer ? 200 / zoomLevel : 180 / zoomLevel;
    const fadeZoneWidth = isSmallContainer ? 40 / zoomLevel : 60 / zoomLevel;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = Math.sqrt(
          Math.pow(particles[i].x - particles[j].x, 2) +
          Math.pow(particles[i].y - particles[j].y, 2)
        );
        if (distance < maxConnectionDistance * zoomLevel) {
          let alpha;
          if (distance < (maxConnectionDistance - fadeZoneWidth) * zoomLevel) {
            alpha = Math.min(0.24, 0.36 * (1 - distance / ((maxConnectionDistance - fadeZoneWidth) * zoomLevel)));
          } else {
            const fadeProgress = (distance - (maxConnectionDistance - fadeZoneWidth) * zoomLevel) / (fadeZoneWidth * zoomLevel);
            alpha = 0.24 * Math.pow(1 - fadeProgress, 3);
          }
          if (alpha > 0.001) {
            particles[i].connections.push({ particle: particles[j], distance, alpha });
            particles[j].connections.push({ particle: particles[i], distance, alpha });
          }
        }
      }
    }
    particles.forEach(particle => {
      const noiseScale = 0.001;
      const noiseX = particle.x * noiseScale + particle.noiseOffset;
      const noiseY = particle.y * noiseScale + particle.noiseOffset + 100;
      const noiseVal =
        Math.sin(noiseX + time) * Math.cos(noiseY - time) +
        Math.sin(noiseX * 2 + time * 0.6) * Math.cos(noiseY * 2 - time * 0.6) * 0.3;
      const noiseMultiplier = isSmallContainer ? 0.0085 : 0.00125;
      particle.speedX += Math.cos(noiseVal * Math.PI * 2) * noiseMultiplier;
      particle.speedY += Math.sin(noiseVal * Math.PI * 2) * noiseMultiplier;
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      const centerRange = particle.allowClustering ? 130 : 200;
      const minDistance = particle.allowClustering ? 60 : 90;
      const centerForceMultiplier = isSmallContainer ? 0.1 : 1.0;
      if (distanceToCenter > centerRange) {
        particle.speedX += dx / distanceToCenter * 0.002 * centerForceMultiplier;
        particle.speedY += dy / distanceToCenter * 0.002 * centerForceMultiplier;
      } else if (distanceToCenter < minDistance) {
        particle.speedX -= dx / distanceToCenter * 0.0025 * centerForceMultiplier;
        particle.speedY -= dy / distanceToCenter * 0.0025 * centerForceMultiplier;
      }
      particles.forEach(other => {
        if (other === particle) return;
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < particle.idealSpace) {
          const force = particle.allowClustering && other.allowClustering ? 0.005 : 0.015;
          if (distance < particle.idealSpace * 0.7) {
            particle.speedX += dx / distance * force;
            particle.speedY += dy / distance * force;
          }
        }
      });
      const damping = isSmallContainer ? 0.97 : 0.98;
      particle.speedX *= damping;
      particle.speedY *= damping;
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      if (isSmallContainer) {
        const boundary = 50;
        const screenWidth = canvas.width / zoomLevel;
        const screenHeight = canvas.height / zoomLevel;
        if (particle.x < boundary) {
          particle.speedX += (boundary - particle.x) * 0.01;
        }
        if (particle.x > screenWidth - boundary) {
          particle.speedX -= (particle.x - (screenWidth - boundary)) * 0.01;
        }
        if (particle.y < boundary) {
          particle.speedY += (boundary - particle.y) * 0.01;
        }
        if (particle.y > screenHeight - boundary) {
          particle.speedY -= (particle.y - (screenHeight - boundary)) * 0.01;
        }
      } else {
        if (particle.x < 0) particle.x += canvas.width / zoomLevel;
        if (particle.x > canvas.width / zoomLevel) particle.x -= canvas.width / zoomLevel;
        if (particle.y < 0) particle.y += canvas.height / zoomLevel;
        if (particle.y > canvas.height / zoomLevel) particle.y -= canvas.height / zoomLevel;
      }
    });
    ctx.save();
    ctx.translate(-zoomOffsetX * zoomLevel, -zoomOffsetY * zoomLevel);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.lineWidth = 1 / zoomLevel;
    ctx.lineCap = 'round';
    particles.forEach(particle => {
      particle.connections.forEach(conn => {
        ctx.strokeStyle = `rgba(0, 0, 0, ${conn.alpha})`;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(conn.particle.x, conn.particle.y);
        ctx.stroke();
      });
    });
    particles.forEach(particle => {
      const distanceToCenter = Math.sqrt(
        Math.pow(particle.x - centerX, 2) +
        Math.pow(particle.y - centerY, 2)
      );
      const alphaVariation = isSmallContainer ? 0.4 : 0.5;
      const alpha = Math.max(0.3, Math.min(0.7, 1 - distanceToCenter / (500 + alphaVariation * 100)));
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', resizeCanvas);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
    particles = [];
    time = 0;
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
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  initParticles();
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const ZoomedParticleAnimation = {
  init: createZoomedParticleAnimation
};

export default ZoomedParticleAnimation;
