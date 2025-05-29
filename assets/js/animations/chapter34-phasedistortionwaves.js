// chapter34-phasedistortionwaves.js - Animation cho Chapter 34
// Visualization: Waves flow silently in all directions, achieving greatness without recognition

import animationUtils from './animation-utils.js';

const chapter34Animation = {
  settings: {
    backgroundColor: '#F0EEE6',
    waveColor: 'rgba(51, 51, 51, 0.6)',
    waveColorSoft: 'rgba(51, 51, 51, 0.3)',
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const canvas = animationUtils.createSquareCanvas(container);
    const ctx = canvas.getContext('2d');
    const width = this.settings.width;
    const height = this.settings.height;
    let t = 0;
    let animationFrameId;

    // Vẽ sóng ngang hoặc dọc với phase distortion
    function drawWave(yCenter, amplitude, frequency, phaseOffset, thickness) {
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const distortion =
          Math.sin(x * 0.02 + t * 0.05) * 2 +
          Math.cos(x * 0.01 - t * 0.03) * 3;
        const y = yCenter + amplitude * Math.sin(x * frequency + t + phaseOffset + distortion);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.lineWidth = thickness;
      ctx.stroke();
    }

    function render() {
      ctx.fillStyle = chapter34Animation.settings.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = chapter34Animation.settings.waveColor;
      // Vẽ các sóng ngang
      const waveCount = 15;
      for (let i = 0; i < waveCount; i++) {
        const yCenter = 100 + (height - 200) * (i / (waveCount - 1));
        const amplitude = 10 + Math.sin(t * 0.025 + i * 0.3) * 5;
        const frequency = 0.02 + 0.01 * Math.sin(i * 0.2);
        const phaseOffset = i * 0.3;
        const thickness = 1 + Math.sin(t + i) * 0.5;
        drawWave(yCenter, amplitude, frequency, phaseOffset, thickness);
      }
      // Vẽ các sóng dọc (xoay canvas)
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = chapter34Animation.settings.waveColorSoft;
      for (let i = 0; i < waveCount; i++) {
        const xCenter = 100 + (width - 200) * (i / (waveCount - 1));
        const amplitude = 15 + Math.cos(t * 0.04 + i * 0.3) * 8;
        const frequency = 0.02 + 0.01 * Math.cos(i * 0.3);
        const phaseOffset = i * 0.4;
        const thickness = 1 + Math.cos(t + i) * 0.5;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-width / 2, -height / 2);
        drawWave(xCenter, amplitude, frequency, phaseOffset, thickness);
        ctx.restore();
      }
      ctx.globalCompositeOperation = 'source-over';
      t += 0.004;
      animationFrameId = requestAnimationFrame(render);
    }

    render();
    animationUtils.fadeOutLoader(container);
    // Cleanup function
    return function cleanup() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    };
  }
};

export default chapter34Animation;
