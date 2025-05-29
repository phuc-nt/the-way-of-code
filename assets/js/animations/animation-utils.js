// animation-utils.js - Các tiện ích dùng chung cho animation
// File này chứa các hàm tiện ích và cấu hình chung cho tất cả animations

const animationUtils = {
  // Các màu sắc và style mặc định giữ đồng bộ giữa các animation
  colors: {
    background: '#F0EEE6',
    primary: 'rgba(51, 51, 51, 0.4)',
    accent: '#3498db'
  },
  
  // Hiển thị hoặc ẩn loading element
  fadeOutLoader(container, duration = 500) {
    if (!container) return;
    
    const loaderElement = container.querySelector('.animation-loader');
    if (!loaderElement) return;
    
    // Fade out loader
    loaderElement.style.opacity = '0';
    // Sau khi fade xong, ẩn hoàn toàn
    setTimeout(() => {
      loaderElement.style.display = 'none';
    }, duration);
  },
  
  // Handle error khi không thể tải animation
  handleError(container, message) {
    console.error(message);
    const loaderElement = container.querySelector('.animation-loader');
    if (loaderElement) {
      loaderElement.innerHTML = `<div>Không thể tải hiệu ứng. ${message}</div>`;
    }
    return null;
  },
  
  // Lấy device pixel ratio phụ thuộc vào thiết bị
  getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, 2);
  },
  
  // Tạo và thiết lập canvas vuông chuẩn cho tất cả animation
  createSquareCanvas(container) {
    if (!container) return null;
    
    const canvas = document.createElement('canvas');
    // Sử dụng kích thước mặc định vuông
    canvas.width = this.settings.defaultWidth;
    canvas.height = this.settings.defaultHeight;
    container.appendChild(canvas);
    
    return canvas;
  },
  
  // Các thông số chung
  settings: {
    frameRate: 60,
    fadeTransitionDuration: 500, // thời gian fade in/out (ms)
    defaultWidth: 550,
    defaultHeight: 550 // Đặt chiều cao bằng chiều rộng để tạo hình vuông
  },
  
  // Hiển thị hoặc ẩn loading element
  fadeOutLoader(container, duration = 500) {
    if (!container) return;
    
    const loaderElement = container.querySelector('.animation-loader');
    if (!loaderElement) return;
    
    // Fade out loader
    loaderElement.style.opacity = '0';
    // Sau khi fade xong, ẩn hoàn toàn
    setTimeout(() => {
      loaderElement.style.display = 'none';
    }, duration);
  },
  
  // Xử lý responsive cho kích thước canvas
  getContainerDimensions(container) {
    if (!container) return { width: 550, height: 500 };
    
    return {
      width: container.clientWidth,
      height: container.clientHeight
    };
  },
  
  // Lấy device pixel ratio phụ thuộc vào thiết bị
  getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, 2);
  },
  
  // Khởi tạo canvas mới cho một container
  createCanvas(container) {
    if (!container) return null;
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    const { width, height } = this.getContainerDimensions(container);
    const dpr = this.getDevicePixelRatio();
    
    // Set kích thước vật lý của canvas (pixels)
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Set kích thước hiển thị (CSS)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    return canvas;
  },
  
  // Clean up canvas và context
  cleanupCanvas(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
};

export default animationUtils;
