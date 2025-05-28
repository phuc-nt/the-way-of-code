// chapter17-kaleidoscope.js - Animation cho chương 17: Kaleidoscope Leadership
import animationUtils from './animation-utils.js';

const chapter17Kaleidoscope = {
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
    canvas.width = this.settings.width * window.devicePixelRatio;
    canvas.height = this.settings.height * window.devicePixelRatio;
    canvas.style.width = `${this.settings.width}px`;
    canvas.style.height = `${this.settings.height}px`;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = this.settings.colors.background;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const width = this.settings.width;
    const height = this.settings.height;
    let time = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    // Off-screen canvas for segment
    const segmentCanvas = document.createElement('canvas');
    segmentCanvas.width = canvas.width;
    segmentCanvas.height = canvas.height;
    const segmentCtx = segmentCanvas.getContext('2d');
    let animationFrameId = null;

    function animate() {
      time += 0.005;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      segmentCtx.clearRect(0, 0, segmentCanvas.width, segmentCanvas.height);
      const resolution = 1;
      for (let x = 0; x < centerX + 250; x += resolution) {
        for (let y = 0; y < centerY + 250; y += resolution) {
          const dx = x - centerX;
          const dy = y - centerY;
          const r = Math.sqrt(dx * dx + dy * dy);
          const theta = Math.atan2(dy, dx);
          if (theta >= 0 && theta <= Math.PI / 4 && r < 250) {
            const cornerRadius = 20;
            const edgeDistance = Math.min(
              250 - r,
              r * Math.abs(Math.PI/4 - theta) * 2.5
            );
            const edgeFade = Math.min(1, edgeDistance / cornerRadius);
            let wave1 = Math.sin(r * 0.1 - time * 2);
            let wave2 = Math.cos(theta * 8 + time);
            let wave3 = Math.sin((r - theta * 100) * 0.05 + time * 3);
            let value = (wave1 + wave2 + wave3) / 3;
            value += (Math.random() - 0.5) * 0.2;
            const opacity = Math.abs(value) * 0.8 * edgeFade;
            segmentCtx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            segmentCtx.fillRect(x, y, resolution, resolution);
          }
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
    animate();
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
        if (segmentCanvas) {
          segmentCanvas.width = 0;
          segmentCanvas.height = 0;
        }
      }
    };
  }
};

export default chapter17Kaleidoscope;
