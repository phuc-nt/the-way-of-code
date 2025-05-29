// chapter21-kaleidoscopewavecentersquare.js - Animation cho chương 21: Kaleidoscope Wave Center Square
// Được chuyển từ raw_animation/21, tuân thủ chuẩn animation module của hệ thống
import animationUtils from './animation-utils.js';

const chapter21KaleidoscopeWaveCenterSquare = {
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
    const centerX = width / 2;
    const centerY = height / 2;
    // Off-screen canvas for segment
    const segmentCanvas = document.createElement('canvas');
    const segmentCtx = segmentCanvas.getContext('2d');
    segmentCanvas.width = width;
    segmentCanvas.height = height;
    let time = 0;
    function animate() {
      time += 0.007;
      ctx.fillStyle = '#F0EEE6';
      ctx.fillRect(0, 0, width, height);
      segmentCtx.clearRect(0, 0, width, height);
      const resolution = 2;
      const squareSize = 200;
      const squareX = centerX - squareSize/2;
      const squareY = centerY - squareSize/2;
      for (let x = squareX; x < squareX + squareSize; x += resolution) {
        for (let y = squareY; y < squareY + squareSize; y += resolution) {
          const dx = x - centerX;
          const dy = y - centerY;
          const r = Math.sqrt(dx * dx + dy * dy);
          const theta = Math.atan2(dy, dx);
          let wave1 = Math.sin(r * 0.1 - time);
          let wave2 = Math.cos(theta * 8 + time * 0.5);
          let wave3 = Math.sin((r - theta * 100) * 0.05 + time * 1.5);
          let value = (wave1 + wave2 + wave3) / 3;
          value += (Math.random() - 0.5) * 0.2;
          const opacity = Math.abs(value) * 0.8;
          segmentCtx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          segmentCtx.fillRect(x, y, resolution, resolution);
        }
      }
      const numSegments = 8;
      for (let i = 0; i < numSegments; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((i * Math.PI * 2) / numSegments);
        if (i % 2 === 1) {
          ctx.scale(1, -1);
        }
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(segmentCanvas, 0, 0);
        ctx.restore();
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx) ctx.clearRect(0, 0, width, height);
        if (segmentCtx) segmentCtx.clearRect(0, 0, width, height);
        segmentCanvas.width = 0;
        segmentCanvas.height = 0;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter21KaleidoscopeWaveCenterSquare;
