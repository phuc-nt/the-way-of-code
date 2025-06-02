// chapter37-waveinterferencev5.js - Animation cho Chapter 37
// Visualization: Waves emerge naturally from an unmoving center, finding peace in their flow

import animationUtils from './animation-utils.js';

const chapter37Animation = {
  settings: {
    backgroundColor: animationUtils.colors.background,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const canvas = animationUtils.createSquareCanvas(container);
    const ctx = canvas.getContext('2d');
    const width = this.settings.width;
    const height = this.settings.height;
    // Radial arrangement with central focus
    const sources = [];
    const numRings = 2;
    const sourcesPerRing = 6;
    sources.push({
      x: width/2,
      y: height/2,
      wavelength: 25,
      phase: 0,
      amplitude: 1.5
    });
    for (let ring = 1; ring <= numRings; ring++) {
      const radius = ring * 120;
      const numSources = sourcesPerRing;
      for (let i = 0; i < numSources; i++) {
        const angle = (i / numSources) * Math.PI * 2;
        sources.push({
          x: width/2 + Math.cos(angle) * radius,
          y: height/2 + Math.sin(angle) * radius,
          wavelength: 20 + ring * 5,
          phase: (i / numSources) * Math.PI,
          amplitude: 1.0 - ring * 0.2
        });
      }
    }
    let time = 0;
    let animationFrameId;
    const TWO_PI = Math.PI * 2;
    const INV_300 = 1 / 300;
    let frameCount = 0;
    const skipFrames = 1;
    function animate() {
      frameCount++;
      if (frameCount % (skipFrames + 1) !== 0) {
        time += 0.0015;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      ctx.fillStyle = chapter37Animation.settings.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      const resolution = 3;
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
            const dist2 = dx * dx + dy * dy;
            const distance = Math.sqrt(dist2);
            if (distance > 400) return;
            const falloff = Math.exp(-distance * INV_300);
            amplitude += source.amplitude * falloff * Math.sin((distance / source.wavelength - time) * TWO_PI + source.phase);
          });
          field[i][j] = amplitude;
        }
      }
      ctx.strokeStyle = '#333';
      const contourLevels = [-0.8, -0.4, 0, 0.4, 0.8];
      contourLevels.forEach((level, index) => {
        ctx.lineWidth = index % 2 === 0 ? 0.8 : 0.5;
        ctx.beginPath();
        for (let i = 0; i < rows - 1; i++) {
          for (let j = 0; j < cols - 1; j++) {
            const x = j * resolution;
            const y = i * resolution;
            const v00 = field[i][j];
            const v10 = field[i][j + 1];
            const v11 = field[i + 1][j + 1];
            const v01 = field[i + 1][j];
            const allAbove = v00 > level && v10 > level && v11 > level && v01 > level;
            const allBelow = v00 <= level && v10 <= level && v11 <= level && v01 <= level;
            if (allAbove || allBelow) continue;
            const case4 = (v00 > level ? 8 : 0) + (v10 > level ? 4 : 0) + (v11 > level ? 2 : 0) + (v01 > level ? 1 : 0);
            const lerp = (a, b, t) => a + t * (b - a);
            const safeDiv = (a, b) => b === 0 ? 0 : a / b;
            switch (case4) {
              case 1: case 14: {
                const t1 = safeDiv(level - v00, v01 - v00);
                const t2 = safeDiv(level - v01, v11 - v01);
                ctx.moveTo(x, lerp(y, y + resolution, t1));
                ctx.lineTo(lerp(x, x + resolution, t2), y + resolution);
                break;
              }
              case 2: case 13: {
                const t1 = safeDiv(level - v01, v11 - v01);
                const t2 = safeDiv(level - v11, v10 - v11);
                ctx.moveTo(lerp(x, x + resolution, t1), y + resolution);
                ctx.lineTo(x + resolution, lerp(y + resolution, y, t2));
                break;
              }
              case 3: case 12: {
                const t1 = safeDiv(level - v00, v01 - v00);
                const t2 = safeDiv(level - v10, v11 - v10);
                ctx.moveTo(x, lerp(y, y + resolution, t1));
                ctx.lineTo(x + resolution, lerp(y, y + resolution, t2));
                break;
              }
              case 4: case 11: {
                const t1 = safeDiv(level - v10, v11 - v10);
                const t2 = safeDiv(level - v10, v00 - v10);
                ctx.moveTo(x + resolution, lerp(y, y + resolution, t1));
                ctx.lineTo(lerp(x + resolution, x, t2), y);
                break;
              }
              case 5: case 10: {
                const t1 = safeDiv(level - v00, v01 - v00);
                const t2 = safeDiv(level - v00, v10 - v00);
                ctx.moveTo(x, lerp(y, y + resolution, t1));
                ctx.lineTo(lerp(x, x + resolution, t2), y);
                const t3 = safeDiv(level - v11, v10 - v11);
                const t4 = safeDiv(level - v11, v01 - v11);
                ctx.moveTo(x + resolution, lerp(y + resolution, y, t3));
                ctx.lineTo(lerp(x + resolution, x, t4), y + resolution);
                break;
              }
              case 6: case 9: {
                const t1 = safeDiv(level - v10, v00 - v10);
                const t2 = safeDiv(level - v11, v01 - v11);
                ctx.moveTo(lerp(x + resolution, x, t1), y);
                ctx.lineTo(lerp(x + resolution, x, t2), y + resolution);
                break;
              }
              case 7: case 8: {
                const t1 = safeDiv(level - v00, v01 - v00);
                const t2 = safeDiv(level - v00, v10 - v00);
                ctx.moveTo(x, lerp(y, y + resolution, t1));
                ctx.lineTo(lerp(x, x + resolution, t2), y);
                break;
              }
            }
          }
        }
        ctx.stroke();
      });
      time += 0.0015;
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    animationUtils.fadeOutLoader(container);
    // Cleanup
    return function cleanup() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      sources.length = 0;
    };
  }
};

export default chapter37Animation;
