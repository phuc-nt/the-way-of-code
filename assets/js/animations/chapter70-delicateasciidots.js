// chapter70-delicateasciidots.js - Delicate ASCII Dots animation for Chapter 70
// Themes: simple truth, inner understanding, heart wisdom
// Visualization: Patterns that reveal meaning through simplicity

const GRID_SIZE = 60;
const CHARS = '⠁⠂⠄⠈⠐⠠⡀⢀⠃⠅⠘⠨⠊⠋⠌⠍⠎⠏';

function createDelicateAsciiDotsAnimation(container) {
  let animationFrameId;
  let time = 0;
  let waves = [];
  let mouse = { x: 0, y: 0 };
  let canvas, ctx;

  function initWaves() {
    waves = [];
    const numWaves = 3;
    for (let i = 0; i < numWaves; i++) {
      waves.push({
        x: GRID_SIZE * (0.25 + Math.random() * 0.5),
        y: GRID_SIZE * (0.25 + Math.random() * 0.5),
        frequency: 0.2 + Math.random() * 0.3,
        amplitude: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5
      });
    }
  }

  function handleResize() {
    if (!container) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    mouse = { x: x * 2 - 1, y: y * 2 - 1 };
  }

  function update(delta) {
    time += delta * 0.75;
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(' '));
    const mouseX = (mouse.x + 1) * GRID_SIZE / 2;
    const mouseY = (1 - mouse.y) * GRID_SIZE / 2;
    const mouseWave = {
      x: mouseX,
      y: mouseY,
      frequency: 0.3,
      amplitude: 1,
      phase: time * 2,
      speed: 1
    };
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let totalWave = 0;
        const allWaves = waves.concat([mouseWave]);
        allWaves.forEach(wave => {
          const dx = x - wave.x;
          const dy = y - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 / (1 + dist * 0.1);
          const value = Math.sin(
            dist * wave.frequency -
            time * wave.speed +
            wave.phase
          ) * wave.amplitude * falloff;
          totalWave += value;
        });
        const normalizedWave = (totalWave + 2) / 4;
        if (Math.abs(totalWave) > 0.2) {
          const charIndex = Math.min(CHARS.length - 1, Math.max(0, Math.floor(normalizedWave * (CHARS.length - 1))));
          const opacity = Math.min(0.9, Math.max(0.4, 0.4 + (normalizedWave * 0.5)));
          newGrid[y][x] = { char: CHARS[charIndex] || CHARS[0], opacity };
        } else {
          newGrid[y][x] = null;
        }
      }
    }
    waves.forEach(wave => {
      const x = Math.floor(wave.x);
      const y = Math.floor(wave.y);
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        const pulse = Math.sin(time * wave.speed + wave.phase);
        const charIndex = Math.floor((pulse + 1) * CHARS.length / 2);
        newGrid[y][x] = { char: CHARS[charIndex], opacity: 0.9 };
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 4) {
          const px = x + Math.round(Math.cos(i));
          const py = y + Math.round(Math.sin(i));
          if (px >= 0 && px < GRID_SIZE && py >= 0 && py < GRID_SIZE) {
            newGrid[py][px] = { char: CHARS[Math.floor(i * CHARS.length / (Math.PI * 2))], opacity: 0.7 };
          }
        }
      }
    });
    ctx.fillStyle = '#F0EEE6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cellSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = newGrid[y][x];
        if (cell && cell.char && CHARS.includes(cell.char)) {
          ctx.fillStyle = `rgba(85, 85, 85, ${cell.opacity || 0.4})`;
          ctx.fillText(cell.char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
        }
      }
    }
  }

  function animate(now) {
    const delta = Math.min((now - (animate.lastTime || now)) / 1000, 0.1);
    animate.lastTime = now;
    update(delta);
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    canvas.removeEventListener('mousemove', handleMouseMove);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = '#F0EEE6';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');
  initWaves();
  handleResize();
  window.addEventListener('resize', handleResize);
  canvas.addEventListener('mousemove', handleMouseMove);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const DelicateAsciiDotsAnimation = {
  init: createDelicateAsciiDotsAnimation
};

export default DelicateAsciiDotsAnimation;
