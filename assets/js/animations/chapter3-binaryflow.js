// chapter3-binaryflow.js
// Animation cho Chapter 3: Binary Flow
// Visualization: Binary patterns that naturally erode and flow, demonstrating how emptiness enables movement
// Themes: emptiness vs expectation, natural self-sufficiency, action through non-action

import animationUtils from './animation-utils.js';

const chapter3Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    width: 65,
    height: 65,
    blockSize: 30,
    speed: 0.005,
    erosionSpeed: 0.0067
  },
  
  init(container) {
    if (!container) return null;
    
    // Các biến sử dụng trong animation
    let grid = [];
    let time = 0;
    let animationFrameId;
    
    // Tạo canvas chứa animation
    const canvas = document.createElement('div');
    canvas.style.lineHeight = '0.85';
    canvas.style.letterSpacing = '0.05em';
    canvas.style.color = 'rgba(0,0,0,0.85)';
    canvas.style.userSelect = 'none';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.overflow = 'hidden';
    canvas.style.display = 'flex';
    canvas.style.flexDirection = 'column';
    canvas.style.justifyContent = 'center';
    canvas.style.marginLeft = '10%';
    
    // Thêm canvas vào container
    container.appendChild(canvas);
    
    // Khởi tạo grid - emptying the mind of expectation
    function initGrid() {
      grid = [];
      for (let y = 0; y < this.settings.height; y++) {
        let row = [];
        for (let x = 0; x < this.settings.width; x++) {
          row.push(' ');
        }
        grid.push(row);
      }
    }
    
    // Render grid
    function render() {
      let html = '';
      for (let y = 0; y < this.settings.height; y++) {
        for (let x = 0; x < this.settings.width; x++) {
          html += grid[y][x];
        }
        html += '<br>';
      }
      canvas.innerHTML = html;
    }
    
    // Update grid
    function update() {
      initGrid.call(this); // Clear grid
      
      // Create a rigid structure - perfectly centered
      const blockSize = this.settings.blockSize;
      const blockX = Math.floor(this.settings.width / 2 - blockSize / 2);
      const blockY = Math.floor(this.settings.height / 2 - blockSize / 2);
      
      // Time-based flow with slower motion
      const t = time * this.settings.speed;
      
      // Draw water flow around and through the structure
      for (let y = 0; y < this.settings.height; y++) {
        for (let x = 0; x < this.settings.width; x++) {
          // Create block - structure yields to natural flow
          if (x >= blockX && x < blockX + blockSize && 
              y >= blockY && y < blockY + blockSize) {
            // The block is gradually being eroded
            const innerDist = Math.min(
              x - blockX, 
              blockX + blockSize - x,
              y - blockY,
              blockY + blockSize - y
            );
            
            // Erosion from edge inward (slower)
            const erosion = time * this.settings.erosionSpeed;
            if (innerDist > erosion) {
              grid[y][x] = '1';
            } else {
              // Transition zone - less random
              grid[y][x] = Math.random() > 0.8 ? '1' : '0';
            }
          } else {
            // Water flow pattern - natural self-sufficiency in motion
            const dx = x - this.settings.width / 2;
            const dy = y - this.settings.height / 2;
            const angle = Math.atan2(dy, dx);
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Create fluid pattern resembling water - smoother transitions
            const wave = Math.sin(dist * 0.2 - t + angle * 1.5);
            const flow = Math.sin(x * 0.08 + y * 0.04 + t * 0.4);
            
            // Use a threshold that creates less flickering
            if (flow + wave > 0.4) {
              grid[y][x] = '0';
            } else if (flow + wave < -0.4) {
              grid[y][x] = '~';
            }
          }
        }
      }
      
      // Add cracks to the block
      for (let i = 0; i < 5; i++) {
        const crackX = blockX + Math.floor(Math.random() * blockSize);
        const crackY = blockY + Math.floor(Math.random() * blockSize);
        const length = Math.floor(Math.random() * 10) + 5;
        let cx = Math.floor(crackX);
        let cy = Math.floor(crackY);
        
        for (let j = 0; j < length; j++) {
          if (cx >= 0 && cx < this.settings.width && cy >= 0 && cy < this.settings.height) {
            grid[cy][cx] = '0';
          }
          // Move in random direction
          cx += Math.floor(Math.random() * 3) - 1;
          cy += Math.floor(Math.random() * 3) - 1;
        }
      }
      
      time++;
    }
    
    // Animation loop
    function animate() {
      update.call(chapter3Animation);
      render.call(chapter3Animation);
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Khởi tạo animation
    initGrid.call(this);
    animationFrameId = requestAnimationFrame(animate);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Return object with cleanup method
    return {
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        
        grid = [];
        time = 0;
      }
    };
  }
};

export default chapter3Animation;
