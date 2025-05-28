// chapter20-flowingpaths.js - Animation cho chương 20: Flowing Paths
// Visualization: Nodes and flowing paths, showing the interplay of heaven, earth, and the vibe coder
// Themes: harmony of opposites, dynamic flow, subtle influence

import animationUtils from './animation-utils.js';

const chapter20FlowingPaths = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationFrame = null;
    let canvas, ctx, width, height;
    let nodes = [], flowingPaths = [], connections = [];
    let time = 0;

    // Setup canvas
    canvas = document.createElement('canvas');
    width = this.settings.width;
    height = this.settings.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Node class
    class Node {
      constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type; // 'heaven', 'earth', 'vibe'
        this.speed = 0.008 + Math.random() * 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.shapeType = Math.random() > 0.6 ? 'rect' : 'line';
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.moveRange = Math.random() * 30 + 20;
      }
      update() {
        // Subtle movement
        const noiseX = Math.sin(time * this.speed + this.phase) * this.moveRange;
        const noiseY = Math.cos(time * this.speed * 0.7 + this.phase) * this.moveRange;
        this.x += noiseX * 0.002;
        this.y += noiseY * 0.002;
        this.size = 6 + Math.sin(time * 0.05 + this.phase) * 2;
        this.rotation += this.rotationSpeed;
      }
      draw() {
        if (this.type === 'heaven') {
          ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
        } else if (this.type === 'earth') {
          ctx.fillStyle = `rgba(40, 40, 40, ${this.opacity})`;
        } else {
          ctx.fillStyle = `rgba(20, 20, 20, ${this.opacity + 0.3})`;
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        if (this.shapeType === 'rect') {
          const pulseSize = this.size * (1 + Math.sin(time * this.pulseSpeed) * 0.2);
          ctx.fillRect(-pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
        } else {
          ctx.beginPath();
          ctx.moveTo(-this.size/2, 0);
          ctx.lineTo(this.size/2, 0);
          ctx.lineWidth = 2;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // FlowingPath class
    class FlowingPath {
      constructor(startX, startY, endX, endY, speed) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.speed = speed;
        this.opacity = 0.18 + Math.random() * 0.18;
        this.controlPoints = [];
        this.points = [];
        this.initControlPoints();
      }
      initControlPoints() {
        const segments = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < segments; i++) {
          this.controlPoints.push({
            x: this.startX + (this.endX - this.startX) * ((i + 1) / (segments + 1)),
            y: this.startY + (this.endY - this.startY) * ((i + 1) / (segments + 1)),
            offsetX: Math.random() * 100 - 50,
            offsetY: Math.random() * 100 - 50,
            phaseOffset: Math.random() * Math.PI * 2
          });
        }
      }
      update() {
        for (const point of this.controlPoints) {
          point.currentOffsetX = Math.sin(time * this.speed + point.phaseOffset) * point.offsetX;
          point.currentOffsetY = Math.cos(time * this.speed + point.phaseOffset) * point.offsetY;
        }
        this.points = [{ x: this.startX, y: this.startY }];
        for (const point of this.controlPoints) {
          this.points.push({
            x: point.x + point.currentOffsetX,
            y: point.y + point.currentOffsetY
          });
        }
        this.points.push({ x: this.endX, y: this.endY });
      }
      draw() {
        ctx.strokeStyle = `rgba(30, 30, 30, ${this.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length - 2; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        const last = this.points.length - 1;
        ctx.quadraticCurveTo(
          this.points[last - 2].x, this.points[last - 2].y,
          this.points[last].x, this.points[last].y
        );
        ctx.stroke();
      }
    }

    // Khởi tạo nodes
    function initNodes() {
      nodes = [];
      // Heaven region
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const bias = Math.sin(angle) * 0.4 + 0.5;
        const x = width * bias * 0.7 + width * 0.1;
        const y = height * 0.4 + Math.random() * height * 0.2;
        const size = Math.random() * 4 + 2;
        nodes.push(new Node(x, y, size, 'heaven'));
      }
      // Earth region
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width * 0.7 + width * 0.15;
        const y = height * 0.6 + Math.random() * height * 0.35;
        const size = Math.random() * 4 + 2;
        nodes.push(new Node(x, y, size, 'earth'));
      }
      // Vibe coder node
      nodes.push(new Node(width * 0.15, height * 0.5, 6, 'vibe'));
    }

    // Khởi tạo các đường flow
    function initFlowingPaths() {
      flowingPaths = [];
      for (let i = 0; i < 10; i++) {
        const heaven = nodes[Math.floor(Math.random() * 12)];
        const earth = nodes[12 + Math.floor(Math.random() * 30)];
        flowingPaths.push(new FlowingPath(heaven.x, heaven.y, earth.x, earth.y, 0.008 + Math.random() * 0.01));
      }
    }

    // Tạo kết nối giữa các node
    function createConnections() {
      connections = [];
      for (let i = 0; i < 8; i++) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a !== b) {
          connections.push([a, b]);
        }
      }
    }

    // Vẽ các kết nối
    function drawConnections() {
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      for (const [a, b] of connections) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Animation loop
    function animate() {
      time += 0.5;
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      for (const path of flowingPaths) {
        path.update();
        path.draw();
      }
      for (const node of nodes) {
        node.update();
      }
      if (time % 30 === 0) {
        createConnections();
      }
      drawConnections();
      for (const node of nodes) {
        node.draw();
      }
      // Vibe coder node effect
      const vibe = nodes[nodes.length - 1];
      ctx.save();
      ctx.translate(vibe.x, vibe.y);
      const numLines = 20;
      for (let i = 0; i < numLines; i++) {
        const angle = i / numLines * Math.PI * 2;
        const length = 20 + Math.sin(angle * 3 + time * 0.05) * 10;
        ctx.strokeStyle = `rgba(20, 20, 20, 0.1)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
        ctx.stroke();
      }
      ctx.restore();
      animationFrame = requestAnimationFrame(animate);
    }

    // Start
    initNodes();
    initFlowingPaths();
    createConnections();
    animate();
    animationUtils.fadeOutLoader(container);
    // Cleanup
    return {
      cleanup: () => {
        cancelAnimationFrame(animationFrame);
        nodes.length = 0;
        flowingPaths.length = 0;
        connections.length = 0;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter20FlowingPaths;
