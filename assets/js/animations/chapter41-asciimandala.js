// Animation for Chapter 41: Animated ASCII Mandala (module hóa)
import animationUtils from './animation-utils.js';
// Visualization: An ASCII mandala that reveals complex patterns through simple characters

const ASCII_MANDALA_WIDTH = 80;
const ASCII_MANDALA_HEIGHT = 44;
const ASCII_MANDALA_DENSITY = '.·•○●';

const asciiMandalaAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Create pre/code container
    const pre = document.createElement('pre');
    pre.style.fontFamily = 'monospace';
    pre.style.fontSize = '12px';
    pre.style.lineHeight = '1.2em';
    pre.style.letterSpacing = '0.1em';
    pre.style.textAlign = 'center';
    pre.style.color = '#333';
    pre.style.margin = '0';
    pre.style.display = 'flex';
    pre.style.flexDirection = 'column';
    pre.style.justifyContent = 'center';
    pre.style.alignItems = 'center';
    pre.style.width = '100%';
    pre.style.maxWidth = '550px';
    pre.style.height = '550px';
    pre.style.background = animationUtils.colors.background;
    pre.style.padding = '10px';
    pre.style.borderRadius = '8px';
    pre.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.05)';
    pre.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.style.overflow = 'hidden';
    container.appendChild(pre);

    let running = true;
    let frame = 0;
    let animationFrameId = null;

    function getCharForIntensity(intensity, isCenter = false) {
      if (intensity < 0.1) return ' ';
      if (isCenter) {
        const index = Math.min(Math.floor(intensity * ASCII_MANDALA_DENSITY.length), ASCII_MANDALA_DENSITY.length - 1);
        return ASCII_MANDALA_DENSITY[Math.max(index, 2)];
      } else {
        const index = Math.min(Math.floor(intensity * ASCII_MANDALA_DENSITY.length), ASCII_MANDALA_DENSITY.length - 1);
        return ASCII_MANDALA_DENSITY[index];
      }
    }

    function drawCirclePattern(grid, centerX, centerY, frame) {
      const centerIntensity = (Math.sin(frame * 0.025) + 1) / 2;
      grid[centerY][centerX] = getCharForIntensity(centerIntensity, true);
      for (let r = 0; r < 3; r++) {
        const radius = 2 + r * 2;
        const points = 8 + r * 4;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const breathingFactor = 0.2 * Math.sin(frame * 0.025 + r + i * 0.1);
          const x = Math.round(centerX + Math.cos(angle) * (radius + breathingFactor));
          const y = Math.round(centerY + Math.sin(angle) * (radius + breathingFactor));
          if (x >= 0 && x < ASCII_MANDALA_WIDTH && y >= 0 && y < ASCII_MANDALA_HEIGHT) {
            const intensityPhase = (Math.sin(frame * 0.02 + r * 0.3 + i * 0.2) + 1) / 2;
            grid[y][x] = getCharForIntensity(intensityPhase, true);
          }
        }
      }
    }

    function drawMandala(grid, frame) {
      const centerX = Math.floor(ASCII_MANDALA_WIDTH / 2);
      const centerY = Math.floor(ASCII_MANDALA_HEIGHT / 2);
      for (let y = 1; y < ASCII_MANDALA_HEIGHT - 1; y++) {
        const lineOpacity = 0.3 + Math.sin(frame * 0.005 + y * 0.1) * 0.1;
        if (lineOpacity > 0.2) {
          grid[y][centerX] = '|';
        }
      }
      drawCirclePattern(grid, centerX, centerY, frame);
      const numPatterns = 6;
      for (let i = 0; i < numPatterns; i++) {
        const radius = 5 + i * 3;
        const points = 6 + i * 2;
        for (let j = 0; j < points; j++) {
          const angle = (j / points) * Math.PI * 2;
          const breathingFactor = 0.2 * Math.sin(frame * 0.025 + i * 0.5 + j * 0.2);
          const x = Math.round(centerX + Math.cos(angle) * (radius + breathingFactor * radius));
          const y = Math.round(centerY + Math.sin(angle) * (radius + breathingFactor * radius));
          if (x >= 0 && x < ASCII_MANDALA_WIDTH && y >= 0 && y < ASCII_MANDALA_HEIGHT) {
            const intensityPhase = (Math.sin(frame * 0.015 + i * 0.4 + j * 0.8) + 1) / 2;
            const char = getCharForIntensity(intensityPhase);
            grid[y][x] = char;
            const mirrorX = 2 * centerX - x;
            if (mirrorX >= 0 && mirrorX < ASCII_MANDALA_WIDTH) {
              grid[y][mirrorX] = char;
            }
          }
          if (i > 0 && j % 2 === 0) {
            const secondaryRadius = radius * 0.7;
            const x2 = Math.round(centerX + Math.cos(angle + 0.2) * secondaryRadius);
            const y2 = Math.round(centerY + Math.sin(angle + 0.2) * secondaryRadius);
            if (x2 >= 0 && x2 < ASCII_MANDALA_WIDTH && y2 >= 0 && y2 < ASCII_MANDALA_HEIGHT) {
              const intensityPhase = (Math.sin(frame * 0.025 + i * 0.3 + j) + 1) / 2;
              const char = getCharForIntensity(intensityPhase * 0.8);
              grid[y2][x2] = char;
              const mirrorX2 = 2 * centerX - x2;
              if (mirrorX2 >= 0 && mirrorX2 < ASCII_MANDALA_WIDTH) {
                grid[y2][mirrorX2] = char;
              }
            }
          }
        }
      }
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI;
        const radius = 10 + i % 5 * 3;
        const x = Math.round(centerX + Math.cos(angle) * radius);
        const y = Math.round(centerY + Math.sin(angle) * radius);
        if (x >= 0 && x < ASCII_MANDALA_WIDTH && y >= 0 && y < ASCII_MANDALA_HEIGHT) {
          if (grid[y][x] === ' ') {
            const intensityPhase = (Math.sin(frame * 0.02 + i * 0.2) + 1) / 3;
            const char = getCharForIntensity(intensityPhase);
            if (char !== ' ') {
              grid[y][x] = char;
              const mirrorX = 2 * centerX - x;
              if (mirrorX >= 0 && mirrorX < ASCII_MANDALA_WIDTH && grid[y][mirrorX] === ' ') {
                grid[y][mirrorX] = char;
              }
            }
          }
        }
      }
    }

    function renderGrid(grid) {
      let html = '';
      for (let i = 0; i < grid.length; i++) {
        html += '<div style="line-height:1.2em;white-space:nowrap;">';
        for (let j = 0; j < grid[i].length; j++) {
          const char = grid[i][j];
          let opacity = 1.0;
          switch (char) {
            case '●': opacity = 0.9; break;
            case '○': opacity = 0.7; break;
            case '•': opacity = 0.6; break;
            case '·': opacity = 0.5; break;
            case '.': opacity = 0.4; break;
            case '|': opacity = 0.3; break;
            case ' ': opacity = 0; break;
          }
          html += `<span style="color:rgba(50,50,50,${opacity});display:inline-block;width:0.6em;">${char}</span>`;
        }
        html += '</div>';
      }
      return html;
    }

    function animate() {
      if (!running) return;
      const grid = Array(ASCII_MANDALA_HEIGHT).fill().map(() => Array(ASCII_MANDALA_WIDTH).fill(' '));
      drawMandala(grid, frame);
      pre.innerHTML = renderGrid(grid);
      frame++;
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup function
    return {
      cleanup() {
        running = false;
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        if (pre.parentNode) pre.parentNode.removeChild(pre);
        // Show loader again if needed
        const loader = container.querySelector('.animation-loader');
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default asciiMandalaAnimation;
