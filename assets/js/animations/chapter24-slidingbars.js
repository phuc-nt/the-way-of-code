// chapter24-slidingbars.js - Animation cho chương 24: Sliding Ease Vertical Bars
// Được chuyển từ raw_animation/24, hiệu ứng các cột dọc chuyển động mượt
import animationUtils from './animation-utils.js';

const chapter24SlidingBars = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    let animationFrameId = null;
    let canvas, ctx, width, height;
    let time = 0;
    const numLines = 50;
    const lineSpacing = 550 / numLines;

    // Simple noise function
    const noise = (x, y, t) => {
      const n = Math.sin(x * 0.02 + t) * Math.cos(y * 0.02 + t) + 
               Math.sin(x * 0.03 - t) * Math.cos(y * 0.01 + t);
      return (n + 1) / 2;
    };

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

    // Generate patterns that avoid extremes
    const generatePattern = (seed) => {
      const pattern = [];
      for (let i = 0; i < numLines; i++) {
        const lineBars = [];
        let currentY = 0;
        while (currentY < height) {
          const noiseVal = noise(i * lineSpacing, currentY, seed);
          if (noiseVal > 0.5) {
            const barLength = 10 + noiseVal * 30;
            const barWidth = 2 + noiseVal * 3;
            lineBars.push({
              y: currentY + barLength / 2,
              height: barLength,
              width: barWidth
            });
            currentY += barLength + 15;
          } else {
            currentY += 15;
          }
        }
        pattern.push(lineBars);
      }
      return pattern;
    };

    const pattern1 = generatePattern(0);
    const pattern2 = generatePattern(5);

    function animate() {
      time += 0.005;
      const cycleTime = time % (Math.PI * 2);
      let easingFactor;
      if (cycleTime < Math.PI * 0.1) {
        easingFactor = 0;
      } else if (cycleTime < Math.PI * 0.9) {
        const transitionProgress = (cycleTime - Math.PI * 0.1) / (Math.PI * 0.8);
        easingFactor = transitionProgress;
      } else if (cycleTime < Math.PI * 1.1) {
        easingFactor = 1;
      } else if (cycleTime < Math.PI * 1.9) {
        const transitionProgress = (cycleTime - Math.PI * 1.1) / (Math.PI * 0.8);
        easingFactor = 1 - transitionProgress;
      } else {
        easingFactor = 0;
      }
      const smoothEasing = easingFactor < 0.5 
        ? 4 * easingFactor * easingFactor * easingFactor 
        : 1 - Math.pow(-2 * easingFactor + 2, 3) / 2;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < numLines; i++) {
        const x = i * lineSpacing + lineSpacing / 2;
        ctx.beginPath();
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        const bars1 = pattern1[i];
        const bars2 = pattern2[i];
        const maxBars = Math.max(bars1.length, bars2.length);
        for (let j = 0; j < maxBars; j++) {
          let bar1 = bars1[j];
          let bar2 = bars2[j];
          if (!bar1) bar1 = { y: bar2.y - 100, height: 0, width: 0 };
          if (!bar2) bar2 = { y: bar1.y + 100, height: 0, width: 0 };
          const waveOffset = Math.sin(i * 0.3 + j * 0.5 + time * 2) * 10 * 
                           (smoothEasing * (1 - smoothEasing) * 4);
          const y = bar1.y + (bar2.y - bar1.y) * smoothEasing + waveOffset;
          const heightBar = bar1.height + (bar2.height - bar1.height) * smoothEasing;
          const widthBar = bar1.width + (bar2.width - bar1.width) * smoothEasing;
          if (heightBar > 0.1 && widthBar > 0.1) {
            ctx.fillStyle = '#5E5D59';
            ctx.fillRect(x - widthBar/2, y - heightBar/2, widthBar, heightBar);
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (ctx) ctx.clearRect(0, 0, width, height);
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter24SlidingBars;
