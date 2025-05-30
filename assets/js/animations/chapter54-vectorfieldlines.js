// Animation for Chapter 54: Vector Field Lines
// Visualization: Lines that follow invisible force fields, showing how deep patterns emerge from firmly established principles
import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const vectorFieldLinesAnimation = {
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
    const width = canvas.width;
    const height = canvas.height;
    const numLines = 300;
    const linePoints = 200;
    const noiseScale = 0.005;
    const noiseTimeScale = 0.000125;
    const lineAlpha = 0.4;
    const lineWidth = 0.5;
    let animationFrameId = null;
    let time = 0;

    // Simple noise function
    const noise = (x, y, z) => {
      return Math.sin(x * 7 + z * 3) * 0.5 + Math.sin(y * 8 + z * 4) * 0.5;
    };

    // The underlying force that guides all movement
    const vectorField = (x, y, t) => {
      const nx = (x - width / 2) * 0.01;
      const ny = (y - height / 2) * 0.01;
      const n = noise(nx, ny, t * noiseTimeScale);
      const cx = x - width / 2;
      const cy = y - height / 2;
      const r = Math.sqrt(cx * cx + cy * cy);
      const mask = Math.max(0, 1 - r / 200);
      const angle = n * Math.PI * 4 + Math.atan2(cy, cx);
      return {
        x: Math.cos(angle) * mask,
        y: Math.sin(angle) * mask
      };
    };

    class Line {
      constructor() {
        this.reset();
      }
      reset() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        this.x = width / 2 + Math.cos(angle) * distance;
        this.y = height / 2 + Math.sin(angle) * distance;
        this.points = [];
        this.age = 0;
        this.lifespan = 400 + Math.random() * 600;
        this.opacity = 0;
        this.fadeIn = true;
        this.width = 0.2 + Math.random() * 0.8;
      }
      update(t) {
        this.age += 1;
        if (this.age >= this.lifespan) {
          this.reset();
          return;
        }
        const progress = this.age / this.lifespan;
        if (progress < 0.1) {
          this.opacity = progress / 0.1 * lineAlpha;
        } else if (progress > 0.9) {
          this.opacity = (1 - (progress - 0.9) / 0.1) * lineAlpha;
        } else {
          this.opacity = lineAlpha;
        }
        const vector = vectorField(this.x, this.y, t);
        this.points.push({ x: this.x, y: this.y });
        if (this.points.length > linePoints) {
          this.points.shift();
        }
        this.x += vector.x * 0.5;
        this.y += vector.y * 0.5;
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || magnitude < 0.01) {
          this.reset();
        }
      }
      draw(ctx) {
        if (this.points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(51, 51, 51, ${this.opacity})`;
        ctx.lineWidth = this.width * lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
      }
    }

    const lines = Array.from({ length: numLines }, () => new Line());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);
      lines.forEach(line => {
        line.update(time);
        line.draw(ctx);
      });
      time += 1;
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
        lines.length = 0;
      }
    };
  }
};

export default vectorFieldLinesAnimation;
