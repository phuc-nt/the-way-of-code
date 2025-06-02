// Animation for Chapter 40: Torus Energy Flow (Canvas)
// Visualization: Energy flows in eternal cycles, yielding and returning to its source

import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const MAJOR_RADIUS = 120;
const TUBE_RADIUS = 100;
const MAJOR_SEGMENTS = 50;
const MINOR_SEGMENTS = 30;
const POLOIDAL_LINES = 8;
const TOROIDAL_LINES = 6;
const LINE_POINTS = 100;
const TWO_PI = Math.PI * 2;

// Đối tượng animation tuân thủ chuẩn của animation manager
const torusEnergyFlowAnimation = {
  init(container) {
    if (!container) return null;
    
    // Xóa loader hiển thị
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';
  // Create and style canvas
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  canvas.style.display = 'block';
  canvas.style.background = animationUtils.colors.background;
  canvas.style.margin = '0 auto';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.background = animationUtils.colors.background;
  container.style.overflow = 'hidden';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: false });
  let animationFrameId = null;
  let running = true;

  // Fast trig lookup tables
  const tableSize = 628;
  const sinTable = new Float32Array(tableSize);
  const cosTable = new Float32Array(tableSize);
  for (let i = 0; i < tableSize; i++) {
    const angle = (i / 100);
    sinTable[i] = Math.sin(angle);
    cosTable[i] = Math.cos(angle);
  }
  function fastSin(angle) {
    const index = Math.floor((angle % TWO_PI) * 100) % 628;
    return sinTable[index];
  }
  function fastCos(angle) {
    const index = Math.floor((angle % TWO_PI) * 100) % 628;
    return cosTable[index];
  }

  // Node and flow line data
  const nodeCount = MAJOR_SEGMENTS * MINOR_SEGMENTS;
  const nodes = {
    positions: new Float32Array(nodeCount * 3),
    original: new Float32Array(nodeCount * 3),
    velocity: new Float32Array(nodeCount * 3),
    params: new Float32Array(nodeCount * 3),
    dispersing: new Uint8Array(nodeCount)
  };
  let idx = 0;
  for (let i = 0; i < MAJOR_SEGMENTS; i++) {
    const u = (i / MAJOR_SEGMENTS) * TWO_PI;
    for (let j = 0; j < MINOR_SEGMENTS; j++) {
      const v = (j / MINOR_SEGMENTS) * TWO_PI;
      const x = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastCos(u);
      const y = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastSin(u);
      const z = TUBE_RADIUS * fastSin(v);
      const posOffset = idx * 3;
      nodes.positions[posOffset] = x;
      nodes.positions[posOffset + 1] = y;
      nodes.positions[posOffset + 2] = z;
      nodes.original[posOffset] = x;
      nodes.original[posOffset + 1] = y;
      nodes.original[posOffset + 2] = z;
      nodes.params[posOffset] = u;
      nodes.params[posOffset + 1] = v;
      nodes.params[posOffset + 2] = 0;
      idx++;
    }
  }

  // Flow lines
  const totalLines = POLOIDAL_LINES + TOROIDAL_LINES;
  const pointsPerLine = LINE_POINTS + 1;
  const flowLines = {
    points: new Float32Array(totalLines * pointsPerLine * 3),
    progress: new Float32Array(totalLines * pointsPerLine),
    metadata: []
  };
  let lineIdx = 0;
  for (let i = 0; i < POLOIDAL_LINES; i++) {
    const u = (i / POLOIDAL_LINES) * TWO_PI;
    flowLines.metadata.push({
      type: 'poloidal',
      offset: i / POLOIDAL_LINES,
      color: 'rgba(80, 80, 80, 0.3)',
      startIdx: lineIdx * pointsPerLine
    });
    for (let j = 0; j <= LINE_POINTS; j++) {
      const v = (j / LINE_POINTS) * TWO_PI;
      const pointIdx = (lineIdx * pointsPerLine + j) * 3;
      flowLines.points[pointIdx] = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastCos(u);
      flowLines.points[pointIdx + 1] = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastSin(u);
      flowLines.points[pointIdx + 2] = TUBE_RADIUS * fastSin(v);
      flowLines.progress[lineIdx * pointsPerLine + j] = j / LINE_POINTS;
    }
    lineIdx++;
  }
  for (let i = 0; i < TOROIDAL_LINES; i++) {
    const v = (i / TOROIDAL_LINES) * TWO_PI;
    flowLines.metadata.push({
      type: 'toroidal',
      offset: i / TOROIDAL_LINES,
      color: 'rgba(120, 120, 120, 0.3)',
      startIdx: lineIdx * pointsPerLine
    });
    for (let j = 0; j <= LINE_POINTS; j++) {
      const u = (j / LINE_POINTS) * TWO_PI;
      const pointIdx = (lineIdx * pointsPerLine + j) * 3;
      flowLines.points[pointIdx] = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastCos(u);
      flowLines.points[pointIdx + 1] = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastSin(u);
      flowLines.points[pointIdx + 2] = TUBE_RADIUS * fastSin(v);
      flowLines.progress[lineIdx * pointsPerLine + j] = j / LINE_POINTS;
    }
    lineIdx++;
  }

  // Projected points
  const projectedPoints = new Float32Array(nodeCount * 4);
  const projectedArrows = new Float32Array(12 * 4);
  let mouse = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
  let time = Math.PI;

  function project3DPoint(x, y, z, rotationX, rotationY, outArray, outIndex) {
    const sinRotX = fastSin(rotationX);
    const cosRotX = fastCos(rotationX);
    const sinRotY = fastSin(rotationY);
    const cosRotY = fastCos(rotationY);
    const rotatedY = y * cosRotX - z * sinRotX;
    const rotatedZ = y * sinRotX + z * cosRotX;
    const rotatedX = x * cosRotY + rotatedZ * sinRotY;
    const finalZ = -x * sinRotY + rotatedZ * cosRotY;
    const scale = 500 / (500 + finalZ);
    outArray[outIndex] = rotatedX * scale + CANVAS_SIZE / 2;
    outArray[outIndex + 1] = rotatedY * scale + CANVAS_SIZE / 2;
    outArray[outIndex + 2] = finalZ;
    outArray[outIndex + 3] = scale;
  }

  function animate() {
    if (!running) return;
    ctx.fillStyle = animationUtils.colors.background;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const rotationX = Math.PI * 0.3;
    const rotationY = time;
    for (let i = 0; i < nodeCount; i++) {
      const posOffset = i * 3;
      project3DPoint(
        nodes.positions[posOffset],
        nodes.positions[posOffset + 1],
        nodes.positions[posOffset + 2],
        rotationX,
        rotationY,
        projectedPoints,
        i * 4
      );
    }
    // Mouse interaction
    const candidateNodes = [];
    for (let i = 0; i < nodeCount; i++) {
      if (!nodes.dispersing[i]) {
        const projOffset = i * 4;
        const distanceToMouse = Math.hypot(
          projectedPoints[projOffset] - mouse.x,
          projectedPoints[projOffset + 1] - mouse.y
        );
        if (distanceToMouse < 60) {
          candidateNodes.push({ index: i, distance: distanceToMouse });
        }
      }
    }
    candidateNodes.sort((a, b) => a.distance - b.distance);
    candidateNodes.slice(0, 5).forEach(({ index }) => {
      const posOffset = index * 3;
      const paramOffset = index * 3;
      nodes.dispersing[index] = 1;
      nodes.params[paramOffset + 2] = 0;
      const u = nodes.params[paramOffset];
      const v = nodes.params[paramOffset + 1];
      const normalX = fastCos(u) * fastCos(v);
      const normalY = fastSin(u) * fastCos(v);
      const normalZ = fastSin(v);
      nodes.velocity[posOffset] = normalX * 3;
      nodes.velocity[posOffset + 1] = normalY * 3;
      nodes.velocity[posOffset + 2] = normalZ * 3;
    });
    for (let i = 0; i < nodeCount; i++) {
      if (nodes.dispersing[i]) {
        const posOffset = i * 3;
        const paramOffset = i * 3;
        nodes.params[paramOffset + 2] += 0.02;
        nodes.positions[posOffset] += nodes.velocity[posOffset];
        nodes.positions[posOffset + 1] += nodes.velocity[posOffset + 1];
        nodes.positions[posOffset + 2] += nodes.velocity[posOffset + 2];
        nodes.velocity[posOffset] *= 0.96;
        nodes.velocity[posOffset + 1] *= 0.96;
        nodes.velocity[posOffset + 2] *= 0.96;
        if (nodes.params[paramOffset + 2] > 4) {
          nodes.dispersing[i] = 0;
          nodes.positions[posOffset] = nodes.original[posOffset];
          nodes.positions[posOffset + 1] = nodes.original[posOffset + 1];
          nodes.positions[posOffset + 2] = nodes.original[posOffset + 2];
          nodes.velocity[posOffset] = 0;
          nodes.velocity[posOffset + 1] = 0;
          nodes.velocity[posOffset + 2] = 0;
        }
      }
    }
    // Draw flow lines
    flowLines.metadata.forEach((line) => {
      const animOffset = (time * 0.5 + line.offset) % 1;
      const startIdx = line.startIdx;
      const pointCount = LINE_POINTS + 1;
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      for (let i = 0; i < pointCount; i++) {
        const pointIdx = (startIdx + i) * 3;
        project3DPoint(
          flowLines.points[pointIdx],
          flowLines.points[pointIdx + 1],
          flowLines.points[pointIdx + 2],
          rotationX,
          rotationY,
          projectedPoints,
          i * 4
        );
        if (i === 0) {
          ctx.moveTo(projectedPoints[0], projectedPoints[1]);
        } else {
          ctx.lineTo(projectedPoints[i * 4], projectedPoints[i * 4 + 1]);
        }
      }
      if (line.type === 'toroidal') ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    });
    // Draw arrows
    const arrowTime = time * 2;
    for (let i = 0; i < 12; i++) {
      const t = (i / 12 + arrowTime * 0.1) % 1;
      const u = t * TWO_PI;
      const v = Math.PI;
      const x = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastCos(u);
      const y = (MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastSin(u);
      const z = TUBE_RADIUS * fastSin(v);
      project3DPoint(x, y, z, rotationX, rotationY, projectedArrows, i * 4);
      const tangentU = -(MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastSin(u);
      const tangentV = -(MAJOR_RADIUS + TUBE_RADIUS * fastCos(v)) * fastCos(u);
      project3DPoint(
        x + tangentU * 0.1,
        y + tangentV * 0.1,
        z,
        rotationX,
        rotationY,
        projectedPoints,
        0
      );
      const angle = Math.atan2(
        projectedPoints[1] - projectedArrows[i * 4 + 1],
        projectedPoints[0] - projectedArrows[i * 4]
      );
      projectedArrows[i * 4 + 3] = angle;
    }
    ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
    for (let i = 0; i < 12; i++) {
      const idx = i * 4;
      ctx.save();
      ctx.translate(projectedArrows[idx], projectedArrows[idx + 1]);
      ctx.rotate(projectedArrows[idx + 3]);
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-5, -3);
      ctx.lineTo(-5, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // Sort and draw nodes
    const indices = new Uint16Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) indices[i] = i;
    indices.sort((a, b) => projectedPoints[b * 4 + 2] - projectedPoints[a * 4 + 2]);
    for (let i = 0; i < nodeCount; i++) {
      const nodeIdx = indices[i];
      const projOffset = nodeIdx * 4;
      const scale = projectedPoints[projOffset + 3];
      const alpha = nodes.dispersing[nodeIdx] ? 0.3 * scale * (1 - nodes.params[nodeIdx * 3 + 2] / 4) : 0.7 * scale;
      const size = 0.8 + 0.3 * scale;
      const shade = 50 + Math.floor(scale * 30);
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(projectedPoints[projOffset], projectedPoints[projOffset + 1], size, 0, TWO_PI);
      ctx.fill();
    }
    // Draw central void
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, 30, 0, TWO_PI);
    ctx.stroke();
    time += 0.001;
    animationFrameId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  canvas.addEventListener('mousemove', handleMouseMove);
  animate();

  // Trả về hàm cleanup để animation manager có thể gọi khi cần
  return {
    cleanup() {
      running = false;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      
      // Hiển thị lại loader nếu cần
      const loader = container.querySelector('.animation-loader');
      if (loader) loader.style.display = 'flex';
    }
  };
  }
};

export default torusEnergyFlowAnimation;