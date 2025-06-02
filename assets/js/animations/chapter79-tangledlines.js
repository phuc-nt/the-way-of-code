// chapter79-tangledlines.js - Tangled Lines animation for Chapter 79
import animationUtils from './animation-utils.js';
// Themes: learning from failure, personal responsibility, natural service
// Visualization: Lines that find their way through entanglement, showing how clarity emerges from confusion

function createTangledLinesAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  let layers = [];
  const layerCount = 7;
  let mouse = { x: 0, y: 0 };
  const zoom = 1;

  class Layer {
    constructor(index) {
      this.index = index;
      this.radius = 50 + index * 35;
      this.rotation = 0;
      this.particles = [];
      this.particleCount = 3 + index * 4;
      this.thickness = 0.5 + index * 0.2;
      this.drift = Math.random() * Math.PI * 2;
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          angle: (i / this.particleCount) * Math.PI * 2,
          offset: Math.random() * 10,
          phase: Math.random() * Math.PI * 2,
          amplitude: 3 + Math.random() * 5,
          flowSpeed: 0.0017 + Math.random() * 0.0017
        });
      }
    }
    update(mouseInfluence) {
      this.rotation += (0.00025 / (this.index + 1)) * (1 + mouseInfluence * 0.2);
      this.drift += 0.0008;
      this.particles.forEach(particle => {
        particle.angle += particle.flowSpeed * (1 - this.index / layerCount);
      });
    }
    draw(ctx, centerX, centerY, mouseInfluence, scale) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(80, 80, 80, 0.20)`;
      ctx.lineWidth = this.thickness;
      this.particles.forEach((particle, i) => {
        const angle = particle.angle + Math.sin(time * 0.04 + particle.phase) * 0.1;
        const radiusOffset = Math.sin(time + particle.phase) * particle.amplitude;
        const radius = this.radius + radiusOffset + particle.offset;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  function handleMouseMove(e) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function handleResize() {
    if (!container) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.width = container.offsetWidth + 'px';
    canvas.style.height = container.offsetHeight + 'px';
  }

  function animate() {
    ctx.fillStyle = animationUtils.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = mouse.x - centerX;
    const dy = mouse.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const mouseInfluence = Math.max(0, 1 - distance / 200);
    const minDimension = Math.min(canvas.width, canvas.height);
    const scale = (minDimension / 800) * zoom;
    const rayCount = 24;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2 + time * 0.004;
      const length = 300 * scale + Math.sin(time + i) * 50 * scale;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
      ctx.stroke();
    }
    layers.forEach(layer => layer.update(mouseInfluence));
    for (let i = layers.length - 1; i >= 0; i--) {
      layers[i].draw(ctx, centerX, centerY, mouseInfluence, scale);
    }
    time += 0.0005;
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    container.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrameId);
    layers.forEach(layer => { if (layer.particles) layer.particles.length = 0; });
    layers.length = 0;
    time = 0;
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = animationUtils.colors.background;
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
  container.addEventListener('mousemove', handleMouseMove);
  for (let i = 0; i < layerCount; i++) {
    layers.push(new Layer(i));
  }
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const TangledLinesAnimation = {
  init: createTangledLinesAnimation
};

export default TangledLinesAnimation;
