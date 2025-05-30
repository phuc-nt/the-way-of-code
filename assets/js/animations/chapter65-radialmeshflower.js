// Animation for Chapter 65: Radial Mesh Flower
// Visualization: A flower that responds to presence without force, showing how patterns emerge through gentle guidance

const CANVAS_SIZE = 600;
const BG_COLOR = '#F0EEE6';

const RadialMeshFlowerAnimation = {
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

    // Create SVG
    let svg = container.querySelector('svg.radial-mesh-flower-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('radial-mesh-flower-svg');
      svg.setAttribute('width', CANVAS_SIZE);
      svg.setAttribute('height', CANVAS_SIZE);
      svg.setAttribute('viewBox', `0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`);
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.display = 'block';
      svg.style.maxWidth = '100%';
      svg.style.maxHeight = '100%';
      svg.style.cursor = 'crosshair';
      container.appendChild(svg);
    }

    let width = CANVAS_SIZE;
    let height = CANVAS_SIZE;
    let radius = Math.min(width, height) * 0.267;
    let lineCount = 400;
    let easingFactor = 0.08;
    let running = true;
    let animationFrameId = null;
    let centerRotation = 0;
    let mousePos = { x: width / 2, y: height / 2 };
    let circlePositions = [];

    // Initialize circle positions
    function initCirclePositions() {
      circlePositions = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distanceFromCenter = radius * 0.5;
        const x = width / 2 + Math.cos(angle) * distanceFromCenter;
        const y = height / 2 + Math.sin(angle) * distanceFromCenter;
        circlePositions.push({ x, y, targetX: x, targetY: y });
      }
      // Center circle
      circlePositions.push({ x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 });
    }
    initCirclePositions();

    // Handle mouse move
    function handleMouseMove(event) {
      const rect = svg.getBoundingClientRect();
      mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
    svg.addEventListener('mousemove', handleMouseMove);

    // Update target positions based on mouse
    function updateTargets() {
      let closestCircleIndex = 0;
      let minDistance = Infinity;
      circlePositions.forEach((circle, i) => {
        const dx = mousePos.x - circle.x;
        const dy = mousePos.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          closestCircleIndex = i;
        }
      });
      circlePositions = circlePositions.map((circle, i) => {
        let baseCx, baseCy;
        if (i === 8) {
          baseCx = width / 2;
          baseCy = height / 2;
        } else {
          const angle = (i / 8) * Math.PI * 2;
          const distanceFromCenter = radius * 0.5;
          baseCx = width / 2 + Math.cos(angle) * distanceFromCenter;
          baseCy = height / 2 + Math.sin(angle) * distanceFromCenter;
        }
        if (i === closestCircleIndex) {
          const maxMovement = radius * 0.1;
          const dx = mousePos.x - baseCx;
          const dy = mousePos.y - baseCy;
          const movement = Math.min(Math.sqrt(dx * dx + dy * dy) / radius, 1) * maxMovement;
          const moveAngle = Math.atan2(dy, dx);
          return {
            ...circle,
            targetX: baseCx + Math.cos(moveAngle) * movement,
            targetY: baseCy + Math.sin(moveAngle) * movement
          };
        } else {
          return {
            ...circle,
            targetX: baseCx,
            targetY: baseCy
          };
        }
      });
    }

    // Generate petal lines
    function generatePetalLines(cx, cy, radius, rotation = 0, isCenter = false) {
      const lines = [];
      const petalCount = 12;
      for (let petal = 0; petal < petalCount; petal++) {
        const petalAngle = (petal / petalCount) * Math.PI * 2 + rotation;
        const linesPerPetal = Math.floor(lineCount / petalCount);
        for (let i = 0; i < linesPerPetal; i++) {
          const t = i / linesPerPetal;
          const angle = petalAngle + (t - 0.5) * 0.5;
          const innerRadius = isCenter ? radius * 0.1 : radius * 0.2;
          const outerRadius = radius * (0.9 - Math.pow(Math.abs(t - 0.5) * 2, 2) * 0.3);
          const curveOffset = Math.sin(t * Math.PI) * 0.1;
          const curvedAngle = angle + curveOffset;
          const x1 = cx + Math.cos(curvedAngle) * innerRadius;
          const y1 = cy + Math.sin(curvedAngle) * innerRadius;
          const x2 = cx + Math.cos(angle) * outerRadius;
          const y2 = cy + Math.sin(angle) * outerRadius;
          lines.push({ x1, y1, x2, y2, opacity: 0.6 - Math.abs(t - 0.5) * 0.4 });
        }
      }
      return lines;
    }

    // Draw function
    function draw() {
      svg.innerHTML = '';
      circlePositions.forEach((circle, index) => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const lines = generatePetalLines(
          circle.x,
          circle.y,
          index === 8 ? radius * 0.7 : radius,
          index === 8 ? centerRotation : (index / 8) * Math.PI * 2,
          index === 8
        );
        lines.forEach(line => {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M${line.x1},${line.y1} L${line.x2},${line.y2}`);
          path.setAttribute('stroke', '#333333');
          path.setAttribute('stroke-width', index === 8 ? '0.4' : '0.3');
          path.setAttribute('opacity', line.opacity);
          path.setAttribute('fill', 'none');
          group.appendChild(path);
        });
        svg.appendChild(group);
      });
    }

    // Animation loop
    function animate() {
      if (!running) return;
      centerRotation += 0.005;
      updateTargets();
      circlePositions = circlePositions.map(circle => {
        const dx = circle.targetX - circle.x;
        const dy = circle.targetY - circle.y;
        return {
          ...circle,
          x: circle.x + dx * easingFactor,
          y: circle.y + dy * easingFactor
        };
      });
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup: () => {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        svg.removeEventListener('mousemove', handleMouseMove);
        if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
      }
    };
  }
};

export default RadialMeshFlowerAnimation;
