// Animation for Chapter 66: Wave Interference Optimized
// Visualization: Waves that influence each other without domination, showing how strength emerges from yielding

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const WaveInterferenceOptimizedAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = BG_COLOR;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = CANVAS_SIZE + 'px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Create canvas
    let canvas = container.querySelector('canvas.wave-interference-optimized-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'wave-interference-optimized-canvas';
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      container.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d', { alpha: false });
    const width = canvas.width;
    const height = canvas.height;

    // Parameters
    const resolution = 5;
    const rows = Math.floor(height / resolution);
    const cols = Math.floor(width / resolution);
    const sources = [
      { x: width/2, y: height/2, wavelength: 60, phase: 0, amplitude: 1.5 },
    ];
    const numRadialSources = 6;
    const radius = 150;
    for (let i = 0; i < numRadialSources; i++) {
      const angle = (i / numRadialSources) * Math.PI * 2;
      sources.push({
        x: width/2 + Math.cos(angle) * radius,
        y: height/2 + Math.sin(angle) * radius,
        wavelength: 50,
        phase: angle,
        amplitude: 0.8
      });
    }
    let time = 0;
    const field = new Float32Array(rows * cols);
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const bufferCtx = bufferCanvas.getContext('2d', { alpha: false });
    let running = true;
    let animationFrameId = null;

    function cleanup() {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, width, height);
      if (bufferCtx) bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
      bufferCanvas.width = 0;
      bufferCanvas.height = 0;
      field.fill(0);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function animate() {
      if (!running) return;
      // Clear buffer
      bufferCtx.fillStyle = BG_COLOR;
      bufferCtx.fillRect(0, 0, width, height);
      // Calculate interference pattern
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * resolution;
          const y = i * resolution;
          let amplitude = 0;
          for (let s = 0; s < sources.length; s++) {
            const source = sources[s];
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const falloff = Math.max(0, 1 - distance / 400);
            amplitude += source.amplitude * falloff * Math.sin((distance / source.wavelength - time) * 2 * Math.PI + source.phase);
          }
          field[i * cols + j] = amplitude;
        }
      }
      // Draw contours
      bufferCtx.strokeStyle = '#333';
      bufferCtx.lineWidth = 1;
      bufferCtx.beginPath();
      const level = 0;
      for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const idx = i * cols + j;
          const x = j * resolution;
          const y = i * resolution;
          const v00 = field[idx] > level;
          const v10 = field[idx + 1] > level;
          const v11 = field[idx + cols + 1] > level;
          const v01 = field[idx + cols] > level;
          if (v00 && !v10) {
            bufferCtx.moveTo(x + resolution / 2, y);
            bufferCtx.lineTo(x + resolution, y + resolution / 2);
          }
          if (v10 && !v11) {
            bufferCtx.moveTo(x + resolution, y + resolution / 2);
            bufferCtx.lineTo(x + resolution / 2, y + resolution);
          }
          if (v11 && !v01) {
            bufferCtx.moveTo(x + resolution / 2, y + resolution);
            bufferCtx.lineTo(x, y + resolution / 2);
          }
          if (v01 && !v00) {
            bufferCtx.moveTo(x, y + resolution / 2);
            bufferCtx.lineTo(x + resolution / 2, y);
          }
        }
      }
      bufferCtx.stroke();
      ctx.drawImage(bufferCanvas, 0, 0);
      time += 0.000625;
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup
    };
  }
};

export default WaveInterferenceOptimizedAnimation;
