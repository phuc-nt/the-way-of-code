import metadata from './metadata/index.js';
import loaders from './loaders/index.js';

// animation-manager.js - Hệ thống quản lý animation trung tâm
// Phần chính quản lý và khởi tạo animation dựa trên chapter ID

// Đối tượng quản lý animation tổng
const animationManager = {
  instance: null,
  
  // Object chứa các thông tin metadata về các animation
  metadata,
  
  // Hàm dọn dẹp current instance trước khi tạo mới
  cleanup() {
    if (this.instance && typeof this.instance.cleanup === 'function') {
      this.instance.cleanup();
      this.instance = null;
    }
  },
  
  // Hiển thị hoặc tạo loader element
  setupLoader(container) {
    if (!container) return null;
    
    // Đảm bảo loader hiển thị khi animation đang tải
    let loaderElement = container.querySelector('.animation-loader');
    
    // Nếu không tìm thấy loader, tạo một cái mới
    if (!loaderElement) {
      loaderElement = document.createElement('div');
      loaderElement.className = 'animation-loader';
      loaderElement.innerHTML = '<div><span class="loading-text">Đang tải hiệu ứng visual...</span>' + 
                              '<noscript>JavaScript cần được bật để hiển thị hiệu ứng</noscript></div>';
      container.appendChild(loaderElement);
    } else {
      // Nếu đã tồn tại, đảm bảo nó hiển thị
      loaderElement.style.display = 'flex';
    }
    
    return loaderElement;
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
  
  // Hàm khởi tạo animation dựa trên chapter ID 
  initAnimation(containerId, chapterId) {
    // Dọn dẹp animation hiện tại nếu có
    this.cleanup();
    
    // Tìm container
    const container = document.getElementById(containerId);
    if (!container) {
      return this.handleError(container, "Không tìm thấy container.");
    }
    
    // Hiển thị loader
    this.setupLoader(container);
    
    // Xác định animation cần khởi tạo dựa trên chapter ID
    try {
      if (!this.metadata[chapterId]) {
        return this.handleError(container, `Không có animation cho chapter ${chapterId}.`);
      }
      const animationName = this.metadata[chapterId].name;
      const loader = loaders[animationName];
      if (loader) {
        loader()
          .then(module => {
            this.instance = module.default.init(container);
          })
          .catch(error => {
            this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
          });
      } else {
        return this.handleError(container, `Không tìm thấy loader cho animation "${animationName}"`);
      }
    } catch (error) {
      return this.handleError(container, `Lỗi không xác định: ${error.message}`);
    }
  }
};

// Đảm bảo animationManager gắn vào window để main.js có thể gọi
if (typeof window !== 'undefined') {
  window.animationManager = animationManager;
}

// Export để sử dụng từ nơi khác
export default animationManager;