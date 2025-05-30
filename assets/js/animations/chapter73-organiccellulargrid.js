// chapter73-organiccellulargrid.js - Organic Cellular Grid animation for Chapter 73
// Themes: true courage, nature's wisdom, universal net
// Visualization: A grid that moves with careful balance, showing how strength emerges through wise restraint

function createOrganicCellularGridAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  let cellSize = 50;
  let width = 550, height = 550;
  let cellsX, cellsY;

  function handleResize() {
    if (!container) return;
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    cellsX = Math.ceil(width / cellSize) + 2;
    cellsY = Math.ceil(height / cellSize) + 2;
  }

  function drawCell(x, y, seed) {
    const noise1 = Math.sin(seed * 1.3 + time * 0.25) * 0.2;
    const noise2 = Math.cos(seed * 0.7 + time * 0.15) * 0.2;
    const w = cellSize + noise1 * cellSize * 0.4;
    const h = cellSize + noise2 * cellSize * 0.4;
    const corner1 = {
      x: x + Math.sin(seed + time) * cellSize * 0.2,
      y: y + Math.cos(seed + time) * cellSize * 0.2
    };
    const corner2 = {
      x: x + w + Math.sin(seed + 1 + time) * cellSize * 0.2,
      y: y + Math.cos(seed + 1 + time) * cellSize * 0.2
    };
    const corner3 = {
      x: x + w + Math.sin(seed + 2 + time) * cellSize * 0.2,
      y: y + h + Math.cos(seed + 2 + time) * cellSize * 0.2
    };
    const corner4 = {
      x: x + Math.sin(seed + 3 + time) * cellSize * 0.2,
      y: y + h + Math.cos(seed + 3 + time) * cellSize * 0.2
    };
    const roundness = Math.sin(seed + time * 0.5) * cellSize * 0.15 + cellSize * 0.3;
    ctx.beginPath();
    ctx.moveTo(corner1.x + roundness, corner1.y);
    ctx.lineTo(corner2.x - roundness, corner2.y);
    ctx.quadraticCurveTo(corner2.x, corner2.y, corner2.x, corner2.y + roundness);
    ctx.lineTo(corner3.x, corner3.y - roundness);
    ctx.quadraticCurveTo(corner3.x, corner3.y, corner3.x - roundness, corner3.y);
    ctx.lineTo(corner4.x + roundness, corner4.y);
    ctx.quadraticCurveTo(corner4.x, corner4.y, corner4.x, corner4.y - roundness);
    ctx.lineTo(corner1.x, corner1.y + roundness);
    ctx.quadraticCurveTo(corner1.x, corner1.y, corner1.x + roundness, corner1.y);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function draw() {
    ctx.fillStyle = '#F0EEE6';
    ctx.fillRect(0, 0, width, height);
    // Animate grid
    for (let i = -1; i < cellsX - 1; i++) {
      for (let j = -1; j < cellsY - 1; j++) {
        const baseX = i * cellSize - cellSize / 2;
        const baseY = j * cellSize - cellSize / 2;
        const offsetX = Math.sin(i * 0.5 + time * 0.5) * cellSize * 0.2;
        const offsetY = Math.cos(j * 0.5 + time * 0.5) * cellSize * 0.2;
        drawCell(baseX + offsetX, baseY + offsetY, i + j * cellsX + time);
      }
    }
  }

  function animate() {
    draw();
    time += 0.0025;
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');
  handleResize();
  window.addEventListener('resize', handleResize);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const OrganicCellularGridAnimation = {
  init: createOrganicCellularGridAnimation
};

export default OrganicCellularGridAnimation;
