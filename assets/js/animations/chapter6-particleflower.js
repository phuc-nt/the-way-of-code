// chapter6-particleflower.js
// Animation cho Chapter 6: Particle Flower
// Visualization: Particles bloom and flow from a central source, embodying the eternal creative feminine
// Themes: feminine creative force, eternal fertility, root energy

import animationUtils from './animation-utils.js';

const chapter6Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550,
    particleCount: 30000,
    formScale: 2.4,
    targetFPS: 10, // Equivalent to 100ms setInterval
    frameInterval: 100 // 1000 / targetFPS
  },
  
  init(container) {
    if (!container) return null;
    
    // Tạo canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.settings.width;
    canvas.height = this.settings.height;
    canvas.style.display = 'block';
    canvas.style.width = this.settings.width + 'px';
    canvas.style.height = this.settings.height + 'px';
    
    // Thêm canvas vào container
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return animationUtils.handleError(container, "Canvas context không khả dụng");
    }
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Biến để lưu trữ dữ liệu animation
    let time = 0;
    let animationFrameId = null;
    let lastFrameTime = 0;
    
    // Tạo particles - seeds of the eternal feminine
    const particles = [];
    for (let i = 0; i < this.settings.particleCount; i++) {
      // Start with a more converged form
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * this.settings.formScale * 0.5 * 150; // Tighter radius
      const height = (Math.random() * 2 - 1) * this.settings.formScale * 0.3; // Less vertical spread
      
      // Calculate initial flow influence - root energy spiraling outward
      const angle = theta;
      const dist = r / 150;
      const flow = Math.sin(angle * 2 + height * 2) * 0.03;
      const counterFlow = Math.cos(angle * 2 - height * 2) * 0.03;
      const blend = (Math.sin(height * Math.PI) + 1) * 0.5;
      const combinedFlow = flow * blend + counterFlow * (1 - blend);
      
      // Apply initial flow to starting position
      const dx = r * Math.cos(theta);
      const dy = r * Math.sin(theta);
      const containment = Math.pow(Math.min(1, dist / (this.settings.formScale * 0.8)), 4);
      const pull = containment * 0.1;
      
      particles.push({
        x: centerX + dx + (dx * combinedFlow) - (dx * pull),
        y: centerY + dy + (dy * combinedFlow) - (dy * pull),
        z: height,
        initialR: r,
        initialTheta: theta,
        initialHeight: height
      });
    }
    
    // Animation function with time delta control
    const animate = (currentTime) => {
      // Initialize lastFrameTime on first frame
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
      }
      
      const deltaTime = currentTime - lastFrameTime;
      
      // Only update animation when enough time has passed (mimics setInterval at 100ms)
      if (deltaTime >= this.settings.frameInterval) {
        // Using a fixed time increment for consistent animation
        time += 0.0005;
        
        // Clear with slight trails for ghosting effect
        // More transparent for smoother trails at lower frame rates
        ctx.fillStyle = 'rgba(240, 238, 230, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          // Get relative position to center
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) / 150; // Normalize distance
          const angle = Math.atan2(dy, dx);
          const height = particle.z / (this.settings.formScale * 0.4);
          
          const flow = Math.sin(angle * 2 - time * 0.5 + height * 2) * 0.015;
          const counterFlow = Math.cos(angle * 2 + time * 0.5 - height * 2) * 0.015;
          
          // Blend flows based on height
          const blend = (Math.sin(height * Math.PI) + 1) * 0.5;
          const combinedFlow = flow * blend + counterFlow * (1 - blend);
          
          // Strong containment
          const containment = Math.pow(Math.min(1, dist / (this.settings.formScale * 0.8)), 4);
          const pull = containment * 0.1;
          
          // Apply gentle balanced motion
          particle.x = particle.x + (dx * combinedFlow) - (dx * pull);
          particle.y = particle.y + (dy * combinedFlow) - (dy * pull);
          particle.z = particle.z + Math.sin(time * 0.15 + dist * 2) * 0.01;
          
          // Draw particle with depth-based opacity
          const depthFactor = 1 + particle.z * 0.5;
          const opacity = 0.35 * depthFactor;
          const size = Math.max(0.001, 0.6 * depthFactor); // Increased particle size by 20% from 0.5
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(51, 51, 51, ${opacity})`;
          ctx.fill();
        });
        
        // Update lastFrameTime, accounting for any remainder to prevent drift
        lastFrameTime = currentTime - (deltaTime % this.settings.frameInterval);
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Bắt đầu animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object với hàm cleanup
    return {
      cleanup: () => {
        // Dừng animation
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        // Xóa canvas
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Xóa canvas khỏi DOM
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        
        // Giải phóng bộ nhớ
        particles.length = 0;
      }
    };
  }
};

export default chapter6Animation;
