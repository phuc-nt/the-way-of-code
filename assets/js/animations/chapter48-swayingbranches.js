// Animation for Chapter 48: Swaying Branches (Canvas)
// Visualization: A tree that grows through simple rules, demonstrating how complexity naturally emerges when we step back and let things develop

import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;

const swayingBranchesAnimation = {
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
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.style.overflow = 'hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Responsive canvas with improved scaling
    function adjustCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;
      
      // Set display size (css pixels)
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Reset transformation matrix to default
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      // Scale all drawing operations by the dpr
      ctx.scale(dpr, dpr);
    }
    adjustCanvas();
    window.addEventListener('resize', adjustCanvas);

    // L-system parameters
    const axiom = "X";
    const rules = {
      "X": "F-[[X]+X]+F[+FX]-X",
      "F": "FF"
    };
    const finalRule = {
      "X": "F-[[X]+X]+F[+FX]-X+[F+X][-X]",
      "F": "FF"
    };
    function generateLSystem(start, iterations, customRules = rules) {
      let result = start;
      for (let i = 0; i < iterations; i++) {
        let nextGen = "";
        for (let j = 0; j < result.length; j++) {
          const current = result[j];
          nextGen += customRules[current] || current;
        }
        result = nextGen;
      }
      return result;
    }
    // Adjusted branch lengths to match original animation (reduced overall size)
    const precomputedSystems = [
      {
        config: { iterations: 3, angleDelta: Math.PI / 7, length: 15 },
        system: generateLSystem(axiom, 3)
      },
      {
        config: { iterations: 4, angleDelta: Math.PI / 7, length: 12 },
        system: generateLSystem(axiom, 4)
      },
      {
        config: { iterations: 5, angleDelta: Math.PI / 8, length: 9 },
        system: generateLSystem(axiom, 5, finalRule)
      }
    ];

    // Animation state
    let time = 0;
    let currentSystemIndex = 0;
    let transitionFactor = 0;
    let isTransitioning = false;
    let growthComplete = false;
    let animationFrameId = null;
    let swayFactor = 0.4;

    function drawLSystem(systemData, alpha = 1) {
      const { config, system } = systemData;
      const { angleDelta, length } = config;
      // Use width and height directly to avoid the double scaling issue
      const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
      const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
      // Position at the center bottom of the canvas
      let x = canvasWidth / 2;
      let y = canvasHeight * 0.98;
      let baseAngle = -Math.PI / 2 + (Math.sin(time * 0.2) * swayFactor);
      const stack = [];
      for (let i = 0; i < system.length; i++) {
        const command = system[i];
        switch(command) {
          case 'F': {
            const x2 = x + length * Math.cos(baseAngle);
            const y2 = y + length * Math.sin(baseAngle);
            const transparency = (0.2 - (i / system.length) * 0.08) * alpha;
            ctx.strokeStyle = `rgba(51, 51, 51, ${transparency})`;
            // Giảm độ dày của các nhánh từ 2px xuống 1px để giống bản gốc hơn
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            x = x2;
            y = y2;
            break;
          }
          case '+':
            baseAngle += angleDelta + (Math.sin(time * 0.2 + i * 0.01) * 0.05);
            break;
          case '-':
            baseAngle -= angleDelta + (Math.sin(time * 0.2 + i * 0.01) * 0.05);
            break;
          case '[':
            stack.push({ x, y, angle: baseAngle });
            break;
          case ']': {
            const state = stack.pop();
            if (state) {
              ({ x, y, baseAngle } = { ...state, baseAngle: state.angle });
              const dotAlpha = 0.1 * alpha;
              if (dotAlpha > 0.01) {
                ctx.fillStyle = `rgba(51, 51, 51, ${dotAlpha})`;
                ctx.beginPath();
                // Giảm kích thước của các điểm từ bán kính 2px xuống 1px để phù hợp với độ mảnh mới của các nhánh
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            break;
          }
        }
      }
    }

    function animate() {
      // Clear canvas with background
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // Use smoother time increment for animation as in the original
      time += 0.008;
      
      if (!growthComplete) {
        if (isTransitioning) {
          // Smoother transition with cubic easing
          transitionFactor += 0.02;
          
          if (transitionFactor >= 1) {
            isTransitioning = false;
            transitionFactor = 0;
            currentSystemIndex++;
            
            // Check if we've reached the final stage
            if (currentSystemIndex >= precomputedSystems.length - 1) {
              growthComplete = true;
              currentSystemIndex = precomputedSystems.length - 1;
            }
          } else {
            // Use cubic easing for smoother transitions
            const easeOut = 1 - Math.pow(1 - transitionFactor, 3);
            drawLSystem(precomputedSystems[currentSystemIndex], 1 - easeOut);
            const nextIndex = Math.min(currentSystemIndex + 1, precomputedSystems.length - 1);
            drawLSystem(precomputedSystems[nextIndex], easeOut);
          }
        } else {
          // Draw current system
          drawLSystem(precomputedSystems[currentSystemIndex]);
          
          // Start next transition periodically
          if (time % 1 < 0.016) {  // Approximately one frame at 60fps
            isTransitioning = true;
          }
        }
      } else {
        // Enhanced swaying in final form
        swayFactor = 0.4 + Math.sin(time * 0.1) * 0.05;
        drawLSystem(precomputedSystems[precomputedSystems.length - 1]);
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup() {
        window.removeEventListener('resize', adjustCanvas);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        precomputedSystems.length = 0;
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default swayingBranchesAnimation;
