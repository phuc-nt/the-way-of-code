// chapter71-waveinterferencev3.js - Wave Interference V3 animation for Chapter 71
import animationUtils from './animation-utils.js';
// Themes: pure unknowing, freedom from stagnation, true wholeness
// Visualization: Waves that continuously transform and interfere, showing how patterns emerge from openness to change

function createWaveInterferenceV3Animation(container) {
  let animationFrameId = null;
  let time = 0;
  let canvas, ctx;
  let width, height;
  const sources = [];

  function handleResize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function setupSources() {
    sources.length = 0;
    width = container.offsetWidth;
    height = container.offsetHeight;
    sources.push(
      { x: width/2, y: height/2 },
      { x: width/4, y: height/4 },
      { x: 3*width/4, y: height/4 },
      { x: width/4, y: 3*height/4 },
      { x: 3*width/4, y: 3*height/4 },
      { x: width/2, y: height/5 },
      { x: width/2, y: 4*height/5 }
    );
  }

  function animate() {
    ctx.fillStyle = animationUtils.colors.background;
    ctx.fillRect(0, 0, width, height);
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const wavelength = 20;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let amplitude = 0;
        sources.forEach((source, i) => {
          const dx = x - source.x;
          const dy = y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const phase = i * Math.PI / 3;
          amplitude += Math.sin((distance / wavelength - time) * 2 * Math.PI + phase);
        });
        const normalized = amplitude / sources.length;
        const threshold = 0.1;
        const isLine = Math.abs(normalized) < threshold;
        const index = (y * width + x) * 4;
        if (isLine) {
          data[index] = 34;
          data[index + 1] = 34;
          data[index + 2] = 34;
          data[index + 3] = 255;
        } else {
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
          data[index + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    time += 0.015;
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', handleResize);
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (container && canvas.parentNode === container) container.removeChild(canvas);
    sources.length = 0;
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
  setupSources();
  window.addEventListener('resize', () => {
    handleResize();
    setupSources();
  });
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const WaveInterferenceV3Animation = {
  init: createWaveInterferenceV3Animation
};

export default WaveInterferenceV3Animation;
