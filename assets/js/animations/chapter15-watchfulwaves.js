// chapter15-watchfulwaves.js - Animation cho chương 15: Watchful Waves
import animationUtils from './animation-utils.js';

const chapter15WatchfulWaves = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    // Hiển thị loader trong quá trình thiết lập
    const loader = container.querySelector('.animation-loader');

    // Tạo canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.settings.width;
    canvas.height = this.settings.height;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = this.settings.colors.background;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Higher resolution for finer detail
    const resolution = 2;
    const gridWidth = Math.floor(width / resolution);
    const gridHeight = Math.floor(height / resolution);

    // Define still points of watchful awareness
    const sources = [
      { x: width/2, y: height/2 },
      { x: width/4, y: height/4 },
      { x: 3*width/4, y: height/4 },
      { x: width/4, y: 3*height/4 },
      { x: 3*width/4, y: 3*height/4 },
    ];

    const wavelength = 35;
    let time = 0;

    // Offscreen canvas for performance
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = gridWidth;
    offscreenCanvas.height = gridHeight;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    const twoPI = Math.PI * 2;
    const waveConstant = twoPI / wavelength;

    let animationFrameId = null;

    const animate = () => {
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      const imageData = offscreenCtx.createImageData(gridWidth, gridHeight);
      const data = imageData.data;
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const pixelX = x * resolution + resolution/2;
          const pixelY = y * resolution + resolution/2;
          let amplitude = 0;
          for (let i = 0; i < sources.length; i++) {
            const dx = pixelX - sources[i].x;
            const dy = pixelY - sources[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            amplitude += Math.sin(distance * waveConstant - time * twoPI);
          }
          const index = (y * gridWidth + x) * 4;
          const threshold = Math.abs(amplitude);
          if (threshold < 0.6) {
            const opacity = (0.6 - threshold) * 0.4 * 255;
            data[index] = 160;
            data[index + 1] = 160;
            data[index + 2] = 160;
            data[index + 3] = opacity;
          } else {
            data[index] = 255;
            data[index + 1] = 255;
            data[index + 2] = 255;
            data[index + 3] = 255;
          }
        }
      }
      offscreenCtx.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      time += 0.0008;
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (canvas && ctx) {
          ctx.clearRect(0, 0, width, height);
        }
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        if (offscreenCanvas) {
          offscreenCanvas.width = 0;
          offscreenCanvas.height = 0;
        }
      }
    };
  }
};

export default chapter15WatchfulWaves;
