// chapter16-morphingcontours.js - Animation cho chương 16: Morphing Contours
import animationUtils from './animation-utils.js';

const chapter16MorphingContours = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    // Hiển thị loader trong quá trình thiết lập
    const loader = container.querySelector('.animation-loader');

    // Tạo canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.settings.width;
    canvas.height = this.settings.height;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = this.settings.colors.background;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Parameters
    const numShapes = 3;
    const contoursPerShape = 25;
    const points = 100;
    let time = 0;
    const scaleFactor = 1.5;
    const backgroundColor = animationUtils.colors.background;
    const lineColor = 'rgba(50, 50, 50, 0.4)';
    let animationId = null;

    function draw() {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      time += 0.001;
      const centerX = width / 2;
      const centerY = height / 2;
      for (let shapeIndex = 0; shapeIndex < numShapes; shapeIndex++) {
        const shapePhase = time + shapeIndex * Math.PI * 2 / numShapes;
        const offsetX = Math.sin(shapePhase * 0.2) * 40 * scaleFactor;
        const offsetY = Math.cos(shapePhase * 0.3) * 40 * scaleFactor;
        for (let contour = 0; contour < contoursPerShape; contour++) {
          const scale = (30 + contour * 3) * scaleFactor;
          const contourOffsetX = Math.sin(contour * 0.2 + shapePhase) * 10 * scaleFactor;
          const contourOffsetY = Math.cos(contour * 0.2 + shapePhase) * 10 * scaleFactor;
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.8;
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            let radius = scale;
            radius += 15 * Math.sin(angle * 3 + shapePhase * 2) * scaleFactor;
            radius += 10 * Math.cos(angle * 5 - shapePhase) * scaleFactor;
            radius += 5 * Math.sin(angle * 8 + contour * 0.1) * scaleFactor;
            const x = centerX + offsetX + contourOffsetX + Math.cos(angle) * radius;
            const y = centerY + offsetY + contourOffsetY + Math.sin(angle) * radius;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      animationId = requestAnimationFrame(draw);
    }
    animationId = requestAnimationFrame(draw);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (canvas && ctx) {
          ctx.clearRect(0, 0, width, height);
        }
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter16MorphingContours;
