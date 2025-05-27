// chapter4-verticalbars.js
// Animation cho Chapter 4: Vertical Bars
// Visualization: Vertical patterns that endlessly transform, showing how complexity resolves into fluid motion
// Themes: inexhaustible source, smoothing complexity, effortless flow

import animationUtils from './animation-utils.js';

const chapter4Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550,
    numLines: 60,
    animationSpeed: 0.0025
  },
  
  init(container) {
    if (!container) return null;
    
    // Tạo canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.settings.width;
    canvas.height = this.settings.height;
    canvas.style.display = 'block';
    
    // Thêm canvas vào container
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return animationUtils.handleError(container, "Canvas context không khả dụng");
    }
    
    let scrollPosition = 0;
    let animationFrameId = null;
    
    const lineSpacing = canvas.width / this.settings.numLines;
    
    // Create two different patterns - complexity arising from the inexhaustible source
    const createPattern = (offset) => {
      const pattern = [];
      for (let i = 0; i < this.settings.numLines; i++) {
        const bars = [];
        const numBars = 10 + Math.sin(i * 0.3 + offset) * 5;
        
        for (let j = 0; j < numBars; j++) {
          bars.push({
            y: (j / numBars) * canvas.height + Math.sin(i * 0.5 + j * 0.3 + offset) * 30,
            height: 5 + Math.sin(i * 0.2 + j * 0.4) * 3,
            width: 2 + Math.cos(i * 0.3) * 2
          });
        }
        pattern.push(bars);
      }
      return pattern;
    };
    
    const pattern1 = createPattern(0);
    const pattern2 = createPattern(Math.PI);
    
    const animate = () => {
      // Tiến độ animation
      scrollPosition += this.settings.animationSpeed;
      const scrollFactor = (Math.sin(scrollPosition) + 1) / 2;
      
      // Clear canvas
      ctx.fillStyle = this.settings.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw lines and interpolated bars - smoothing sharp edges into gentle flow
      for (let i = 0; i < this.settings.numLines; i++) {
        const x = i * lineSpacing + lineSpacing / 2;
        
        // Draw vertical line
        ctx.beginPath();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        // Interpolate between patterns - effortless transformation
        const bars1 = pattern1[i];
        const bars2 = pattern2[i];
        const maxBars = Math.max(bars1.length, bars2.length);
        
        for (let j = 0; j < maxBars; j++) {
          const bar1 = bars1[j] || bars2[j];
          const bar2 = bars2[j] || bars1[j];
          
          const y = bar1.y + (bar2.y - bar1.y) * scrollFactor;
          const height = bar1.height + (bar2.height - bar1.height) * scrollFactor;
          const width = bar1.width + (bar2.width - bar1.width) * scrollFactor;
          
          ctx.fillStyle = '#222';
          ctx.fillRect(x - width/2, y - height/2, width, height);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Bắt đầu animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object với hàm cleanup
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        
        scrollPosition = 0;
      }
    };
  }
};

export default chapter4Animation;
