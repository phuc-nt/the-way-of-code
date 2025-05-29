// chapter30-dimensionalresonance.js - Animation cho Chapter 30
// Visualization: Forms guide each other through gentle influence, moving with nature's flow

import animationUtils from './animation-utils.js';

const chapter30Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    layerCount: 5,         // Số lớp hình dạng
    sizeFactor: 1.125,     // Hệ số kích thước (12.5% lớn hơn gốc)
    movementFactor: 1.1,   // Hệ số chuyển động - giảm từ 1.8 xuống 1.1
    rotationFactor: 1.8,   // Tăng cường hiệu ứng xoay
    colorPrimary: 'rgba(50, 50, 50, $$)' // Màu chính với opacity động
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    
    // Sử dụng hàm tiện ích để tạo canvas vuông chuẩn
    const canvas = animationUtils.createSquareCanvas(container);
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    
    // Configuration cho các lớp 3D
    const LAYER_COUNT = this.settings.layerCount;
    const layers = [];
    
    // Hình dạng cơ bản
    const baseForms = [
      { 
        centerX: 225 * this.settings.sizeFactor, 
        centerY: 200 * this.settings.sizeFactor, 
        radiusX: 100 * this.settings.sizeFactor, 
        radiusY: 100 * this.settings.sizeFactor, 
        rotation: 0, 
        phase: 0 
      },
      { 
        centerX: 350 * this.settings.sizeFactor, 
        centerY: 175 * this.settings.sizeFactor, 
        radiusX: 90 * this.settings.sizeFactor, 
        radiusY: 100 * this.settings.sizeFactor, 
        rotation: Math.PI / 6, 
        phase: 2 
      },
      { 
        centerX: 275 * this.settings.sizeFactor, 
        centerY: 325 * this.settings.sizeFactor, 
        radiusX: 100 * this.settings.sizeFactor, 
        radiusY: 90 * this.settings.sizeFactor, 
        rotation: -Math.PI / 4, 
        phase: 4 
      }
    ];
    
    // Hiển thị loader trong quá trình thiết lập
    const loader = container.querySelector('.animation-loader');
    
    // Thiết lập canvas và khởi tạo các lớp
    const setupCanvas = () => {
      // Điều chỉnh vị trí trung tâm của các hình dạng để phù hợp với canvas
      const centerAdjustX = (canvas.width / 2) - (275 * this.settings.sizeFactor);
      const centerAdjustY = (canvas.height / 2) - (225 * this.settings.sizeFactor);
      
      baseForms.forEach(form => {
        form.centerX += centerAdjustX;
        form.centerY += centerAdjustY;
      });
      
      // Mỗi lớp dẫn mà không cưỡng ép, tuân theo quy luật tự nhiên
      for (let i = 0; i < LAYER_COUNT; i++) {
        const depth = i / (LAYER_COUNT - 1); // 0 đến 1
        const layerForms = baseForms.map(baseForm => {
          // Tạo biến thể dựa trên độ sâu
          const scale = 0.8 + depth * 0.4; // Các lớp sâu hơn nhỏ hơn
          return {
            ...baseForm,
            centerX: baseForm.centerX + (depth - 0.5) * 30 * this.settings.sizeFactor, // Offset các lớp sâu hơn để tạo hiệu ứng parallax
            centerY: baseForm.centerY + (depth - 0.5) * 20 * this.settings.sizeFactor,
            radiusX: baseForm.radiusX * scale,
            radiusY: baseForm.radiusY * scale,
            rotation: baseForm.rotation + depth * Math.PI * 0.1, // Offset xoay nhẹ
            depth: depth,
            lineCount: Math.floor(30 - depth * 15), 
            lineWidth: 0.5 + depth * 0.7, 
            opacity: 0.2 + depth * 0.8, // Các lớp sâu hơn đặc hơn
            speed: (0.5 + depth * 1.5) * this.settings.movementFactor // Hệ số chuyển động đã giảm
          };
        });
        
        layers.push({
          depth: depth,
          forms: layerForms
        });
      }
    };
    
    // Vẽ hình xoắn ốc
    const drawSpiralForm = (form, lineCount) => {
      const { centerX, centerY, radiusX, radiusY, rotation, depth, lineWidth, opacity, speed } = form;
      
      // Chuyển động theo nhịp điệu bất tận của tự nhiên
      const breathFactor = Math.sin(time * 0.2 * speed + form.phase) * 0.15 * this.settings.movementFactor + 1;
      const currentRadiusX = radiusX * breathFactor;
      const currentRadiusY = radiusY * breathFactor;
      
      // Tăng cường hiệu ứng xoay qua lại
      const oscillatingRotation = Math.sin(time * 0.15) * 0.2 * this.settings.rotationFactor;
      const currentRotation = rotation + oscillatingRotation;
      
      for (let i = 0; i < lineCount; i++) {
        const scale = i / lineCount;
        const currentScale = scale * 0.9; // Để lại một lỗ nhỏ ở giữa
        
        ctx.beginPath();
        
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          const spiralOffset = angle * 0.2;
          const r = currentScale + Math.sin(angle * 10 + time * 0.1 * speed + form.phase) * 0.01 * this.settings.movementFactor;
          
          // Tính toán hiệu ứng sóng xoắn ốc - giảm biên độ
          const waveX = Math.sin(angle * 5 + time * 0.1 * speed) * radiusX * 0.05 * scale * this.settings.movementFactor;
          const waveY = Math.cos(angle * 5 + time * 0.1 * speed) * radiusY * 0.05 * scale * this.settings.movementFactor;
          
          // Tính vị trí với hiệu ứng xoay qua lại tăng cường
          const rX = currentRadiusX * r * Math.cos(angle + spiralOffset + currentRotation + time * 0.02 * speed);
          const rY = currentRadiusY * r * Math.sin(angle + spiralOffset + currentRotation + time * 0.02 * speed);
          
          const x = centerX + rX + waveX;
          const y = centerY + rY + waveY;
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        
        // Điều chỉnh độ mờ dựa trên tỷ lệ
        const lineOpacity = opacity * (0.2 + scale * 0.8);
        // Sử dụng màu xám đen cho màu dự án
        ctx.strokeStyle = this.settings.colorPrimary.replace('$$', lineOpacity);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };
    
    const render = () => {
      // Nền màu kem của dự án
      ctx.fillStyle = this.settings.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ các lớp từ sau ra trước
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        
        // Vẽ từng hình dạng trong lớp
        for (const form of layer.forms) {
          drawSpiralForm.call(this, form, form.lineCount);
        }
      }
      
      // Animation theo thời gian
      time += 0.005;
      animationFrameId = requestAnimationFrame(() => render.call(this));
    };
    
    setupCanvas.call(this);
    render.call(this);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object có hàm cleanup
    return {
      cleanup: () => {
        cancelAnimationFrame(animationFrameId);
        
        // Xóa canvas context
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Xóa mảng layers để ngăn memory leaks
        layers.length = 0;
        
        // Xóa canvas khỏi container
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter30Animation;
