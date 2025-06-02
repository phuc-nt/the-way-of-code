// Animation for Chapter 61: Flowing Lattice
// Visualization: A lattice that moves like water, showing how structure and flow can coexist

import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;

const FlowingLatticeAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = animationUtils.colors.background;
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
    let canvas = container.querySelector('canvas.flowing-lattice-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'flowing-lattice-canvas';
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      container.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Parameters
    const GRID_SIZE = 8;
    const CELL_SIZE = 16;
    const SPACING = CELL_SIZE * 1.8;
    const HEX_HEIGHT = Math.sqrt(3) * CELL_SIZE;
    const cells = [];
    for (let row = -GRID_SIZE; row <= GRID_SIZE; row++) {
      const isEvenRow = row % 2 === 0;
      const colOffset = isEvenRow ? 0 : SPACING / 2;
      for (let col = -GRID_SIZE; col <= GRID_SIZE; col++) {
        const x = width / 2 + col * SPACING + colOffset;
        const y = height / 2 + row * HEX_HEIGHT * 0.75;
        const phase = (row + col) * 0.2;
        cells.push({ x, y, phase });
      }
    }

    let time = 0;
    let animationFrameId = null;
    let running = true;

    function drawHexagon(x, y, size, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const radius = size;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    function animate() {
      if (!running) return;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      time += 0.008;
      const globalRotation = Math.sin(time * 0.1) * 0.15;
      cells.forEach(cell => {
        const dx = cell.x - width / 2;
        const dy = cell.y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(time * 1 + cell.phase + distance * 0.06);
        const scale = 0.8 + wave * 0.25;
        const rotation = wave * 0.25 + globalRotation;
        drawHexagon(cell.x, cell.y, CELL_SIZE * scale, rotation);
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup: () => {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx) ctx.clearRect(0, 0, width, height);
        cells.length = 0;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }
};

export default FlowingLatticeAnimation;
