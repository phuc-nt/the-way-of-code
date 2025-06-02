// Animation for Chapter 44: Intricate Radial Mesh (SVG)
import animationUtils from './animation-utils.js';
// Visualization: A radial pattern that finds harmony in simplicity, showing how contentment emerges from accepting what is

const CANVAS_SIZE = 600;
const RADIUS = CANVAS_SIZE * 0.25;
const LINE_COUNT = 300;
const CIRCLE_COUNT = 6;

const intricateRadialMeshAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', CANVAS_SIZE);
    svg.setAttribute('height', CANVAS_SIZE);
    svg.setAttribute('viewBox', `0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`);
    svg.style.display = 'block';
    svg.style.background = animationUtils.colors.background;
    svg.style.margin = '0 auto';
    svg.style.maxWidth = '100%';
    svg.style.maxHeight = '100%';
    svg.style.objectFit = 'contain';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.style.overflow = 'hidden';
    container.appendChild(svg);

    // Circle positions
    let circles = [];
    for (let i = 0; i < CIRCLE_COUNT; i++) {
      const angle = (i / CIRCLE_COUNT) * Math.PI * 2;
      const x = CANVAS_SIZE / 2 + Math.cos(angle) * RADIUS * 0.6;
      const y = CANVAS_SIZE / 2 + Math.sin(angle) * RADIUS * 0.6;
      circles.push({
        x, y,
        baseX: x, baseY: y,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        frequencyX: 0.5 + Math.random() * 0.3,
        frequencyY: 0.5 + Math.random() * 0.3,
        targetX: x, targetY: y
      });
    }

    let running = true;
    let time = 0;
    let animationFrameId = null;
    const easingFactor = 0.1;

    function generateCircleLines(cx, cy, radius, rotation = 0) {
      const lines = [];
      for (let i = 0; i < LINE_COUNT; i++) {
        const angle = (i / LINE_COUNT) * Math.PI * 2 + rotation;
        const x1 = cx + Math.cos(angle) * (radius * 0.1);
        const y1 = cy + Math.sin(angle) * (radius * 0.1);
        const x2 = cx + Math.cos(angle) * radius;
        const y2 = cy + Math.sin(angle) * radius;
        lines.push({ x1, y1, x2, y2 });
      }
      return lines;
    }

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        const circle = circles[i];
        const rotation = (i / CIRCLE_COUNT) * Math.PI * 2;
        const lines = generateCircleLines(circle.x, circle.y, RADIUS, rotation);
        for (let l = 0; l < lines.length; l++) {
          const { x1, y1, x2, y2 } = lines[l];
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
          path.setAttribute('stroke', '#333333');
          path.setAttribute('stroke-width', '0.3');
          path.setAttribute('opacity', '0.7');
          path.setAttribute('fill', 'none');
          svg.appendChild(path);
        }
      }
    }

    function animate() {
      if (!running) return;
      time += 0.016;
      // Update target positions
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        const circle = circles[i];
        const floatAmplitude = RADIUS * 0.05;
        const floatX = Math.sin(time * circle.frequencyX + circle.phaseX) * floatAmplitude;
        const floatY = Math.cos(time * circle.frequencyY + circle.phaseY) * floatAmplitude;
        circle.targetX = circle.baseX + floatX;
        circle.targetY = circle.baseY + floatY;
      }
      // Easing
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        const circle = circles[i];
        circle.x += (circle.targetX - circle.x) * easingFactor;
        circle.y += (circle.targetY - circle.y) * easingFactor;
      }
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return {
      cleanup() {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (svg.parentNode) svg.parentNode.removeChild(svg);
        // Show loader again if needed
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default intricateRadialMeshAnimation;
