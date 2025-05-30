// Animation for Chapter 53: Radial Growth
// Visualization: Growth patterns that spread naturally from centers of energy, showing how complexity emerges from simple rules
import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const radialGrowthAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Create and style canvas
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.display = 'block';
    canvas.style.background = BG_COLOR;
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationTime = 0;
    let radiators = [];
    let animationFrameId = null;

    // Each radiator represents a point of natural growth and decay
    class Radiator {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 40 + 10;
        this.lines = Math.floor(Math.random() * 150 + 100);
        this.growth = (Math.random() * 0.5 + 0.5) * 0.125;
        this.maxLength = Math.random() * 100 + 50;
        this.age = 0;
        this.lifespan = (Math.random() * 200 + 100) * 4;
        this.opacity = 0;
      }
      update() {
        this.age++;
        if (this.age < this.lifespan * 0.2) {
          this.opacity = Math.min(1, this.age / (this.lifespan * 0.2));
        } else if (this.age > this.lifespan * 0.8) {
          this.opacity = Math.max(0, 1 - (this.age - this.lifespan * 0.8) / (this.lifespan * 0.2));
        } else {
          this.opacity = 1;
        }
      }
      draw() {
        const currentLength = Math.min(this.maxLength, this.age * this.growth);
        const centerRadius = 1 + this.age * 0.0025;
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.translate(this.x, this.y);
        for (let i = 0; i < this.lines; i++) {
          const angle = (i / this.lines) * Math.PI * 2;
          const length = currentLength;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.restore();
      }
      isDead() {
        return this.age > this.lifespan;
      }
    }

    function spawnRadiator() {
      if (radiators.length < 50) {
        let baseX, baseY;
        if (radiators.length > 0 && Math.random() < 0.8) {
          const parent = radiators[Math.floor(Math.random() * radiators.length)];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 50 + 20;
          baseX = parent.x + Math.cos(angle) * distance;
          baseY = parent.y + Math.sin(angle) * distance;
        } else {
          const centerBias = Math.random() * 0.5 + 0.5;
          baseX = canvas.width/2 + (Math.random() - 0.5) * canvas.width * centerBias;
          baseY = canvas.height/2 + (Math.random() - 0.5) * canvas.height * centerBias;
        }
        baseX = Math.max(50, Math.min(canvas.width - 50, baseX));
        baseY = Math.max(50, Math.min(canvas.height - 50, baseY));
        radiators.push(new Radiator(baseX, baseY));
      }
    }

    function animate() {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationTime++;
      if (animationTime % 40 === 0) {
        spawnRadiator();
      }
      radiators = radiators.filter(radiator => !radiator.isDead());
      radiators.forEach(radiator => {
        radiator.update();
        radiator.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      // Optionally, handle responsive canvas if needed
    }
    window.addEventListener('resize', handleResize);

    animationUtils.fadeOutLoader(container);

    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (container && canvas) container.removeChild(canvas);
        radiators = [];
        animationTime = 0;
      }
    };
  }
};

export default radialGrowthAnimation;
