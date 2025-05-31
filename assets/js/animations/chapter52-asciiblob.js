// Animation for Chapter 52: ASCII Blob
// Visualization: A pulsing ASCII form that emerges from and returns to emptiness, showing the cycle of manifestation
import animationUtils from './animation-utils.js';

const CANVAS_WIDTH = 60;
const CANVAS_HEIGHT = 30;
const BG_COLOR = '#F0EEE6';
const CHAR_SET = '░▒▓█';
const FPS = 10;

const asciiBlobAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Create pre/code element for ASCII art
    const pre = document.createElement('pre');
    pre.style.fontFamily = 'monospace, monospace';
    pre.style.fontSize = '12px';
    pre.style.lineHeight = '1.1';
    pre.style.textAlign = 'center';
    pre.style.background = BG_COLOR;
    pre.style.margin = '0 auto';
    pre.style.padding = '0';
    pre.style.display = 'block';
    pre.style.userSelect = 'none';
    pre.style.width = '100%';
    pre.style.maxWidth = '100%';
    pre.style.overflow = 'hidden';
    container.appendChild(pre);

    let frame = 60; // Starting frame (same as raw animation)
    let density = 0;
    let animationId = null;
    let running = true;
    let lastFrameTime = 0;
    const frameInterval = 1000 / FPS;

    function generateArt() {
      let art = '';
      for (let y = 0; y < CANVAS_HEIGHT; y++) {
        let row = '';
        for (let x = 0; x < CANVAS_WIDTH; x++) {
          const centerX = CANVAS_WIDTH / 2;
          const centerY = CANVAS_HEIGHT / 2;
          const dx = (x - centerX) / centerX;
          const dy = (y - centerY) / centerY;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          
          // Matching the exact values from the raw animation
          let noiseValue = Math.sin(distFromCenter * 3 - frame * 0.002);
          noiseValue += Math.cos(x * 0.1 - y * 0.1 + frame * 0.0008) * 0.3;
          noiseValue = (noiseValue + 1) / 2;
          noiseValue = noiseValue * (density / 100);
          
          const charIndex = Math.floor(noiseValue * CHAR_SET.length);
          let char = CHAR_SET[Math.min(Math.max(0, charIndex), CHAR_SET.length - 1)];
          if (density < 30 && Math.random() > density / 30) {
            char = ' ';
          }
          row += char;
        }
        art += row + '\n';
      }
      return art;
    }

    function animate(currentTime) {
      if (!running) return;
      animationId = requestAnimationFrame(animate);
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTime - remainder;
        frame++;
        // Matching the exact density calculation from raw animation
        density = 27.5 + 22.5 * Math.sin(frame * 0.002);
        pre.textContent = generateArt();
      }
    }

    animationId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);

    // Responsive: adjust font size on resize
    function handleResize() {
      const containerWidth = container.clientWidth;
      // Adjust font size based on container width
      if (containerWidth < 400) {
        pre.style.fontSize = '10px';
      } else if (containerWidth < 600) {
        pre.style.fontSize = '12px';
      } else {
        pre.style.fontSize = '14px';
      }
    }
    
    // Initial size adjustment
    handleResize();
    window.addEventListener('resize', handleResize);

    return {
      cleanup: () => {
        running = false;
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (container && pre) container.removeChild(pre);
      }
    };
  }
};

export default asciiBlobAnimation;
