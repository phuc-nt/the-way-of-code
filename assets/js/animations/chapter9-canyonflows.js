// chapter9-canyonflows.js
// Animation cho Chapter 9: Canyon Multi-Layer Flows
// Visualization: Particles flow naturally downward, neither clinging nor overflowing
// Themes: excess leads to loss, detachment after completion, the way of heaven

import animationUtils from './animation-utils.js';

const chapter9Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    width: 550,
    height: 550,
    particleCount: 20000, // Giảm số lượng hạt để có hiệu ứng mềm mại hơn
    wallLayers: 8,
    colors: {
      background: 'rgba(240, 238, 230, 0.05)' // Màu nền với độ mờ
    }
  },
  
  init(container) {
    if (!container) return null;
    
    // Biến theo dõi trạng thái
    const state = {
      time: 0,
      animationFrameId: null,
      particles: []
    };
    
    // Tạo container cho canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.style.width = `${this.settings.width}px`;
    canvasContainer.style.height = `${this.settings.height}px`;
    canvasContainer.style.margin = 'auto';
    canvasContainer.style.backgroundColor = '#F0EEE6';
    canvasContainer.style.overflow = 'hidden';
    
    // Tạo canvas element
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = `${this.settings.width}px`;
    canvas.style.height = `${this.settings.height}px`;
    
    // Thêm canvas vào container
    canvasContainer.appendChild(canvas);
    container.appendChild(canvasContainer);
    
    // Ẩn loader nếu có
    const loader = container.querySelector('.animation-loader');
    if (loader) {
      loader.style.display = 'none';
    }
    
    // Khởi tạo canvas context
    const ctx = canvas.getContext('2d');
    canvas.width = this.settings.width;
    canvas.height = this.settings.height;
    const centerX = this.settings.width / 2;
    const centerY = this.settings.height / 2;
    
    // Tạo các hạt - cân bằng giữa đầy và rỗng
    for (let i = 0; i < this.settings.particleCount; i++) {
      // Xác định phía bên tường (-1 hoặc 1) và lớp
      const side = Math.random() < 0.5 ? -1 : 1;
      const layer = Math.floor(Math.random() * this.settings.wallLayers);
      const y = Math.random() * this.settings.height;
      
      // Tạo nhiều hàm sóng cho các gợn sóng phức tạp
      const wavePhase1 = y * 0.008;
      const wavePhase2 = y * 0.03;
      const wavePhase3 = y * 0.05;
      
      const baseWave = Math.sin(wavePhase1) * 50;
      const secondaryWave = Math.sin(wavePhase2 * 2 + layer * 0.5) * 25;
      const tertiaryWave = Math.sin(wavePhase3 * 3 + layer * 1.2) * 12;
      
      const combinedWave = baseWave + secondaryWave + tertiaryWave;
      const layerDepth = layer * 15;
      const wallThickness = 20 + layer * 8;
      
      const baseX = centerX + side * (80 + combinedWave + layerDepth);
      const offsetX = (Math.random() - 0.5) * wallThickness;
      
      state.particles.push({
        x: baseX + offsetX,
        y: y,
        z: (layer - this.settings.wallLayers/2) * 20 + (Math.random() - 0.5) * 15,
        side: side,
        layer: layer,
        initialY: y,
        drift: Math.random() * Math.PI * 2,
        speed: 0.1 + layer * 0.02,
        brightness: 0.7 + Math.random() * 0.3
      });
    }
    
    // Animation loop
    const animate = () => {
      state.time += 0.016;
      
      // Clear with subtle persistence
      ctx.fillStyle = this.settings.colors.background;
      ctx.fillRect(0, 0, this.settings.width, this.settings.height);
      
      // Sort particles by z-depth for proper layering
      state.particles.sort((a, b) => a.z - b.z);
      
      state.particles.forEach(particle => {
        // Calculate complex wave position
        const wavePhase1 = particle.y * 0.008 + state.time * 0.05;
        const wavePhase2 = particle.y * 0.03 + state.time * 0.1 + particle.layer * 0.5;
        const wavePhase3 = particle.y * 0.05 + state.time * 0.15 + particle.layer * 1.2;
        
        const baseWave = Math.sin(wavePhase1) * 50;
        const secondaryWave = Math.sin(wavePhase2 * 2) * 25;
        const tertiaryWave = Math.sin(wavePhase3 * 3) * 12;
        
        const combinedWave = baseWave + secondaryWave + tertiaryWave;
        const layerDepth = particle.layer * 15;
        const wallThickness = 20 + particle.layer * 8;
        
        // Calculate target position with layer offset
        const targetX = centerX + particle.side * (80 + combinedWave + layerDepth);
        const layerDrift = Math.sin(particle.drift + state.time * 0.5 + particle.layer * 0.3) * wallThickness * 0.5;
        
        // Smooth movement
        particle.x = particle.x * 0.92 + (targetX + layerDrift) * 0.08;
        particle.y += particle.speed;
        
        // Add depth oscillation
        particle.z += Math.sin(state.time * 0.4 + particle.drift + particle.layer * 0.8) * 0.2;
        
        // Reset at bottom - detachment after completion
        if (particle.y > this.settings.height + 30) {
          particle.y = -30;
          particle.drift = Math.random() * Math.PI * 2;
        }
        
        // Draw with layer-based effects - following heaven's way of moderation
        const depthFactor = (particle.z + this.settings.wallLayers * 10) / (this.settings.wallLayers * 20);
        const opacity = 0.25 + depthFactor * 0.15;
        const size = 0.3 + depthFactor * 0.3;
        const brightness = 120 + particle.layer * 3 + particle.brightness * 15;
        
        if (opacity > 0 && size > 0) {
          // Layer-based glow for outermost layers
          if (particle.layer < 3) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity * 0.1})`;
            ctx.fill();
          }
          
          // Main particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
          ctx.fill();
        }
      });
      
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
        
        // Xóa các particles để giải phóng bộ nhớ
        state.particles = [];
        
        // Xóa canvas và context nếu có thể
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Dọn dẹp DOM
        if (container && container.contains(canvasContainer)) {
          container.removeChild(canvasContainer);
        }
      }
    };
  }
};

export default chapter9Animation;
