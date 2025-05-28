// chapter12-metamorphosis.js - Animation cho Chapter 12
// Visualization về "sự đơn giản hóa" - chuyển đổi từ phức tạp bên ngoài đến đơn giản bên trong

import animationUtils from './animation-utils.js';

const chapter12Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors, // Sử dụng màu từ config chung
    numLines: 120,           // Số lượng đường vẽ ngang
    lineSegments: 180,       // Số điểm trên mỗi đường
    lineAlpha: 0.5,          // Độ mờ đục của đường
    lineWidth: 0.6,          // Độ dày của đường
    morphSpeed: 0.0005,      // Tốc độ biến hình
    rotateSpeed: 0.00025     // Tốc độ quay
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    
    // Khởi tạo canvas và context
    const canvas = animationUtils.createCanvas(container);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Các biến nội bộ
    let animationFrameId = null;
    let time = 2000; // Bắt đầu sau một khoảng tạm dừng ban đầu
    
    // Form definitions - các hình dáng từ phức tạp bên ngoài đến đơn giản bên trong
    const forms = [
      // Form 1: Draped cloth-like shape - hình dạng rủ xuống như vải
      (u, v, t) => {
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI;
        
        let r = 120 + 30 * Math.sin(phi * 4 + theta * 2);
        r += 20 * Math.sin(phi * 6) * Math.cos(theta * 3);
        
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi) + 20 * Math.sin(theta * 5 + phi * 3);
        
        return { x, y, z };
      },
      
      // Form 2: More angular folded shape - hình dạng gấp khúc góc cạnh
      (u, v, t) => {
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI;
        
        let r = 150 + 20 * Math.cos(phi * 8);
        r *= 0.8 + 0.2 * Math.abs(Math.cos(theta * 2));
        
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi) * (0.8 + 0.3 * Math.sin(theta * 4));
        
        return { x, y, z };
      },
      
      // Form 3: Organic bulbous shape - hình dạng phồng tự nhiên
      (u, v, t) => {
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI;
        
        let r = 120;
        r += 50 * Math.sin(phi * 3) * Math.sin(theta * 2.5);
        r += 30 * Math.cos(phi * 5 + theta);
        
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);
        
        // Create some hollow areas - tạo các vùng rỗng
        const hollow = Math.max(0, Math.sin(phi * 2 + theta * 3) - 0.7);
        r *= 1 - hollow * 0.8;
        
        return { x, y, z };
      }
    ];
    
    // Interpolate between forms - hàm nội suy giữa các hình dạng
    const interpolateForms = (formA, formB, u, v, t, blend) => {
      const pointA = formA(u, v, t);
      const pointB = formB(u, v, t);
      
      return {
        x: pointA.x * (1 - blend) + pointB.x * blend,
        y: pointA.y * (1 - blend) + pointB.y * blend,
        z: pointA.z * (1 - blend) + pointB.z * blend
      };
    };
    
    // Get the current form - lấy hình dạng hiện tại
    const getCurrentForm = (u, v, t) => {
      // Calculate which two forms to blend between
      const totalForms = forms.length;
      const cycleTime = 600; // Thời gian để hoàn thành một chu kỳ
      const position = (t % (cycleTime * totalForms)) / cycleTime;
      const formIndex = Math.floor(position);
      const nextFormIndex = (formIndex + 1) % totalForms;
      
      // Calculate blend with ease in-out
      let rawBlend = position - formIndex;
      
      // No pause between transitions
      const pauseTime = 0;
      const transitionTime = 1 - (pauseTime * 2); // Thời gian còn lại cho quá trình chuyển đổi
      
      let blend;
      if (rawBlend < pauseTime) {
        // Initial pause
        blend = 0;
      } else if (rawBlend > (1 - pauseTime)) {
        // End pause
        blend = 1;
      } else {
        // Transition with easing
        const normalizedTime = (rawBlend - pauseTime) / transitionTime;
        // Ease in-out cubic
        blend = normalizedTime < 0.5
          ? 4 * normalizedTime * normalizedTime * normalizedTime
          : 1 - Math.pow(-2 * normalizedTime + 2, 3) / 2;
      }
      
      return interpolateForms(
        forms[formIndex], 
        forms[nextFormIndex], 
        u, v, t, blend
      );
    };
    
    // Animation loop - vòng lặp animation
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = this.settings.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      // Tính toán quay dựa trên thời gian
      const rotateX = Math.sin(time * this.settings.rotateSpeed) * 0.5;
      const rotateY = Math.cos(time * this.settings.rotateSpeed * 0.7) * 0.3;
      const rotateZ = time * this.settings.rotateSpeed * 0.1;
      
      // Draw horizontal contour lines - vẽ các đường viền ngang
      for (let i = 0; i < this.settings.numLines; i++) {
        const v = i / (this.settings.numLines - 1);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(51, 51, 51, ${this.settings.lineAlpha})`;
        ctx.lineWidth = this.settings.lineWidth;
        
        let lastPointVisible = false;
        let lastPoint = null;
        
        for (let j = 0; j <= this.settings.lineSegments; j++) {
          const u = j / this.settings.lineSegments;
          
          // Get the current form - lấy hình dạng hiện tại
          const point = getCurrentForm(u, v, time);
          
          // Apply rotation - áp dụng quay
          const rotatedX = point.x * Math.cos(rotateZ) - point.y * Math.sin(rotateZ);
          const rotatedY = point.x * Math.sin(rotateZ) + point.y * Math.cos(rotateZ);
          const rotatedZ = point.z;
          
          // Project to screen - chiếu lên màn hình
          const scale = 1.5 + rotatedZ * 0.001;
          const projX = width / 2 + rotatedX * scale;
          const projY = height / 2 + rotatedY * scale;
          
          // Check if point should be visible (simple back-face culling)
          const pointVisible = rotatedZ > -50;
          
          if (j === 0) {
            if (pointVisible) {
              ctx.moveTo(projX, projY);
              lastPointVisible = true;
              lastPoint = { x: projX, y: projY };
            }
          } else {
            if (pointVisible && lastPointVisible) {
              ctx.lineTo(projX, projY);
            } else if (pointVisible && !lastPointVisible) {
              ctx.moveTo(projX, projY);
            }
          }
          
          lastPointVisible = pointVisible;
          lastPoint = { x: projX, y: projY };
        }
        
        ctx.stroke();
      }
      
      // Draw vertical contour lines (fewer) - vẽ các đường viền dọc (ít hơn)
      for (let i = 0; i < this.settings.numLines * 0.3; i++) {
        const u = i / (this.settings.numLines * 0.3 - 1);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(51, 51, 51, ${this.settings.lineAlpha * 0.7})`;
        ctx.lineWidth = this.settings.lineWidth * 0.7;
        
        let lastPointVisible = false;
        let lastPoint = null;
        
        for (let j = 0; j <= this.settings.lineSegments * 0.5; j++) {
          const v = j / (this.settings.lineSegments * 0.5);
          
          // Get the current form
          const point = getCurrentForm(u, v, time);
          
          // Apply rotation
          const rotatedX = point.x * Math.cos(rotateZ) - point.y * Math.sin(rotateZ);
          const rotatedY = point.x * Math.sin(rotateZ) + point.y * Math.cos(rotateZ);
          const rotatedZ = point.z;
          
          // Project to screen
          const scale = 1.5 + rotatedZ * 0.001;
          const projX = width / 2 + rotatedX * scale;
          const projY = height / 2 + rotatedY * scale;
          
          // Check if point should be visible
          const pointVisible = rotatedZ > -50;
          
          if (j === 0) {
            if (pointVisible) {
              ctx.moveTo(projX, projY);
              lastPointVisible = true;
              lastPoint = { x: projX, y: projY };
            }
          } else {
            if (pointVisible && lastPointVisible) {
              ctx.lineTo(projX, projY);
            } else if (pointVisible && !lastPointVisible) {
              ctx.moveTo(projX, projY);
            }
          }
          
          lastPointVisible = pointVisible;
          lastPoint = { x: projX, y: projY };
        }
        
        ctx.stroke();
      }
      
      time += 0.5;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Khởi động animation
    animate();
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object có hàm cleanup
    return {
      cleanup: () => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        // Xóa canvas
        if (canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (container.contains(canvas)) {
            container.removeChild(canvas);
          }
        }
      }
    };
  }
};

export default chapter12Animation;
