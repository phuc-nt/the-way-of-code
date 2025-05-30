// Animation for Chapter 46: Dramatic Ribbon Fold (Canvas)
// Visualization: A ribbon that flows freely yet follows mathematical principles, showing how technology can align with natural movement

const CANVAS_SIZE = 550;
const BG_COLOR = '#F0EEE6';

const dramaticRibbonFoldAnimation = {
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
    canvas.style.background = BG_COLOR;
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.boxSizing = 'border-box';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = BG_COLOR;
    container.style.overflow = 'hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let time = 0;
    let animationFrameId = null;
    let running = true;

    // RibbonStrip class
    class RibbonStrip {
      constructor() {
        this.segmentCount = 30;
        this.width = 100;
        this.segments = [];
        this.initialize();
      }
      initialize() {
        this.segments = [];
        for (let i = 0; i < this.segmentCount; i++) {
          this.segments.push({
            x: 0,
            y: 0,
            angle: 0,
            width: this.width,
            height: 20,
            depth: 0
          });
        }
      }
      update(time) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        for (let i = 0; i < this.segments.length; i++) {
          const t = i / (this.segments.length - 1);
          const segment = this.segments[i];
          const smoothTime = time * 0.25;
          const baseAngle = t * Math.PI * 6 + smoothTime;
          const foldPhase = Math.sin(smoothTime * 0.01 + t * Math.PI * 4);
          const heightPhase = Math.cos(smoothTime * 0.00375 + t * Math.PI * 3);
          const radius = 120 + foldPhase * 60;
          segment.x = centerX + Math.cos(baseAngle) * radius;
          segment.y = centerY + Math.sin(baseAngle) * radius + heightPhase * 30;
          segment.angle = baseAngle + foldPhase * Math.PI * 0.5;
          segment.width = this.width * (1 + foldPhase * 0.3);
          segment.depth = Math.sin(baseAngle + time * 0.15);
        }
      }
      draw(ctx) {
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        const sortedSegments = [...this.segments].sort((a, b) => {
          const threshold = 0.1;
          return Math.abs(a.depth - b.depth) > threshold ? a.depth - b.depth : 0;
        });
        for (let i = 0; i < sortedSegments.length - 1; i++) {
          const current = sortedSegments[i];
          const next = sortedSegments[i + 1];
          ctx.save();
          ctx.beginPath();
          const cos1 = Math.cos(current.angle);
          const sin1 = Math.sin(current.angle);
          const cos2 = Math.cos(next.angle);
          const sin2 = Math.sin(next.angle);
          const p1 = {
            x: current.x - sin1 * current.width/2,
            y: current.y + cos1 * current.width/2
          };
          const p2 = {
            x: current.x + sin1 * current.width/2,
            y: current.y - cos1 * current.width/2
          };
          const p3 = {
            x: next.x + sin2 * next.width/2,
            y: next.y - cos2 * next.width/2
          };
          const p4 = {
            x: next.x - sin2 * next.width/2,
            y: next.y + cos2 * next.width/2
          };
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          const depthFactor = (current.depth + 1) * 0.5;
          const opacity = 0.6 + depthFactor * 0.4;
          ctx.strokeStyle = `rgba(40, 40, 40, ${opacity})`;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(80, 80, 80, ${opacity * 0.7})`;
          ctx.stroke();
          ctx.restore();
        }
        for (let i = 0; i < sortedSegments.length; i++) {
          const segment = sortedSegments[i];
          const cos = Math.cos(segment.angle);
          const sin = Math.sin(segment.angle);
          const p1 = {
            x: segment.x - sin * segment.width/2,
            y: segment.y + cos * segment.width/2
          };
          const p2 = {
            x: segment.x + sin * segment.width/2,
            y: segment.y - cos * segment.width/2
          };
          const depthFactor = (segment.depth + 1) * 0.5;
          const opacity = 0.7 + depthFactor * 0.3;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(40, 40, 40, ${opacity})`;
          ctx.fill();
        }
        ctx.setLineDash([]);
      }
    }

    const ribbon = new RibbonStrip();

    function animate() {
      if (!running) return;
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.00125;
      ribbon.update(time);
      ribbon.draw(ctx);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return {
      cleanup() {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default dramaticRibbonFoldAnimation;
