// Animation for Chapter 59: Implicit Dreams
// Visualization: Forms that emerge from simple mathematical rules, showing how complexity arises from fundamental principles

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const ImplicitDreamsAnimation = {
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
    let canvas = container.querySelector('canvas.implicit-dreams-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'implicit-dreams-canvas';
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
    const centerX = width / 2;
    const centerY = height / 2;

    // Parameters
    let time = 0;
    const scale = 120;
    const resolution = 40;
    const cellSize = 8;
    const gridPoints = [];
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        gridPoints.push({
          i,
          j,
          x: (i - resolution/2) * cellSize,
          y: (j - resolution/2) * cellSize,
          value: 0,
          flowOffset: Math.random() * Math.PI * 2
        });
      }
    }

    // Implicit function
    function evaluateImplicitFunction(x, y, t) {
      const nx = x / scale;
      const ny = y / scale;
      let value = nx*nx + ny*ny - 1;
      const morphFactor = Math.sin(t * 0.1) * 0.5 + 0.5;
      const shape1 = nx*nx + ny*ny * (1.2 + 0.3 * Math.sin(t * 0.15)) - 1;
      const angle = Math.atan2(ny, nx);
      const r = Math.sqrt(nx*nx + ny*ny);
      const shape2 = r * (1 + 0.3 * Math.sin(angle * 2 + t * 0.1)) - 1;
      value = shape1 * (1 - morphFactor) + shape2 * morphFactor;
      value += 0.2 * Math.sin(nx * 3 + t * 0.1) * Math.sin(ny * 3 + t * 0.15);
      value += 0.1 * Math.sin(nx * 5 + ny * 5 + t * 0.05);
      value -= 0.4 * Math.exp(-(nx - 0.5) * (nx - 0.5) * 4 - ny * ny * 4) * Math.sin(t * 0.15);
      return value;
    }

    function updateGridValues(t) {
      gridPoints.forEach(point => {
        point.value = evaluateImplicitFunction(point.x, point.y, t);
      });
    }

    function generateContours() {
      const contourLines = [];
      const thresholds = Array(10).fill().map((_, i) => -0.5 + i * 0.1);
      for (let i = 0; i < resolution - 1; i++) {
        for (let j = 0; j < resolution - 1; j++) {
          const index = i * resolution + j;
          const topLeft = gridPoints[index];
          const topRight = gridPoints[index + 1];
          const bottomLeft = gridPoints[index + resolution];
          const bottomRight = gridPoints[index + resolution + 1];
          if (!topLeft || !topRight || !bottomLeft || !bottomRight) continue;
          thresholds.forEach(threshold => {
            const points = [];
            // Top edge
            if ((topLeft.value < threshold && topRight.value >= threshold) || (topLeft.value >= threshold && topRight.value < threshold)) {
              const t = (threshold - topLeft.value) / (topRight.value - topLeft.value);
              points.push({
                x: topLeft.x + t * (topRight.x - topLeft.x),
                y: topLeft.y,
                flowOffset: (topLeft.flowOffset + topRight.flowOffset) / 2
              });
            }
            // Right edge
            if ((topRight.value < threshold && bottomRight.value >= threshold) || (topRight.value >= threshold && bottomRight.value < threshold)) {
              const t = (threshold - topRight.value) / (bottomRight.value - topRight.value);
              points.push({
                x: topRight.x,
                y: topRight.y + t * (bottomRight.y - topRight.y),
                flowOffset: (topRight.flowOffset + bottomRight.flowOffset) / 2
              });
            }
            // Bottom edge
            if ((bottomLeft.value < threshold && bottomRight.value >= threshold) || (bottomLeft.value >= threshold && bottomRight.value < threshold)) {
              const t = (threshold - bottomLeft.value) / (bottomRight.value - bottomLeft.value);
              points.push({
                x: bottomLeft.x + t * (bottomRight.x - bottomLeft.x),
                y: bottomLeft.y,
                flowOffset: (bottomLeft.flowOffset + bottomRight.flowOffset) / 2
              });
            }
            // Left edge
            if ((topLeft.value < threshold && bottomLeft.value >= threshold) || (topLeft.value >= threshold && bottomLeft.value < threshold)) {
              const t = (threshold - topLeft.value) / (bottomLeft.value - topLeft.value);
              points.push({
                x: topLeft.x,
                y: topLeft.y + t * (bottomLeft.y - topLeft.y),
                flowOffset: (topLeft.flowOffset + bottomLeft.flowOffset) / 2
              });
            }
            if (points.length === 2) {
              contourLines.push({
                x1: points[0].x,
                y1: points[0].y,
                x2: points[1].x,
                y2: points[1].y,
                threshold: threshold,
                flowOffset1: points[0].flowOffset,
                flowOffset2: points[1].flowOffset
              });
            }
          });
        }
      }
      return contourLines;
    }

    function drawContours(contourLines, t) {
      contourLines.forEach(line => {
        const alpha = 0.2 + 0.6 * Math.abs(line.threshold);
        const width = 0.5 + Math.abs(line.threshold) * 0.5;
        ctx.strokeStyle = `rgba(51, 51, 51, ${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        const numSegments = 20;
        const startX = line.x1;
        const startY = line.y1;
        const endX = line.x2;
        const endY = line.y2;
        ctx.moveTo(centerX + startX, centerY + startY);
        for (let i = 1; i <= numSegments; i++) {
          const progress = i / numSegments;
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;
          const flowSpeed = 0.5 + 0.5 * Math.sin(line.threshold * 10);
          const flowOffset = line.flowOffset1 + (line.flowOffset2 - line.flowOffset1) * progress;
          const waveAmplitude = 3 * Math.sin(line.threshold * 5 + t * 0.2);
          const dx = endX - startX;
          const dy = endY - startY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const perpX = -dy / len;
          const perpY = dx / len;
          const waveX = perpX * waveAmplitude * Math.sin(progress * Math.PI * 2 + t * flowSpeed + flowOffset);
          const waveY = perpY * waveAmplitude * Math.sin(progress * Math.PI * 2 + t * flowSpeed + flowOffset);
          ctx.lineTo(centerX + x + waveX, centerY + y + waveY);
        }
        ctx.stroke();
      });
    }

    let animationFrameId = null;
    let running = true;
    function animate() {
      if (!running) return;
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);
      time += 0.005;
      updateGridValues(time);
      const contourLines = generateContours();
      drawContours(contourLines, time);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup: () => {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx) ctx.clearRect(0, 0, width, height);
        gridPoints.length = 0;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }
};

export default ImplicitDreamsAnimation;
