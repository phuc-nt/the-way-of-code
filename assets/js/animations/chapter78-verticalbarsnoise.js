// chapter78-verticalbarsnoise.js - Vertical Bars Noise animation for Chapter 78
// Themes: power of softness, water's way, universal truth
// Visualization: Bars that yield and flow like water, demonstrating how gentleness overcomes the rigid

function createVerticalBarsNoiseAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  const numLines = 50;
  const CANVAS_SIZE = 550;

  function noise(x, y, t) {
    const n = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) +
             Math.sin(x * 0.015 - t) * Math.cos(y * 0.005 + t);
    return (n + 1) / 2;
  }

  function animate() {
    time += 0.0005;
    ctx.fillStyle = '#F0EEE6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const lineSpacing = canvas.height / numLines;
    for (let i = 0; i < numLines; i++) {
      const y = i * lineSpacing + lineSpacing / 2;
      ctx.beginPath();
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      for (let x = 0; x < canvas.width; x += 8) {
        const noiseVal = noise(x, y, time);
        if (noiseVal > 0.5) {
          const barWidth = 3 + noiseVal * 10;
          const barHeight = 2 + noiseVal * 3;
          const animatedX = x + Math.sin(time + y * 0.0375) * 20 * noiseVal;
          ctx.fillStyle = '#000000';
          ctx.fillRect(animatedX - barWidth/2, y - barHeight/2, barWidth, barHeight);
        }
      }
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
    time = 0;
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  container.style.width = CANVAS_SIZE + 'px';
  container.style.height = CANVAS_SIZE + 'px';
  canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const VerticalBarsNoiseAnimation = {
  init: createVerticalBarsNoiseAnimation
};

export default VerticalBarsNoiseAnimation;
