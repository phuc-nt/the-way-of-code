// chapter2-tessellation.js - Animation cho Chapter 2
// Visualization của tessellation patterns sử dụng Canvas 2D API

import animationUtils from './animation-utils.js';

const chapter2Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    SCALE: 60,               // Kích thước cơ bản của mỗi tile
    gridSize: 4,             // Số lượng tiles mỗi chiều của grid
    animationSpeed: 0.01,    // Tốc độ animation
    colors: animationUtils.colors,  // Sử dụng màu từ config chung
    lineOpacity: 0.4        // Opacity cho các đường vẽ
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    
    // Tạo canvas mới
    const canvas = animationUtils.createCanvas(container);
    if (!canvas) {
      return animationUtils.handleError(container, 'Không thể tạo canvas.');
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return animationUtils.handleError(container, 'Không thể tạo context 2D.');
    }
    
    // Đảm bảo canvas có kích thước đúng
    const { width, height } = animationUtils.getContainerDimensions(container);
    const dpr = animationUtils.getDevicePixelRatio();
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale context để khớp với device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Biến nội bộ
    let animationFrameId = null;
    let time = 0;
    
    // Draw hexagonal tile - where elegance emerges from simple geometry
    function drawTile(cx, cy, size, rotation, phase, morph) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      
      // Draw outer hexagon - the form that contains opposites
      ctx.beginPath();
      const points = 6;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = size * (1 + Math.sin(phase + i) * 0.1);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      // Sử dụng màu từ config với opacity
      const opacity = chapter2Animation.settings.lineOpacity;
      ctx.strokeStyle = `${chapter2Animation.settings.colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw internal structure - the quiet example within
      for (let i = 0; i < points; i += 2) {
        const angle1 = (i / points) * Math.PI * 2;
        const angle2 = ((i + 2) / points) * Math.PI * 2;
        const r1 = size * (1 + Math.sin(phase + i) * 0.1);
        const r2 = size * (1 + Math.sin(phase + i + 2) * 0.1);
        
        // Outer points
        const x1 = Math.cos(angle1) * r1;
        const y1 = Math.sin(angle1) * r1;
        const x2 = Math.cos(angle2) * r2;
        const y2 = Math.sin(angle2) * r2;
        
        // Inner point with morph
        const midAngle = (angle1 + angle2) / 2;
        const innerR = size * 0.5 * (1 + morph * 0.5);
        const xi = Math.cos(midAngle) * innerR;
        const yi = Math.sin(midAngle) * innerR;
        
        // Draw connection lines
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(xi, yi);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(xi, yi);
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Create hexagonal grid - a field where creation and dissolution dance
    function createTessellationField(offsetX, offsetY, fieldScale, timeOffset) {
      const gridSize = chapter2Animation.settings.gridSize;
      const spacing = chapter2Animation.settings.SCALE * fieldScale * 0.8;
      
      for (let row = -gridSize; row <= gridSize; row++) {
        const rowOffset = (row % 2) * spacing * 0.5;
        for (let col = -gridSize; col <= gridSize; col++) {
          const x = (col * spacing * 0.866) + rowOffset + offsetX;
          const y = row * spacing * 0.75 + offsetY;
          const dist = Math.sqrt(x * x + y * y);
          
          // Skip tiles that are too far from center
          if (dist > chapter2Animation.settings.SCALE * fieldScale * 2.5) continue;
          
          // Calculate tile properties
          const angle = Math.atan2(y - offsetY, x - offsetX);
          const phase = (time + timeOffset) + dist * 0.01;
          const morph = Math.sin(phase + angle) * 0.5 + 0.5;
          
          drawTile(
            width/2 + x,
            height/2 + y,
            chapter2Animation.settings.SCALE * fieldScale * 0.4 * (1 - dist/(chapter2Animation.settings.SCALE * fieldScale * 3) * 0.3),
            angle + (time + timeOffset) * 0.2,
            phase,
            morph
          );
        }
      }
    }
    
    // The eternal cycle of creation and letting go
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      time += chapter2Animation.settings.animationSpeed;
      
      ctx.fillStyle = chapter2Animation.settings.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      // Main tessellation field
      createTessellationField(0, 0, 1.5, 0);
      
      // Upper field with rotation
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(Math.PI/6);
      ctx.translate(-width/2, -height/2);
      createTessellationField(0, -100, 0.8, time * 0.2 + Math.PI/3);
      ctx.restore();
      
      // Lower field with rotation
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(-Math.PI/6);
      ctx.translate(-width/2, -height/2);
      createTessellationField(0, 100, 0.8, time * 0.2 - Math.PI/3);
      ctx.restore();
    }
    
    // Bắt đầu animation và ẩn loader
    animate();
    animationUtils.fadeOutLoader(container);
    
    // Handle window resize
    const handleResize = () => {
      const { width, height } = animationUtils.getContainerDimensions(container);
      const dpr = animationUtils.getDevicePixelRatio();
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        animationUtils.cleanupCanvas(canvas);
      }
    };
  }
};

export default chapter2Animation;
