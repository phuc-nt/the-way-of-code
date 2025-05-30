// Animation for Chapter 51: Stratified Undulations
// Visualization: Layers of particles that form and flow like geological strata, showing how all things are shaped by their environment

import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;
const PARTICLE_COUNT = 18000;
const STRATA_LAYERS = 12;
const BG_COLOR = '#F0EEE6';

const stratifiedUndulationsAnimation = {
  settings: {
    colors: animationUtils.colors
  },
  
  init(container) {
    if (!container) return null;
    
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxWidth = '100%';
    canvas.style.backgroundColor = BG_COLOR;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Each particle represents a point of potential, shaped by its environment
    const particles = [];
    
    // Create particles in stratified rock layers, each finding its natural place
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const stratum = Math.floor(Math.random() * STRATA_LAYERS);
      const thickness = 40 + stratum * 3;
      const depth = stratum * 25;
      
      // Position within stratum
      const y = Math.random() * height;
      const strataPhase = y * 0.01 + stratum * 0.3;
      
      // Multiple wave frequencies for each stratum
      const primaryUndulation = Math.sin(strataPhase) * 35;
      const secondaryUndulation = Math.sin(strataPhase * 2 + stratum * 0.8) * 18;
      const tertiaryUndulation = Math.sin(strataPhase * 4 + stratum * 1.5) * 8;
      
      const totalUndulation = primaryUndulation + secondaryUndulation + tertiaryUndulation;
      
      // Determine side and position
      const side = Math.random() < 0.5 ? -1 : 1;
      const baseX = centerX + side * (60 + totalUndulation + depth);
      const offsetX = (Math.random() - 0.5) * thickness;
      
      particles.push({
        x: baseX + offsetX,
        y: y,
        z: (stratum - STRATA_LAYERS/2) * 30 + (Math.random() - 0.5) * 20,
        side: side,
        stratum: stratum,
        flow: Math.random() * Math.PI * 2,
        oscillation: Math.random() * Math.PI * 2,
        velocity: 0.05 + stratum * 0.015,
        brightness: 0.6 + Math.random() * 0.4
      });
    }
    
    let time = 0;
    let animationFrameId = null;
    
    function animate() {
      time += 0.016;
      
      // Clear with stratified effect
      ctx.fillStyle = 'rgba(240, 238, 230, 0.025)';
      ctx.fillRect(0, 0, width, height);
      
      // Sort by z-depth and stratum
      particles.sort((a, b) => a.z - b.z);
      
      particles.forEach(particle => {
        const strataPhase = particle.y * 0.01 + particle.stratum * 0.3 + time * 0.03;
        
        // Calculate undulations for this stratum
        const primaryUndulation = Math.sin(strataPhase) * 35;
        const secondaryUndulation = Math.sin(strataPhase * 2 + particle.stratum * 0.8) * 18;
        const tertiaryUndulation = Math.sin(strataPhase * 4 + particle.stratum * 1.5) * 8;
        
        const totalUndulation = primaryUndulation + secondaryUndulation + tertiaryUndulation;
        const depth = particle.stratum * 25;
        const thickness = 40 + particle.stratum * 3;
        
        // Calculate target position
        const targetX = centerX + particle.side * (60 + totalUndulation + depth);
        const strataDrift = Math.sin(particle.flow + time * 0.6 + particle.stratum * 0.4) * thickness * 0.7;
        
        // Smooth movement with stratum-specific dynamics
        particle.x = particle.x * 0.94 + (targetX + strataDrift) * 0.06;
        particle.y += particle.velocity;
        
        // Add vertical oscillation within stratum
        particle.y += Math.sin(particle.oscillation + time * 0.8) * 0.3;
        
        // Update depth
        particle.z += Math.sin(time * 0.3 + particle.flow + particle.stratum * 0.6) * 0.25;
        
        // Reset at bottom
        if (particle.y > height + 40) {
          particle.y = -40;
          particle.flow = Math.random() * Math.PI * 2;
        }
        
        // Draw with stratum-based effects
        const depthFactor = (particle.z + STRATA_LAYERS * 15) / (STRATA_LAYERS * 30);
        const opacity = 0.15 + depthFactor * 0.15;  // More transparent
        const size = 0.3 + depthFactor * 0.8;    // Smaller particles
        const brightness = 45 + particle.stratum * 3 + particle.brightness * 15;  // Lighter, more subtle gradients
        
        if (opacity > 0 && size > 0) {
          // Stratum-based highlighting
          if (particle.stratum % 3 === 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity * 0.06})`;
            ctx.fill();
          }
          
          // Main particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
          ctx.fill();
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Bắt đầu animation
    animate();
    
    // Xử lý thay đổi kích thước
    const handleResize = () => {
      // Canvas size is managed by CSS, aspect ratio is preserved
    };
    
    window.addEventListener('resize', handleResize);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Return cleanup function
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        if (container && canvas) {
          container.removeChild(canvas);
        }
        particles.length = 0;
        time = 0;
      }
    };
  }
};

export default stratifiedUndulationsAnimation;
