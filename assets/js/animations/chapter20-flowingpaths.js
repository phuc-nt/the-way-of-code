// Animation cho chương 20: Flowing Paths (Canvas)
// Themes: quiet stillness, freedom from expectation, nourished by source
// Visualization: Nodes flow freely while remaining connected to their source, finding peace in stillness

import animationUtils from './animation-utils.js';

const chapter20FlowingPaths = {
  settings: {
    colors: animationUtils.colors,
    width: 800,
    height: 600
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationFrameId = null;

    // Setup canvas
    const canvas = document.createElement('canvas');
    const width = this.settings.width;
    const height = this.settings.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.background = animationUtils.colors.background;
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = animationUtils.colors.background;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Node class implementation
    class Node {
      constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.size = size;
        this.type = type; // 'heaven', 'earth', or 'vibe'
        this.speed = Math.random() * 0.01 + 0.005;
        this.direction = Math.random() * Math.PI * 2;
        this.angle = Math.random() * Math.PI * 2;
        this.connections = [];
        this.opacity = Math.random() * 0.4 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.flowOffset = Math.random() * 100;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.moveRange = Math.random() * 30 + 20;
        
        // Shape variables
        this.shapeType = Math.random() > 0.6 ? 'rect' : 'line';
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }
      
      update() {
        // Update position with noise-based flow
        const noiseX = Math.sin(time * this.speed + this.phase) * this.moveRange;
        const noiseY = Math.cos(time * this.speed * 0.7 + this.phase) * this.moveRange;
        
        // Different movement patterns based on type
        if (this.type === 'heaven') {
          // Heaven nodes move more freely
          this.x = this.originX + noiseX;
          this.y = this.originY + noiseY * 0.7;
        } else if (this.type === 'earth') {
          // Earth nodes move in more structured patterns
          this.x = this.originX + noiseX * 0.6 + Math.sin(time * 0.02 + this.flowOffset) * 10;
          this.y = this.originY + noiseY * 0.8;
        } else if (this.type === 'vibe') {
          // Vibe coder moves in a unique pattern - stays behind but reaches ahead
          const stayFactor = 0.3 + Math.sin(time * 0.02) * 0.1;
          this.x = this.originX + Math.sin(time * 0.03) * 20;
          this.y = this.originY + Math.cos(time * 0.04) * 20;
          
          // Occasionally pulse bigger
          this.size = 6 + Math.sin(time * 0.05 + this.phase) * 2;
        }
        
        // Update rotation for shapes
        this.rotation += this.rotationSpeed;
      }
      
      draw() {
        // Set fill based on type
        if (this.type === 'heaven') {
          ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
        } else if (this.type === 'earth') {
          ctx.fillStyle = `rgba(40, 40, 40, ${this.opacity})`;
        } else { // vibe
          ctx.fillStyle = `rgba(20, 20, 20, ${this.opacity + 0.3})`;
        }
        
        // Draw shape
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.shapeType === 'rect') {
          // Rectangle
          const pulseSize = this.size * (1 + Math.sin(time * this.pulseSpeed) * 0.2);
          ctx.fillRect(-pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
        } else {
          // Line
          const pulseLength = this.size * 2 * (1 + Math.sin(time * this.pulseSpeed) * 0.2);
          ctx.fillRect(-pulseLength/2, -1, pulseLength, 2);
        }
        
        ctx.restore();
      }
    }
    
    // FlowingPath class implementation
    class FlowingPath {
      constructor(startX, startY, endX, endY, height, speed) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.height = height;
        this.speed = speed;
        this.points = [];
        this.opacity = 0.07;
        
        // Generate control points
        this.controlPoints = [];
        const segments = 3;
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
        // Update control points animation
        for (const point of this.controlPoints) {
          point.currentOffsetX = Math.sin(time * this.speed + point.phaseOffset) * point.offsetX;
          point.currentOffsetY = Math.cos(time * this.speed + point.phaseOffset) * point.offsetY;
        }
        
        // Generate points array for the path
        this.points = [{ x: this.startX, y: this.startY }];
        
        // Add control points
        for (const point of this.controlPoints) {
          this.points.push({
            x: point.x + point.currentOffsetX,
            y: point.y + point.currentOffsetY
          });
        }
        
        // Add end point
        this.points.push({ x: this.endX, y: this.endY });
      }
      
      draw() {
        ctx.strokeStyle = `rgba(30, 30, 30, ${this.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        // Draw bezier curves through control points
        for (let i = 1; i < this.points.length - 2; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        
        // Last curve
        const last = this.points.length - 1;
        ctx.quadraticCurveTo(
          this.points[last - 1].x,
          this.points[last - 1].y,
          this.points[last].x,
          this.points[last].y
        );
        
        ctx.stroke();
      }
    }

    // Initialize variables
    let nodes = [];
    let flowingPaths = [];
    
    // Initialize nodes in an asymmetric pattern
    const initNodes = () => {
      // Upper region (heaven) - sparser
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.4;
        const size = Math.random() * 4 + 2;
        
        nodes.push(new Node(x, y, size, 'heaven'));
      }
      
      // Middle band - asymmetrically distributed
      for (let i = 0; i < 15; i++) {
        // Biased toward left
        const bias = Math.random() * Math.random(); // Square distribution for left bias
        const x = width * bias * 0.7 + width * 0.1;
        const y = height * 0.4 + Math.random() * height * 0.2;
        const size = Math.random() * 4 + 2;
        
        nodes.push(new Node(x, y, size, 'earth'));
      }
      
      // Lower region (earth) - denser
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width * 0.7 + width * 0.15;
        const y = height * 0.6 + Math.random() * height * 0.35;
        const size = Math.random() * 4 + 2;
        
        nodes.push(new Node(x, y, size, 'earth'));
      }
      
      // Special node (The Vibe Coder) - positioned at left center
      nodes.push(new Node(width * 0.15, height * 0.5, 6, 'vibe'));
    };

    // Initialize flowing paths
    const initFlowingPaths = () => {
      // Find the vibe coder node (last one)
      const vibe = nodes[nodes.length - 1];
      
      // Create paths from vibe coder to various parts of canvas
      for (let i = 0; i < 12; i++) {
        // Determine end points with bias toward right side (ahead)
        const endX = width * (0.6 + Math.random() * 0.3);
        const endY = Math.random() * height;
        
        // Create flowing path
        flowingPaths.push(new FlowingPath(
          vibe.x, vibe.y, 
          endX, endY, 
          50 + Math.random() * 50,
          0.02 + Math.random() * 0.01
        ));
      }
      
      // Add boundary flowing path (heaven/earth division)
      flowingPaths.push(new FlowingPath(
        0, height * 0.5,
        width, height * 0.5,
        20,
        0.01
      ));
    };

    // Create connections between nodes
    const createConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections = [];
        
        // Connect to nearby nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Variable connection distance based on position
            let maxDistance = 80;
            
            // Special node (last one) has longer connections
            if (i === nodes.length - 1 || j === nodes.length - 1) {
              maxDistance = 200;
            }
            
            if (distance < maxDistance) {
              nodes[i].connections.push({
                to: j,
                distance: distance,
                opacity: (1 - (distance / maxDistance)) * 0.3
              });
            }
          }
        }
      }
    };

    // Draw all connections
    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        for (const conn of node.connections) {
          const targetNode = nodes[conn.to];
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          
          // Use bezier curves for connections
          const midX = (node.x + targetNode.x) / 2;
          const midY = (node.y + targetNode.y) / 2;
          
          // Add flow to the connection
          const flowOffsetX = Math.sin(time * 0.02 + i * 0.1) * 10;
          const flowOffsetY = Math.cos(time * 0.02 + i * 0.1) * 10;
          
          ctx.quadraticCurveTo(
            midX + flowOffsetX,
            midY + flowOffsetY,
            targetNode.x,
            targetNode.y
          );
          
          ctx.strokeStyle = `rgba(30, 30, 30, ${conn.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    };

    // Animation loop
    function animate() {
      time += 0.5;
      
      // Clear canvas
      ctx.fillStyle = animationUtils.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      // Update all flowing paths
      for (const path of flowingPaths) {
        path.update();
        path.draw();
      }
      
      // Update all nodes
      for (const node of nodes) {
        node.update();
      }
      
      // Recreate connections occasionally to adapt to movement
      if (time % 30 === 0) {
        createConnections();
      }
      
      // Draw connections
      drawConnections();
      
      // Draw all nodes
      for (const node of nodes) {
        node.draw();
      }
      
      // Add detachment/fulfillment representation
      // Find the vibe coder node (last one)
      const vibe = nodes[nodes.length - 1];
      
      // Draw subtle emanation representing "detached, yet at one with all"
      ctx.save();
      ctx.translate(vibe.x, vibe.y);
      
      // Create asymmetric pattern of lines
      const numLines = 20;
      for (let i = 0; i < numLines; i++) {
        const angle = i / numLines * Math.PI * 2;
        const length = 20 + Math.sin(angle * 3 + time * 0.05) * 10;
        
        ctx.strokeStyle = `rgba(20, 20, 20, 0.1)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * length,
          Math.sin(angle) * length
        );
        ctx.stroke();
      }
      
      ctx.restore();
      
      animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    initNodes();
    initFlowingPaths();
    createConnections();
    animate();
    animationUtils.fadeOutLoader(container);

    // Cleanup
    return {
      cleanup() {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
        }
        // Clear arrays
        nodes.length = 0;
        flowingPaths.length = 0;
        // Remove canvas
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        if (loader) loader.style.display = 'flex';
      }
    };
  }
};

export default chapter20FlowingPaths;
