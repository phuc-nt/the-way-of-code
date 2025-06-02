// Animation for Chapter 55: Oscillating Hatching
// Visualization: A form that breathes and pulses with life, its hatched lines revealing the balance between structure and movement
import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;

const oscillatingHatchingAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
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
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    let time = 50;
    const timeStep = 0.004;
    // Noise function simulation
    const noise3D = (x, y, z, t) => {
      return Math.sin(x * 0.1 + t * 0.15) *
             Math.cos(y * 0.1 + Math.sin(z * 0.1) + t * 0.1) *
             Math.sin(z * 0.1 + Math.sin(x * 0.1) + t * 0.2);
    };
    const baseForm = {
      majorRadius: 80,
      minorRadius: 30,
      complexity: 0.8,
      resolution: 36
    };
    let cachedVertices = null;
    let lastCacheTime = -1;
    const cacheLifetime = 0.1;
    const generateVertices = (time) => {
      if (cachedVertices && time - lastCacheTime < cacheLifetime) {
        return cachedVertices;
      }
      const vertices = [];
      const resolution = baseForm.resolution;
      const breathingFactor = Math.sin(time * 0.2) * 5;
      const majorRadius = baseForm.majorRadius + breathingFactor;
      const minorRadius = baseForm.minorRadius + breathingFactor * 0.2;
      for (let i = 0; i < resolution; i++) {
        const theta = (i / resolution) * Math.PI * 2;
        for (let j = 0; j < resolution; j++) {
          const phi = (j / resolution) * Math.PI * 2;
          const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
          const y = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
          const z = minorRadius * Math.sin(phi);
          const noiseScale = 0.02 * baseForm.complexity;
          const timeFactor = time * 0.2;
          const noise =
            15 * noise3D(x * noiseScale, y * noiseScale, z * noiseScale, timeFactor) +
            7 * noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2, timeFactor * 1.3);
          const normalX = x / majorRadius;
          const normalY = y / majorRadius;
          const normalZ = z / minorRadius;
          const normalLength = Math.sqrt(normalX*normalX + normalY*normalY + normalZ*normalZ) || 0.001;
          const deformedX = x + (normalX / normalLength) * noise;
          const deformedY = y + (normalY / normalLength) * noise;
          const deformedZ = z + (normalZ / normalLength) * noise;
          const tangent1X = -Math.sin(theta);
          const tangent1Y = Math.cos(theta);
          const tangent1Z = 0;
          const tangent2X = -Math.cos(theta) * Math.sin(phi);
          const tangent2Y = -Math.sin(theta) * Math.sin(phi);
          const tangent2Z = Math.cos(phi);
          vertices.push({
            position: { x: deformedX, y: deformedY, z: deformedZ },
            normal: { x: normalX / normalLength, y: normalY / normalLength, z: normalZ / normalLength },
            tangent1: { x: tangent1X, y: tangent1Y, z: tangent1Z },
            tangent2: { x: tangent2X, y: tangent2Y, z: tangent2Z },
            theta,
            phi,
            hatchingIntensity: 0.3 + 0.7 * Math.abs(noise3D(
              deformedX * 0.03,
              deformedY * 0.03,
              deformedZ * 0.03,
              time * 0.5
            ))
          });
        }
      }
      cachedVertices = vertices;
      lastCacheTime = time;
      return vertices;
    };
    const project = (point, time) => {
      const rotX = time * 0.05;
      const rotY = time * 0.075;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const y1 = point.y;
      const z1 = point.z * cosX - point.x * sinX;
      const x1 = point.z * sinX + point.x * cosX;
      const y2 = y1 * cosY - z1 * sinY;
      const z2 = y1 * sinY + z1 * cosY;
      const x2 = x1;
      const scale = 1.5;
      return {
        x: centerX + x2 * scale,
        y: centerY + y2 * scale,
        z: z2
      };
    };
    const calculateVisibility = (projectedVertices) => {
      const bufferSize = 200;
      const zBuffer = new Array(bufferSize).fill().map(() => new Array(bufferSize).fill(-Infinity));
      const visible = new Array(projectedVertices.length).fill(false);
      const toBufferCoords = (x, y) => {
        const bx = Math.floor((x / width) * bufferSize);
        const by = Math.floor((y / height) * bufferSize);
        return { bx, by };
      };
      projectedVertices.forEach((vertex, index) => {
        const { bx, by } = toBufferCoords(vertex.x, vertex.y);
        if (bx >= 0 && bx < bufferSize && by >= 0 && by < bufferSize) {
          if (vertex.z > zBuffer[by][bx]) {
            zBuffer[by][bx] = vertex.z;
            visible[index] = true;
          }
        }
      });
      return visible;
    };
    const generateHatchingLines = (vertices, visibility, time) => {
      const projectedVertices = vertices.map(v => {
        const projection = project(v.position, time);
        return { ...projection, vertex: v };
      });
      const isVisible = calculateVisibility(projectedVertices);
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      const phiGroups = {};
      const phiPrecision = 0.2;
      vertices.forEach((vertex, index) => {
        if (!isVisible[index]) return;
        const phiKey = Math.round(vertex.phi / phiPrecision) * phiPrecision;
        if (!phiGroups[phiKey]) phiGroups[phiKey] = [];
        phiGroups[phiKey].push({ vertex, projectedPos: projectedVertices[index] });
      });
      Object.values(phiGroups).forEach(group => {
        if (group.length < 2) return;
        group.sort((a, b) => a.vertex.theta - b.vertex.theta);
        const midPoint = group[Math.floor(group.length / 2)];
        const normalZ = midPoint.vertex.normal.z;
        const intensity = midPoint.vertex.hatchingIntensity;
        const baseLightness = Math.abs(normalZ) * 0.7 + 0.3;
        const baseOpacity = 0.1 + baseLightness * 0.5;
        const opacity = baseOpacity * intensity;
        const width = 0.3 + intensity * 0.7;
        ctx.beginPath();
        const start = group[0].projectedPos;
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < group.length; i++) {
          const point = group[i].projectedPos;
          const variation = 0.5 * Math.sin(time + group[i].vertex.theta * 10);
          ctx.lineTo(point.x + variation, point.y + variation);
        }
        ctx.strokeStyle = `rgba(51, 51, 51, ${opacity})`;
        ctx.lineWidth = width;
        ctx.stroke();
      });
      const thetaGroups = {};
      const thetaPrecision = 0.15;
      vertices.forEach((vertex, index) => {
        if (!isVisible[index]) return;
        const thetaKey = Math.round(vertex.theta / thetaPrecision) * thetaPrecision;
        if (!thetaGroups[thetaKey]) thetaGroups[thetaKey] = [];
        thetaGroups[thetaKey].push({ vertex, projectedPos: projectedVertices[index] });
      });
      Object.values(thetaGroups).forEach(group => {
        if (group.length < 2) return;
        group.sort((a, b) => a.vertex.phi - b.vertex.phi);
        const midPoint = group[Math.floor(group.length / 2)];
        const normalX = midPoint.vertex.normal.x;
        const normalY = midPoint.vertex.normal.y;
        const lightAngle = Math.atan2(normalY, normalX);
        const intensity = 0.3 + 0.7 * Math.abs(Math.sin(lightAngle + time * 0.02));
        const width = 0.2 + intensity * 0.6;
        const opacity = (0.1 + intensity * 0.4) * midPoint.vertex.hatchingIntensity;
        ctx.beginPath();
        const start = group[0].projectedPos;
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < group.length; i++) {
          const point = group[i].projectedPos;
          const variation = 0.3 * Math.cos(time * 1.2 + group[i].vertex.phi * 8);
          ctx.lineTo(point.x + variation, point.y + variation);
        }
        ctx.strokeStyle = `rgba(51, 51, 51, ${opacity})`;
        ctx.lineWidth = width;
        ctx.stroke();
      });
      const accentThreshold = 0.7;
      projectedVertices.forEach((pVertex, index) => {
        if (!isVisible[index]) return;
        const vertex = pVertex.vertex;
        if (vertex.hatchingIntensity > accentThreshold) {
          const mixFactor = Math.sin(time * 0.1 + vertex.theta * 2 + vertex.phi * 1);
          const tangentX = vertex.tangent1.x * (1 + mixFactor) / 2 + vertex.tangent2.x * (1 - mixFactor) / 2;
          const tangentY = vertex.tangent1.y * (1 + mixFactor) / 2 + vertex.tangent2.y * (1 - mixFactor) / 2;
          const tangentZ = vertex.tangent1.z * (1 + mixFactor) / 2 + vertex.tangent2.z * (1 - mixFactor) / 2;
          const length = 3 + 5 * vertex.hatchingIntensity;
          const startPos = {
            x: vertex.position.x - tangentX * length,
            y: vertex.position.y - tangentY * length,
            z: vertex.position.z - tangentZ * length
          };
          const endPos = {
            x: vertex.position.x + tangentX * length,
            y: vertex.position.y + tangentY * length,
            z: vertex.position.z + tangentZ * length
          };
          const projectedStart = project(startPos, time);
          const projectedEnd = project(endPos, time);
          ctx.beginPath();
          ctx.moveTo(projectedStart.x, projectedStart.y);
          ctx.lineTo(projectedEnd.x, projectedEnd.y);
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.25 + vertex.theta * 3 + vertex.phi * 2);
          const accentOpacity = 0.1 + 0.5 * pulse * vertex.hatchingIntensity;
          const accentWidth = 0.3 + 0.6 * pulse;
          ctx.strokeStyle = `rgba(51, 51, 51, ${accentOpacity})`;
          ctx.lineWidth = accentWidth;
          ctx.stroke();
        }
      });
    };
    let animationFrameId = null;
    function animate() {
      time += timeStep;
      const vertices = generateVertices(time);
      generateHatchingLines(vertices, null, time);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    function handleResize() {
      // Optionally, handle responsive canvas if needed
    }
    window.addEventListener('resize', handleResize);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (container && canvas) container.removeChild(canvas);
        cachedVertices = null;
      }
    };
  }
};

export default oscillatingHatchingAnimation;
