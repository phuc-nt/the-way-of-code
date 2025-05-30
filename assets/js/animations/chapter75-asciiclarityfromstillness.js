// chapter75-asciiclarityfromstillness.js - ASCII Clarity From Stillness animation for Chapter 75
// Themes: freedom from control, trust in people, natural prosperity
// Visualization: ASCII patterns that emerge from stillness, showing how clarity arises when interference falls away

function createAsciiClarityFromStillnessAnimation(container) {
  let animationFrameId;
  let time = 0;
  let mouse = { x: 275, y: 275 };
  const width = 50;
  const height = 35;
  const chars = [' ', '·', '+', '*', '※', '◊', '○', '●'];
  let pre;

  function handleMouseMove(e) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function renderAsciiArt() {
    const centerX = width / 2;
    const centerY = height / 2;
    let art = [];
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const mouseX = (mouse.x / 550) * width;
        const mouseY = (mouse.y / 550) * height;
        const autoX = mouseX + Math.sin(time * 0.25) * 2;
        const autoY = mouseY + Math.cos(time * 0.15) * 2;
        const mouseDist = Math.sqrt(Math.pow(x - autoX, 2) + Math.pow(y - autoY, 2));
        const centerDist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const angle = Math.atan2(y - centerY, x - centerX) + Math.PI;
        const pulse = Math.sin(centerDist * 0.5 - Date.now() * 0.001) * 0.5 + 0.5;
        const clarity = Math.sin(angle + centerDist * 0.2 + mouseDist * 0.1);
        let intensity = 0;
        if (centerDist < 3) {
          intensity = 7;
        } else if (centerDist < 8) {
          intensity = Math.floor(pulse * 2) + 4;
        } else {
          intensity = Math.floor((clarity * 0.5 + 0.5) * 3);
          if (mouseDist < 10) intensity += 2;
        }
        if (Math.abs(Math.floor(centerDist) % 5) < 1) {
          intensity = Math.min(intensity + 2, 7);
        }
        line += chars[Math.max(0, Math.min(intensity, chars.length - 1))];
      }
      art.push(line);
    }
    if (pre) {
      pre.innerHTML = art.map(l => l).join('<br>');
    }
  }

  function animate() {
    time += 0.008;
    renderAsciiArt();
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('mousemove', handleMouseMove);
    if (container && pre && pre.parentNode === container) {
      container.removeChild(pre);
    }
    cancelAnimationFrame(animationFrameId);
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  container.style.width = '550px';
  container.style.height = '550px';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.fontFamily = 'monospace';
  container.style.fontSize = '12px';
  container.style.lineHeight = '12px';
  container.style.color = '#333333';
  container.style.cursor = 'none';
  pre = document.createElement('pre');
  pre.style.margin = 0;
  pre.style.width = '100%';
  pre.style.height = '100%';
  pre.style.display = 'block';
  pre.style.textAlign = 'center';
  container.appendChild(pre);
  window.addEventListener('mousemove', handleMouseMove);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const AsciiClarityFromStillnessAnimation = {
  init: createAsciiClarityFromStillnessAnimation
};

export default AsciiClarityFromStillnessAnimation;
