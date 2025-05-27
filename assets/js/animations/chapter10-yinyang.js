// animation cho Chapter 10
// Visualization của wavy yin-yang - hiện diện và dẫn dắt mà không kiểm soát

import animationUtils from './animation-utils.js';

const chapter10Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    maxRadius: 550 * 0.45,  // 45% của kích thước canvas
    lineSpacing: 3,         // Khoảng cách giữa các đường tròn
    waveAmplitude: 2,       // Độ cao sóng
    waveFrequency: 8,       // Tần số sóng
    animationSpeed: 0.015,  // Tốc độ animation
    lineOpacity: 0.3,       // Độ trong suốt của phần âm
    lineWidth: 0.6         // Độ dày của đường
  },
  
  init(container) {
    if (!container) return null;
    
    // Tạo canvas mới
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = animationUtils.getDevicePixelRatio();
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return animationUtils.handleError(container, 'Không thể tạo context 2D.');
    }
    
    // Scale context để khớp với device pixel ratio
    ctx.scale(dpr, dpr);
    
    let animationFrameId = null;
    let time = 0;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    
    const draw = () => {
      // Xóa canvas
      ctx.fillStyle = this.settings.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      // Vẽ các đường tròn đồng tâm có sóng
      for (let r = 5; r < maxRadius; r += this.settings.lineSpacing) {
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = this.settings.lineWidth;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
          // Animate sóng theo thời gian
          const wave = Math.sin(angle * this.settings.waveFrequency + r * 0.1 + time) * 
                      this.settings.waveAmplitude;
          const x = centerX + (r + wave) * Math.cos(angle);
          const y = centerY + (r + wave) * Math.sin(angle);
          
          // Tạo ranh giới âm dương
          const isYin = (angle > Math.PI) ? 
            (Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - (centerY + maxRadius/4), 2)) < maxRadius/4) :
            (Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - (centerY - maxRadius/4), 2)) > maxRadius/4);
          
          if (isYin) {
            ctx.strokeStyle = `rgba(0,0,0,${this.settings.lineOpacity})`;
          } else {
            ctx.strokeStyle = this.settings.colors.primary;
          }
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Tiếp tục animation
      time += this.settings.animationSpeed;
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Bắt đầu animation và ẩn loader
    draw();
    animationUtils.fadeOutLoader(container);
    
    // Xử lý thay đổi kích thước
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
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
        }
        
        if (container.contains(canvas)) {
          container.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter10Animation;
