// chapter76-organicgrowth.js - Organic Growth animation for Chapter 76
// Themes: organic growth, cycles, transformation
// Visualization: Spiraling scales that grow and reverse in a breathing, organic sequence

function createOrganicGrowthAnimation(container) {
  let animationFrameId;
  let time = 0;
  let totalTime = 0;
  let isReversing = false;
  let width = 800, height = 800;
  let ctx, canvas;
  let scales = [];
  const numScales = 80;

  class Scale {
    constructor(x, y, angle, delay, index, totalScales) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.size = 0;
      this.targetSize = 20;
      this.delay = delay;
      this.reverseDelay = (totalScales - index - 1) * 120;
      this.birth = 0;
      this.opacity = 0;
      this.currentSize = 0;
    }
    shouldStart(totalTime, isReversing) {
      const relevantDelay = isReversing ? this.reverseDelay : this.delay;
      return totalTime > relevantDelay;
    }
    update(totalTime, isReversing, time) {
      if (this.shouldStart(totalTime, isReversing)) {
        const growthRate = 0.005;
        if (isReversing) {
          this.birth = Math.max(0, this.birth - growthRate);
        } else {
          this.birth = Math.min(Math.PI/2, this.birth + growthRate);
        }
        this.size = this.targetSize * Math.sin(this.birth);
        this.opacity = Math.min(this.birth * 0.5, 1);
      }
      const breathe = Math.sin(time * 0.0008 + this.delay) * 0.05;
      this.currentSize = this.size * (1 + breathe);
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -this.currentSize/2);
      ctx.quadraticCurveTo(this.currentSize/2, 0, 0, this.currentSize/2);
      ctx.quadraticCurveTo(-this.currentSize/2, 0, 0, -this.currentSize/2);
      ctx.closePath();
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.restore();
    }
    isComplete() {
      return this.birth >= Math.PI/2;
    }
  }

  function handleResize() {
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const size = Math.min(containerWidth, containerHeight);
    width = size;
    height = size;
    canvas.width = width;
    canvas.height = height;
  }

  function initScales() {
    scales = [];
    const centerX = width / 2;
    for (let i = 0; i < numScales; i++) {
      const t = i / numScales;
      const y = height - 50 - (t * (height - 100));
      const angle = t * Math.PI * 8;
      const radius = (30 + Math.sin(t * Math.PI * 2) * 20) * (width / 800);
      const x = centerX + Math.cos(angle) * radius;
      const scaleAngle = angle + Math.PI/2;
      const delay = i * 120;
      scales.push(new Scale(x, y, scaleAngle, delay, i, numScales));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const allComplete = scales.every(scale => scale.isComplete());
    const allReversed = scales.every(scale => scale.birth <= 0);
    if (allComplete && !isReversing) {
      isReversing = true;
      totalTime = 0;
    } else if (allReversed && isReversing) {
      isReversing = false;
      totalTime = 0;
    }
    scales.forEach(scale => {
      scale.update(totalTime, isReversing, time);
      scale.draw(ctx);
    });
    time += 8;
    totalTime += 8;
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
    scales = [];
    time = 0;
    totalTime = 0;
    isReversing = false;
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
  initScales();
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const OrganicGrowthAnimation = {
  init: createOrganicGrowthAnimation
};

export default OrganicGrowthAnimation;
