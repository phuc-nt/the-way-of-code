// chapter36-particlereverie.js - Animation cho Chapter 36
// Visualization: Forms contract to find expansion, discovering strength through yielding

import animationUtils from './animation-utils.js';

const chapter36Animation = {
  settings: {
    backgroundColor: animationUtils.colors.background,
    width: 550,
    height: 550,
    numParticles: 5000,
    targetFPS: 36
  },

  init(container) {
    if (!container) return null;
    const canvas = animationUtils.createSquareCanvas(container);
    const ctx = canvas.getContext('2d');
    const width = this.settings.width;
    const height = this.settings.height;
    const numParticles = this.settings.numParticles;
    let time = 65;
    let animationStartTime = 0;
    // Pre-calculate initial state to match frame 65 exactly
    const initialT = 65;
    // Create particles in a formation that matches frame 65 exactly
    const particles = Array(numParticles).fill().map((_, i) => {
      const angle1 = (i / numParticles) * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const baseScale = 120;
      const initialMorphFactor = Math.sin(initialT * 0.2) * 0.5 + 0.5;
      const r1 = baseScale * (1 + 0.3 * Math.sin(angle1 * 2));
      const shape1X = r1 * Math.cos(angle1) * (1 + 0.2 * Math.sin(angle1 * 3 + initialT * 0.1));
      const shape1Y = r1 * Math.sin(angle1) * (1 + 0.4 * Math.cos(angle1 * 3 + initialT * 0.2));
      const r2 = baseScale * (1 + 0.4 * Math.sin(angle2 * 3));
      const shape2X = r2 * Math.cos(angle2) * (1 + 0.3 * Math.sin(angle2 * 2 + initialT * 0.15));
      const shape2Y = r2 * Math.sin(angle2) * (1 + 0.2 * Math.cos(angle2 * 4 + initialT * 0.25));
      let x = width/2 + (shape1X * (1 - initialMorphFactor) + shape2X * initialMorphFactor);
      let y = height/2 + (shape1Y * (1 - initialMorphFactor) + shape2Y * initialMorphFactor);
      const initialBulgeAmount = 50 * (Math.sin(initialT * 0.3) * 0.2 + 0.8);
      const bulgeX = initialBulgeAmount * Math.exp(-Math.pow(angle1 - Math.PI * 0.5, 2));
      const bulgeY = initialBulgeAmount * 0.5 * Math.exp(-Math.pow(angle1 - Math.PI * 0.5, 2));
      x += bulgeX * Math.sin(initialT * 0.4);
      y += bulgeY * Math.cos(initialT * 0.3);
      return {
        x,
        y,
        size: Math.random() * 1.5 + 0.5,
        connections: [],
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        angle: angle2
      };
    });
    // Calculate how forms must contract to find expansion
    const calculateTargets = (t) => {
      const animationTime = t - 65 + animationStartTime;
      const startupEasing = Math.min(1, animationTime / 10);
      const morphFactor = Math.sin(t * 0.2) * 0.5 + 0.5;
      particles.forEach((particle, i) => {
        const angle1 = (i / numParticles) * Math.PI * 2;
        const angle2 = particle.angle;
        const baseScale = 120;
        const bulgeAmount = 50 * (Math.sin(t * 0.3) * 0.2 + 0.8);
        const timeEffect1 = t + (animationTime * startupEasing * 0.1);
        const r1 = baseScale * (1 + 0.3 * Math.sin(angle1 * 2));
        const shape1X = r1 * Math.cos(angle1) * (1 + 0.2 * Math.sin(angle1 * 3 + timeEffect1 * 0.1));
        const shape1Y = r1 * Math.sin(angle1) * (1 + 0.4 * Math.cos(angle1 * 3 + timeEffect1 * 0.2));
        const timeEffect2 = t + (animationTime * startupEasing * 0.1);
        const r2 = baseScale * (1 + 0.4 * Math.sin(angle2 * 3));
        const shape2X = r2 * Math.cos(angle2) * (1 + 0.3 * Math.sin(angle2 * 2 + timeEffect2 * 0.15));
        const shape2Y = r2 * Math.sin(angle2) * (1 + 0.2 * Math.cos(angle2 * 4 + timeEffect2 * 0.25));
        particle.targetX = shape1X * (1 - morphFactor) + shape2X * morphFactor;
        particle.targetY = shape1Y * (1 - morphFactor) + shape2Y * morphFactor;
        const bulgeX = bulgeAmount * Math.exp(-Math.pow(angle1 - Math.PI * 0.5, 2));
        const bulgeY = bulgeAmount * 0.5 * Math.exp(-Math.pow(angle1 - Math.PI * 0.5, 2));
        particle.targetX += bulgeX * Math.sin(timeEffect1 * 0.4);
        particle.targetY += bulgeY * Math.cos(timeEffect1 * 0.3);
        particle.targetX += (Math.random() - 0.5) * 5;
        particle.targetY += (Math.random() - 0.5) * 5;
      });
    };
    let updateParticles = () => {
      const animationTime = time - 65 + animationStartTime;
      particles.forEach(particle => {
        const dx = particle.targetX - (particle.x - width/2);
        const dy = particle.targetY - (particle.y - height/2);
        const startupPhase = Math.min(1, animationTime / 5);
        const easing = 0.01 + (0.02 * startupPhase);
        particle.x += dx * easing;
        particle.y += dy * easing;
        particle.connections = [];
      });
    };
    const calculateConnections = () => {
      const maxDist = 25;
      const maxConnections = 3;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.connections.length >= maxConnections) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.connections.length >= maxConnections) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            p1.connections.push(j);
            p2.connections.push(i);
            if (p1.connections.length >= maxConnections) break;
          }
        }
      }
    };
    const draw = () => {
      ctx.fillStyle = this.settings.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(51, 51, 51, 0.2)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = 0; j < p1.connections.length; j++) {
          const p2 = particles[p1.connections[j]];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const offset = 5 * Math.sin(time * 0.5 + i * 0.01);
          ctx.quadraticCurveTo(midX + offset, midY + offset, p2.x, p2.y);
          ctx.stroke();
        }
      }
      particles.forEach(particle => {
        const distFromCenter = Math.sqrt(
          Math.pow(particle.x - width/2, 2) + 
          Math.pow(particle.y - height/2, 2)
        );
        const opacity = Math.max(0.1, 1 - distFromCenter / 300);
        ctx.fillStyle = `rgba(51, 51, 51, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    let animationFrameId = null;
    let lastFrameTime = 0;
    const targetFPS = this.settings.targetFPS;
    const frameInterval = 1000 / targetFPS;
    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTime - remainder;
        time += 0.005;
        calculateTargets(time);
        updateParticles();
        calculateConnections();
        draw();
      }
    };
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
      particles.length = 0;
    };
  }
};

export default chapter36Animation;
