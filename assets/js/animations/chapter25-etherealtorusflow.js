// chapter25-etherealtorusflow.js - Animation cho chương 25: Ethereal Torus Flow
// Được chuyển từ raw_animation/25, tuân thủ chuẩn animation module của hệ thống
import animationUtils from './animation-utils.js';

const chapter25EtherealTorusFlow = {
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
    let particles = [], time = 0;
    const numParticles = 9000;

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

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.u = Math.random() * Math.PI * 2;
        this.v = Math.random() * Math.PI * 2;
        this.R = 150;
        this.r = 60 + Math.random() * 30;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.speed = Math.random() * 0.001875 + 0.0005;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.u += this.speed;
        const breathingFactor = Math.sin(time + this.phase) * 0.0475;
        this.r += breathingFactor;
        const x = (this.R + this.r * Math.cos(this.v)) * Math.cos(this.u);
        const y = (this.R + this.r * Math.cos(this.v)) * Math.sin(this.u);
        const z = this.r * Math.sin(this.v);
        const scale = 1000 / (1000 + z);
        this.x = x * scale + width / 2;
        this.y = y * scale + height / 2;
        this.displaySize = this.size * scale;
        this.displayOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.u));
      }
      draw() {
        ctx.fillStyle = `rgba(40, 40, 40, ${this.displayOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.displaySize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    let lastFrameTime = 0;
    const targetFPS = 20;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        ctx.fillStyle = 'rgba(240, 238, 230, 0.03)';
        ctx.fillRect(0, 0, width, height);
        time += 0.004;
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (ctx) ctx.clearRect(0, 0, width, height);
        particles.length = 0;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter25EtherealTorusFlow;
