// chapter8-waterascii.js
// Animation cho Chapter 8: Water ASCII
// Visualization: ASCII characters flow like water, seeking their natural level without effort
// Themes: water as highest good, finding low places, grace without force

import animationUtils from './animation-utils.js';

const chapter8Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    characters: '~≈≋⋿⊰⊱◟◝',
    rows: 25,
    cols: 52,
    // Pre-calculate constants
    centerPos: { x: 0.5, y: 0.5 },
    charLengthDivide4: null, // Sẽ được tính sau khi biết chiều dài của characters
    piTimes2: Math.PI * 2,
    updateInterval: 166 // ~166ms for animation update (0.6x original speed)
  },

  init(container) {
    if (!container) return null;
    
    // Biến theo dõi trạng thái
    const state = {
      frame: 0,
      lastUpdate: 0,
      animationFrameId: null
    };
    
    // Tính toán các giá trị hằng số phụ thuộc
    this.settings.charLengthDivide4 = this.settings.characters.length / 4;
    
    // Tạo container cho animation
    const canvas = document.createElement('div');
    canvas.style.margin = '0';
    canvas.style.background = animationUtils.colors.background;
    canvas.style.overflow = 'hidden';
    canvas.style.display = 'flex';
    canvas.style.alignItems = 'center';
    canvas.style.justifyContent = 'center';
    canvas.style.height = '100%';
    
    // Tạo container con
    const innerContainer = document.createElement('div');
    innerContainer.style.padding = '30px';
    innerContainer.style.position = 'relative';
    innerContainer.style.width = '100%';
    innerContainer.style.height = '100%';
    innerContainer.style.display = 'flex';
    innerContainer.style.alignItems = 'center';
    innerContainer.style.justifyContent = 'center';
    
    // Tạo pre element để hiển thị ASCII art
    const pre = document.createElement('pre');
    pre.style.fontFamily = 'monospace';
    pre.style.fontSize = '10px';
    pre.style.lineHeight = '1';
    pre.style.cursor = 'default';
    pre.style.userSelect = 'none';
    pre.style.margin = '0';
    pre.style.padding = '20px';
    
    // Thêm các element vào container
    innerContainer.appendChild(pre);
    canvas.appendChild(innerContainer);
    container.appendChild(canvas);
    
    // Ẩn loader nếu có
    const loader = container.querySelector('.animation-loader');
    if (loader) {
      loader.style.display = 'none';
    }

    // Hàm tạo ASCII art - giống như nước tìm đường đi tự nhiên
    const generateAscii = () => {
      const rowsArray = [];
      const frameDiv4 = state.frame / 6.7;  // Reduced speed
      const frameDiv5 = state.frame / 8.3;  // Reduced speed
      const frameDiv8 = state.frame / 13.3; // Reduced speed
      
      for (let y = 0; y < this.settings.rows; y++) {
        const yDivRows = y / this.settings.rows;
        const yDiv5 = y / 5;
        const yDiv3 = y / 3;
        let rowString = '';
        let rowOpacity = 1;
        
        for (let x = 0; x < this.settings.cols; x++) {
          const xDivCols = x / this.settings.cols;
          const xDiv3 = x / 3;
          const xDiv4 = x / 4;
          
          // Tính khoảng cách từ tâm (điểm cố định)
          const dx = xDivCols - this.settings.centerPos.x;
          const dy = yDivRows - this.settings.centerPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const distTimes10 = dist * 10;
          const distTimes5 = dist * 5;

          // Tạo mẫu sóng - duyên dáng chảy mà không cần ép buộc
          const wave = Math.sin(xDiv3 + yDiv5 + frameDiv4 + distTimes10) + 
                      Math.cos(xDiv4 - yDiv3 - frameDiv5) +
                      Math.sin(frameDiv8 + xDivCols * this.settings.piTimes2);

          // Chọn ký tự dựa trên giá trị sóng và khoảng cách
          const charValue = (wave + 2) * this.settings.charLengthDivide4 + distTimes5;
          const charIndex = Math.floor(Math.abs(charValue)) % this.settings.characters.length;
          
          // Tính độ mờ - ký tự tìm nơi thấp hơn như nước
          const opacity = Math.max(0.2, Math.min(0.8, 1 - dist + Math.sin(wave) / 3));
          
          // Đặt độ mờ hàng bằng trung bình của tất cả giá trị độ mờ trong hàng
          if (x === 0) rowOpacity = opacity;
          else rowOpacity = (rowOpacity + opacity) / 2;
          
          rowString += this.settings.characters[charIndex];
        }
        
        rowsArray.push({ text: rowString, opacity: rowOpacity });
      }
      return rowsArray;
    };

    // Render ASCII art
    const render = () => {
      const ascii = generateAscii();
      let html = '';
      
      ascii.forEach(row => {
        html += `<div style="opacity: ${row.opacity}; margin: 0; line-height: 1">${row.text}</div>`;
      });
      
      pre.innerHTML = html;
    };

    // Animation loop
    const animate = (timestamp) => {
      // Update only every ~166ms for performance
      const elapsed = timestamp - state.lastUpdate;
      
      if (elapsed > this.settings.updateInterval) {
        state.frame++;
        state.lastUpdate = timestamp;
        render();
      }
      
      state.animationFrameId = requestAnimationFrame(animate);
    };

    // Khởi chạy animation
    state.animationFrameId = requestAnimationFrame(animate);

    // Trả về object có hàm cleanup
    return {
      cleanup: () => {
        if (state.animationFrameId !== null) {
          cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = null;
        }
        
        // Dọn dẹp DOM nếu cần
        if (container && container.contains(canvas)) {
          container.removeChild(canvas);
        }
      }
    };
  }
};

export default chapter8Animation;
