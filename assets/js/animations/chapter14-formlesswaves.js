// chapter14-formlesswaves.js - Animation cho chương 14: Formless Waves
import animationUtils from './animation-utils.js';

const chapter14FormlessWaves = {
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

    // Parameters
    const layers = 80;
    const points = 200;
    const waveAmplitude = 40;
    let time = 0;
    let animationId = null;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      time += 0.01;
      // Draw each layer - forms emerging from the formless
      for (let layer = 0; layer < layers; layer++) {
        const layerPosition = (layer / layers) * height * 0.8 + height * 0.1;
        const layerFrequency = 0.5 + layer * 0.03;
        const layerPhase = time * 0.2 + layer * 0.05;
        const layerAmplitude = waveAmplitude * (0.5 + 0.5 * Math.sin(layer * 0.1 + time * 0.3));
        // Set opacity based on layer position and time
        const baseOpacity = 0.2 + 0.6 * Math.pow(Math.sin((layer / layers) * Math.PI), 2);
        const timeEffect = 0.2 * Math.sin(time * 0.4 + layer * 0.1);
        const opacity = Math.min(0.9, Math.max(0.1, baseOpacity + timeEffect));
        ctx.beginPath();
        ctx.strokeStyle = `rgba(50, 50, 50, ${opacity})`;
        ctx.lineWidth = 0.6;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * width;
          let y = layerPosition;
          y += layerAmplitude * Math.sin(x * 0.01 * layerFrequency + layerPhase);
          y += layerAmplitude * 0.3 * Math.sin(x * 0.02 * layerFrequency + layerPhase * 1.5);
          y += layerAmplitude * 0.2 * Math.sin(x * 0.04 * layerFrequency - layerPhase * 0.7);
          y += layerAmplitude * 0.1 * Math.sin(x * 0.08 * layerFrequency + layerPhase * 2.3);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      // Draw connecting lines - all merging into oneness
      for (let i = 0; i < width; i += 20) {
        if (Math.random() < 0.4) {
          ctx.beginPath();
          const opacity = 0.1 + 0.2 * Math.sin(i * 0.05 + time);
          ctx.strokeStyle = `rgba(50, 50, 50, ${opacity})`;
          ctx.lineWidth = 0.3;
          const startY = height * 0.1 + Math.random() * height * 0.2;
          const endY = height * 0.7 + Math.random() * height * 0.2;
          ctx.moveTo(i, startY);
          ctx.lineTo(i, endY);
          ctx.stroke();
        }
      }
      animationId = requestAnimationFrame(draw);
    }
    animationId = requestAnimationFrame(draw);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (canvas && ctx) {
          ctx.clearRect(0, 0, width, height);
        }
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter14FormlessWaves;
