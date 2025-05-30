// Animation for Chapter 58: Breathing Rhombus
// Visualization: Rhombi breathing in and out, layered with subtle texture

const BreathingRhombusAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = '#F0EEE6';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = '550px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Create inner div to hold rhombus, taking full space
    let inner = container.querySelector('.breathing-rhombus-inner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'breathing-rhombus-inner';
      inner.style.width = '100%';
      inner.style.height = '100%';
      inner.style.position = 'absolute';
      inner.style.left = '0';
      inner.style.top = '0';
      inner.style.right = '0';
      inner.style.bottom = '0';
      inner.style.overflow = 'hidden';
      container.appendChild(inner);
    }
    inner.innerHTML = '';

    // Wait for DOM to render to get correct container size
    requestAnimationFrame(() => {
      const containerWidth = inner.offsetWidth || 550;
      const scaleFactor = containerWidth / 550;
      const numRhombi = 9;
      const createdElements = [];
      let animationFrameId = null;
      let isMounted = true;

      // SVG pattern for texture
      const patternSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      patternSVG.setAttribute('width', '0');
      patternSVG.setAttribute('height', '0');
      patternSVG.innerHTML = `
        <defs>
          <pattern id="crackedTexture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#444" opacity="0.1"/>
            <path d="M20,20 L40,15 L35,40 M60,30 L80,25 L75,50 M10,70 L30,65 L25,90" 
                  stroke="#333" stroke-width="0.5" fill="none" opacity="0.3"/>
          </pattern>
        </defs>
      `;
      inner.appendChild(patternSVG);
      createdElements.push(patternSVG);

      // Create rhombi with correct scale
      for (let i = 0; i < numRhombi; i++) {
        const baseSize = 80 + Math.sin((i / numRhombi) * Math.PI) * 60;
        const size = baseSize * scaleFactor;
        const baseYPos = i * 40;
        const yPos = baseYPos * scaleFactor;

        const rhombusDiv = document.createElement('div');
        rhombusDiv.className = 'rhombus';
        rhombusDiv.style.position = 'absolute';
        rhombusDiv.style.left = '50%';
        rhombusDiv.style.top = `${yPos}px`;
        rhombusDiv.style.transform = 'translateX(-50%)';
        rhombusDiv.style.transition = 'all 0.3s ease';
        rhombusDiv.dataset.index = i;
        rhombusDiv.dataset.originalSize = size;
        rhombusDiv.style.width = `${size}px`;
        rhombusDiv.style.height = `${size * 0.6}px`;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 60');

        const texturePoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        texturePoly.setAttribute('points', '50,0 100,30 50,60 0,30');
        texturePoly.setAttribute('fill', 'url(#crackedTexture)');
        texturePoly.setAttribute('opacity', '0.15');

        const shapePoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shapePoly.setAttribute('points', '50,0 100,30 50,60 0,30');
        shapePoly.setAttribute('fill', 'none');
        shapePoly.setAttribute('stroke', '#333');
        shapePoly.setAttribute('stroke-width', '0.5');
        shapePoly.setAttribute('opacity', '0.8');

        const lines = [
          { x1: '50', y1: '0', x2: '50', y2: '60' },
          { x1: '0', y1: '30', x2: '100', y2: '30' },
          { x1: '25', y1: '15', x2: '75', y2: '45' },
          { x1: '75', y1: '15', x2: '25', y2: '45' }
        ];
        const lineElems = lines.map(coords => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', coords.x1);
          line.setAttribute('y1', coords.y1);
          line.setAttribute('x2', coords.x2);
          line.setAttribute('y2', coords.y2);
          line.setAttribute('stroke', '#444');
          line.setAttribute('stroke-width', '0.3');
          line.setAttribute('opacity', '0.6');
          line.classList.add('inner-lines');
          return line;
        });
        svg.appendChild(texturePoly);
        svg.appendChild(shapePoly);
        lineElems.forEach(line => svg.appendChild(line));
        rhombusDiv.appendChild(svg);
        inner.appendChild(rhombusDiv);
        createdElements.push(rhombusDiv);
      }

      // Animation loop
      function animateBreathing() {
        if (!isMounted || !inner) return;
        const rhombi = inner.querySelectorAll('.rhombus');
        if (rhombi.length === 0) return;
        const time = Date.now() / 1000;
        rhombi.forEach((rhombus, index) => {
          const delay = index * 0.25;
          const breathAmount = Math.sin(time * 0.4 + delay) * 0.15 + 1;
          const rotation = Math.sin(time * 0.5 + delay) * 3;
          rhombus.style.transform = `translateX(-50%) scale(${breathAmount}) rotate(${rotation}deg)`;
          // Animate opacity of lines
          const shapes = rhombus.querySelectorAll('polygon, line');
          shapes.forEach(shape => {
            if (shape.getAttribute('stroke')) {
              shape.style.opacity = (0.2 + Math.sin(time * 0.4 + delay) * 0.3).toString();
            }
          });
        });
        if (isMounted) {
          animationFrameId = requestAnimationFrame(animateBreathing);
        }
      }
      animateBreathing();

      // Cleanup
      BreathingRhombusAnimation._cleanup = () => {
        isMounted = false;
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        createdElements.forEach(element => {
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
          if (element instanceof HTMLElement) {
            element.style.transform = '';
            element.style.opacity = '';
            element.style.transition = '';
          }
        });
        if (inner && inner.parentNode) {
          inner.parentNode.removeChild(inner);
        }
        createdElements.length = 0;
      };
    });
    // Cleanup
    return {
      cleanup: () => {
        if (typeof BreathingRhombusAnimation._cleanup === 'function') {
          BreathingRhombusAnimation._cleanup();
        }
      }
    };
  }
};

export default BreathingRhombusAnimation;
