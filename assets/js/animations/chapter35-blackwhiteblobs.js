// chapter35-blackwhiteblobs.js - Animation cho Chapter 35
// Visualization: Patterns emerge endlessly from source, finding harmony in constant transformation

import animationUtils from './animation-utils.js';

const patterns = {
  balance: (x, y, t) => {
    const cx = 30, cy = 15;
    const dx = x - cx, dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Math.sin(dx * 0.3 + t * 0.5) * Math.cos(dy * 0.3 + t * 0.3) * Math.sin(dist * 0.1 - t * 0.4);
  },
  duality: (x, y, t) => {
    const cx = 30;
    const left = x < cx ? Math.sin(x * 0.2 + t * 0.3) : 0;
    const right = x >= cx ? Math.cos(x * 0.2 - t * 0.3) : 0;
    return left + right + Math.sin(y * 0.3 + t * 0.2);
  },
  flow: (x, y, t) => {
    const angle = Math.atan2(y - 15, x - 30);
    const dist = Math.sqrt((x - 30) ** 2 + (y - 15) ** 2);
    return Math.sin(angle * 3 + t * 0.4) * Math.cos(dist * 0.1 - t * 0.3);
  },
  chaos: (x, y, t) => {
    const noise1 = Math.sin(x * 0.5 + t) * Math.cos(y * 0.3 - t);
    const noise2 = Math.sin(y * 0.4 + t * 0.5) * Math.cos(x * 0.2 + t * 0.7);
    const noise3 = Math.sin((x + y) * 0.2 + t * 0.8);
    return noise1 * 0.3 + noise2 * 0.3 + noise3 * 0.4;
  }
};

const chapter35Animation = {
  settings: {
    backgroundColor: '#F0EEE6',
    textColor: '#333',
    width: 60,
    height: 35,
    fontSize: 14,
    fontFamily: 'monospace',
    patternTypes: ['balance', 'duality', 'flow', 'chaos'],
    patternSwitchInterval: 240 // frames
  },

  init(container) {
    if (!container) return null;
    // Tạo wrapper div cho căn giữa
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.background = this.settings.backgroundColor;
    
    // Tạo pre cho ASCII art
    const pre = document.createElement('pre');
    pre.style.fontFamily = this.settings.fontFamily;
    
    // Responsive font size
    const isMobile = window.innerWidth <= 600;
    pre.style.fontSize = (isMobile ? this.settings.fontSize * 0.7 : this.settings.fontSize) + 'px';
    pre.style.lineHeight = '1';
    pre.style.letterSpacing = isMobile ? '0.05em' : '0.1em';
    pre.style.color = this.settings.textColor;
    pre.style.background = 'transparent';
    pre.style.userSelect = 'none';
    pre.style.cursor = 'pointer';
    pre.style.margin = '0 auto';
    pre.style.padding = '0';
    pre.style.display = 'block';
    pre.style.textAlign = 'center';
    pre.style.whiteSpace = 'pre';
    pre.style.overflow = 'hidden';
    
    container.innerHTML = '';
    wrapper.appendChild(pre);
    container.appendChild(wrapper);
    let frame = 0;
    let patternType = 0;
    const { patternTypes, width, height, patternSwitchInterval } = this.settings;
    // Animation loop
    let animationFrameId;
    function render() {
      const t = (frame * Math.PI) / (60 * 4); // slowdownFactor=12/3=4
      if (frame % patternSwitchInterval === 0 && frame !== 0) {
        patternType = (patternType + 1) % patternTypes.length;
      }
      const currentPattern = patterns[patternTypes[patternType]];
      let result = '';
      // Thêm khoảng trống đều ở đầu mỗi dòng để căn giữa tốt hơn
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let value = currentPattern(x, y, t);
          if (value > 0.8) {
            result += '█';
          } else if (value > 0.5) {
            result += '▓';
          } else if (value > 0.2) {
            result += '▒';
          } else if (value > -0.2) {
            result += '░';
          } else if (value > -0.5) {
            result += '·';
          } else {
            result += ' ';
          }
        }
        result += '\n';
      }
      pre.textContent = result;
      frame = (frame + 1) % (240 * 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render();
    animationUtils.fadeOutLoader(container);
    // Cleanup function
    return function cleanup() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      pre.textContent = '';
    };
  }
};

export default chapter35Animation;
