// chapter28-crystallinebiology.js - Animation cho chương 28: Crystalline Biology
// Được chuyển từ raw_animation/28, tuân thủ chuẩn animation module của hệ thống
import animationUtils from './animation-utils.js';

const chapter28CrystallineBiology = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationFrameId = null;
    const width = this.settings.width;
    const height = this.settings.height;
    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let time = 0;
    let crystals = [];
    const numCrystals = 4;
    class Crystal {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.segments = [];
        this.angle = 0;
        this.rotationSpeed = 0.001;
        this.sides = 6;
        this.baseGrowthPhase = Math.random() * Math.PI * 2;
        this.lastGrowthPhase = 0;
        this.currentGrowthPhase = 0;
        this.generateStructure();
      }
      generateStructure() {
        this.segments = [];
        for (let ring = 0; ring < 5; ring++) {
          const ringRadius = this.size * (0.15 + ring * 0.17);
          const numSegments = this.sides * (ring + 1);
          for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const innerRadius = ring === 0 ? 0 : this.size * (0.15 + (ring - 1) * 0.17);
            this.segments.push({
              angle: angle,
              innerRadius: innerRadius,
              outerRadius: ringRadius,
              basePhase: Math.random() * Math.PI * 2,
              currentInnerRadius: innerRadius,
              currentOuterRadius: ringRadius,
              currentAngle: angle,
              branching: ring > 2 && Math.random() < 0.2
            });
          }
        }
      }
      update(time) {
        this.angle += this.rotationSpeed * 5;
        this.lastGrowthPhase = this.currentGrowthPhase;
        const targetGrowthPhase = Math.sin(time * 0.05 + this.baseGrowthPhase) * 0.15 + 0.85;
        this.currentGrowthPhase += (targetGrowthPhase - this.currentGrowthPhase) * 0.005;
        this.segments.forEach((segment) => {
          const targetInnerRadius = segment.innerRadius * this.currentGrowthPhase;
          const targetOuterRadius = segment.outerRadius * this.currentGrowthPhase;
          const targetAngle = segment.angle + Math.sin(time * 0.15 + segment.basePhase) * 0.005;
          segment.currentInnerRadius += (targetInnerRadius - segment.currentInnerRadius) * 0.005;
          segment.currentOuterRadius += (targetOuterRadius - segment.currentOuterRadius) * 0.005;
          segment.currentAngle += (targetAngle - segment.currentAngle) * 0.005;
        });
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.sides; i++) {
          const angle = (i / this.sides) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * this.size,
            Math.sin(angle) * this.size
          );
          ctx.stroke();
        }
        this.segments.forEach(segment => {
          const innerX = Math.cos(segment.currentAngle) * segment.currentInnerRadius;
          const innerY = Math.sin(segment.currentAngle) * segment.currentInnerRadius;
          const outerX = Math.cos(segment.currentAngle) * segment.currentOuterRadius;
          const outerY = Math.sin(segment.currentAngle) * segment.currentOuterRadius;
          ctx.strokeStyle = 'rgba(60, 60, 60, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(outerX, outerY);
          ctx.stroke();
          const numNodes = 1;
          for (let n = 0; n < numNodes; n++) {
            const t = 0.6;
            const nodeX = innerX + (outerX - innerX) * t;
            const nodeY = innerY + (outerY - innerY) * t;
            const nodeSize = 6;
            const nodePoints = 8;
            ctx.beginPath();
            for (let p = 0; p <= nodePoints; p++) {
              const a = (p / nodePoints) * Math.PI * 2;
              const r = nodeSize * (1 + Math.sin(a * 2 + segment.basePhase) * 0.05);
              const px = nodeX + Math.cos(a) * r;
              const py = nodeY + Math.sin(a) * r;
              if (p === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, nodeSize * 0.25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
          if (segment.branching) {
            const branchAngle = segment.currentAngle + 0.2;
            const branchLength = segment.currentOuterRadius * 0.3;
            const branchX = outerX + Math.cos(branchAngle) * branchLength;
            const branchY = outerY + Math.sin(branchAngle) * branchLength;
            ctx.strokeStyle = 'rgba(60, 60, 60, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(outerX, outerY);
            ctx.lineTo(branchX, branchY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(branchX, branchY, 2.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(60, 60, 60, 0.4)';
            ctx.stroke();
          }
        });
        const coreSize = this.size * 0.06;
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, coreSize * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }
    function initCrystals() {
      crystals = [];
      for (let i = 0; i < numCrystals; i++) {
        const x = canvas.width * (0.2 + Math.random() * 0.6);
        const y = canvas.height * (0.2 + Math.random() * 0.6);
        const size = 70 + Math.random() * 30;
        crystals.push(new Crystal(x, y, size));
      }
    }
    initCrystals();
    let lastFrameTime = 0;
    const targetFPS = 16.7;
    const frameInterval = 1000 / targetFPS;
    function animate(currentTime) {
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        ctx.fillStyle = animationUtils.colors.background;
        ctx.fillRect(0, 0, width, height);
        time += 0.005;
        crystals.forEach(crystal => {
          crystal.update(time);
          crystal.draw(ctx);
        });
        for (let i = 0; i < crystals.length; i++) {
          for (let j = i + 1; j < crystals.length; j++) {
            const crystalA = crystals[i];
            const crystalB = crystals[j];
            const distance = Math.sqrt(
              (crystalA.x - crystalB.x) * (crystalA.x - crystalB.x) +
              (crystalA.y - crystalB.y) * (crystalA.y - crystalB.y)
            );
            if (distance < 280) {
              const opacity = Math.pow(1 - distance / 280, 2) * 0.1;
              ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(crystalA.x, crystalA.y);
              ctx.lineTo(crystalB.x, crystalB.y);
              ctx.stroke();
            }
          }
        }
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx) ctx.clearRect(0, 0, width, height);
        crystals.length = 0;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter28CrystallineBiology;
