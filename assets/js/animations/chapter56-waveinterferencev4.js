// Animation for Chapter 56: Wave Interference V4
// Visualization: Waves that interfere and merge without resistance, showing how patterns emerge from silence
import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const waveInterferenceV4Animation = {
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
    const width = CANVAS_SIZE;
    const height = CANVAS_SIZE;
    // Points of origin from which patterns emerge
    const sources = [];
    const gridSize = 4;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        sources.push({
          x: width * (i + 0.5) / gridSize,
          y: height * (j + 0.5) / gridSize,
          wavelength: 15 + Math.random() * 10,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    let time = 0;
    let animationFrameId = null;
    function animate() {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      const resolution = 2;
      const rows = Math.floor(height / resolution);
      const cols = Math.floor(width / resolution);
      const field = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * resolution;
          const y = i * resolution;
          let amplitude = 0;
          sources.forEach(source => {
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            amplitude += Math.sin((distance / source.wavelength - time) * 2 * Math.PI + source.phase);
          });
          field[i][j] = amplitude / sources.length;
        }
      }
      const contourLevels = [-0.6, -0.3, 0, 0.3, 0.6];
      contourLevels.forEach(level => {
        ctx.beginPath();
        for (let i = 0; i < rows - 1; i++) {
          for (let j = 0; j < cols - 1; j++) {
            const x = j * resolution;
            const y = i * resolution;
            const case4 =
              (field[i][j] > level ? 8 : 0) +
              (field[i][j + 1] > level ? 4 : 0) +
              (field[i + 1][j + 1] > level ? 2 : 0) +
              (field[i + 1][j] > level ? 1 : 0);
            switch (case4) {
              case 1: case 14:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 2: case 13:
                ctx.moveTo(x + resolution / 2, y + resolution);
                ctx.lineTo(x + resolution, y + resolution / 2);
                break;
              case 3: case 12:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution, y + resolution / 2);
                break;
              case 4: case 11:
                ctx.moveTo(x + resolution, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                break;
              case 5: case 10:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                ctx.moveTo(x + resolution, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 6: case 9:
                ctx.moveTo(x + resolution / 2, y);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 7: case 8:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                break;
            }
          }
        }
        ctx.stroke();
      });
      time += 0.003;
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
      }
    };
  }
};

export default waveInterferenceV4Animation;
