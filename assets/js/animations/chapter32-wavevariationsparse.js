// chapter32-wavevariationsparse.js - Animation cho Chapter 32
// Visualization: Waves flow naturally from an unrefined source, always returning home

import animationUtils from './animation-utils.js';

const chapter32Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    resolution: 4,              // Độ phân giải cho lưới wave
    backgroundColor: animationUtils.colors.background,  // Màu nền
    lineColor: '#333',          // Màu của đường sóng
    lineWidth: 1.2,             // Độ dày của đường
    targetFPS: 20               // FPS mục tiêu cho hoạt ảnh chạy mượt
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    
    // Sử dụng hàm tiện ích để tạo canvas vuông chuẩn
    const canvas = animationUtils.createSquareCanvas(container);
    
    const ctx = canvas.getContext('2d', { alpha: false });
    const width = canvas.width;
    const height = canvas.height;
    
    // Khởi tạo các biến cho animation
    const resolution = this.settings.resolution;
    const rows = Math.floor(height / resolution);
    const cols = Math.floor(width / resolution);
    let animationFrameId;
    let time = 0;
    let lastFrameTime = 0;
    
    // Tạo các điểm nguồn sóng
    const sources = [];
    const numSpirals = 1;         // Chỉ một nguồn xoáy
    const pointsPerSpiral = 5;    // Ít điểm để tạo mẫu thưa
    
    // Tạo các điểm nguồn không tinh chỉnh chảy như sông
    for (let i = 0; i < pointsPerSpiral; i++) {
      const t = i / pointsPerSpiral;
      const angle = t * 2 * Math.PI * 1.5; // Chỉ 1.5 vòng
      const radius = 100 + t * 150;        // Xoáy trôn ốc nhỏ gọn hơn
      
      sources.push({
        x: width/2 + Math.cos(angle) * radius,
        y: height/2 + Math.sin(angle) * radius,
        wavelength: 60 + t * 30,  // Bước sóng dài hơn
        phase: angle,
        amplitude: 1.0
      });
    }
    
    // Thêm một điểm trung tâm
    sources.push({
      x: width/2,
      y: height/2,
      wavelength: 80,
      phase: 0,
      amplitude: 1.5
    });
    
    // Tạo bộ đệm để vẽ trước khi hiển thị lên canvas chính
    const field = new Float32Array(rows * cols);
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const bufferCtx = bufferCanvas.getContext('2d', { alpha: false });
    
    // Hàm vẽ animation
    const animate = (currentTime) => {
      // Khởi tạo lastFrameTime khi frame đầu tiên
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
      }
      
      const deltaTime = currentTime - lastFrameTime;
      const frameInterval = 1000 / this.settings.targetFPS;
      
      // Chỉ cập nhật animation khi đủ thời gian
      if (deltaTime >= frameInterval) {
        // Tính phần dư để tránh trôi
        const remainder = deltaTime % frameInterval;
        
        // Cập nhật lastFrameTime với thời gian đã xử lý
        lastFrameTime = currentTime - remainder;
        
        // Xóa canvas đệm và đặt màu nền
        bufferCtx.fillStyle = this.settings.backgroundColor;
        bufferCtx.fillRect(0, 0, width, height);

        // Tính toán giá trị trường cho mỗi điểm
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const x = j * resolution;
            const y = i * resolution;
            let amplitude = 0;

            // Tính tổng biên độ từ tất cả các nguồn
            for (let s = 0; s < sources.length; s++) {
              const source = sources[s];
              const dx = x - source.x;
              const dy = y - source.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Giảm dần mạnh hơn để tạo không gian âm rõ ràng hơn
              const falloff = Math.exp(-distance / 250);
              
              amplitude += source.amplitude * falloff * 
                Math.sin((distance / source.wavelength - time) * 2 * Math.PI + source.phase);
            }

            field[i * cols + j] = amplitude;
          }
        }

        // Vẽ đường viền sóng
        bufferCtx.strokeStyle = this.settings.lineColor;
        bufferCtx.lineWidth = this.settings.lineWidth;
        bufferCtx.beginPath();
        
        // Chỉ hai mức đường viền cho đường tối thiểu
        const levels = [-0.2, 0.2];
        
        // Vẽ đường viền cho từng mức
        for (const level of levels) {
          for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
              const idx = i * cols + j;
              const x = j * resolution;
              const y = i * resolution;
              
              // Xác định các đỉnh
              const v00 = field[idx] > level;
              const v10 = field[idx + 1] > level;
              const v11 = field[idx + cols + 1] > level;
              const v01 = field[idx + cols] > level;
              
              // Vẽ đường khi có sự chuyển đổi giữa các đỉnh
              if (v00 !== v10) {
                bufferCtx.moveTo(x + resolution / 2, y);
                bufferCtx.lineTo(x + resolution, y + resolution / 2);
              }
              if (v10 !== v11) {
                bufferCtx.moveTo(x + resolution, y + resolution / 2);
                bufferCtx.lineTo(x + resolution / 2, y + resolution);
              }
              if (v11 !== v01) {
                bufferCtx.moveTo(x + resolution / 2, y + resolution);
                bufferCtx.lineTo(x, y + resolution / 2);
              }
              if (v01 !== v00) {
                bufferCtx.moveTo(x, y + resolution / 2);
                bufferCtx.lineTo(x + resolution / 2, y);
              }
            }
          }
        }
        
        bufferCtx.stroke();
        
        // Vẽ lên canvas chính
        ctx.drawImage(bufferCanvas, 0, 0);

        // Cập nhật thời gian, chậm để có hiệu ứng thiền
        time += 0.00075;
      }
      
      // Tiếp tục animation loop
      animationFrameId = requestAnimationFrame(animate);
    };

    // Bắt đầu animation loop
    animationFrameId = requestAnimationFrame(animate);
    
    // Ẩn loader khi animation bắt đầu
    animationUtils.fadeOutLoader(container);
    
    // Hàm dọn dẹp - hủy animation và giải phóng tài nguyên
    return function cleanup() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Xóa canvas để tránh rò rỉ bộ nhớ
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      
      // Xóa canvas đệm
      if (bufferCtx) {
        bufferCtx.clearRect(0, 0, width, height);
      }
      
      // Xóa mảng để tránh rò rỉ bộ nhớ
      sources.length = 0;
    };
  }
};

export default chapter32Animation;
