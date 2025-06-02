// chapter72-gentlewaves.js - Gentle Waves animation for Chapter 72
// Themes: natural reverence, teaching without teaching, self-trust
// Visualization: Lines that flow and interweave naturally, showing how patterns emerge without instruction

import animationUtils from './animation-utils.js';

function createGentleWavesAnimation(container) {
  let animationFrameId;
  let time = 0;
  let canvas, ctx;
  let width = 500, height = 500;

  function handleResize() {
    if (!container) return;
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function draw() {
    ctx.fillStyle = animationUtils.colors.background;
    ctx.fillRect(0, 0, width, height);

    time += 0.005;

    // Horizontal lines
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.033)';
    ctx.lineWidth = 0.3;
    for (let y = 0; y < height; y += 40) {
      const offsetY = 5 * Math.sin(time + y * 0.01);
      ctx.beginPath();
      ctx.moveTo(0, y + offsetY);
      ctx.lineTo(width, y + offsetY);
      ctx.stroke();
    }

    // Vertical lines with subtle wave
    for (let x = 0; x < width; x += 40) {
      const offsetX = 5 * Math.sin(time + x * 0.01);
      ctx.beginPath();
      ctx.moveTo(x + offsetX, 0);
      ctx.lineTo(x + offsetX, height);
      ctx.stroke();
    }

    // Long horizontal flowing lines
    const numHorizontalLines = 30;
    for (let i = 0; i < numHorizontalLines; i++) {
      const yPos = (i / numHorizontalLines) * height;
      const amplitude = 40 + 20 * Math.sin(time * 0.2 + i * 0.1);
      const frequency = 0.008 + 0.004 * Math.sin(time * 0.1 + i * 0.05);
      const speed = time * (0.5 + 0.3 * Math.sin(i * 0.1));
      const thickness = 0.8 + 0.6 * Math.sin(time + i * 0.2);
      const opacity = 0.132 + 0.088 * Math.abs(Math.sin(time * 0.3 + i * 0.15));
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
      for (let x = 0; x < width; x += 2) {
        const y = yPos + amplitude * Math.sin(x * frequency + speed);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Long diagonal flowing lines
    const numDiagonalLines = 35;
    for (let i = 0; i < numDiagonalLines; i++) {
      const offset = (i / numDiagonalLines) * width * 2 - width * 0.5;
      const amplitude = 30 + 20 * Math.cos(time * 0.25 + i * 0.1);
      const frequency = 0.01 + 0.005 * Math.sin(time * 0.15 + i * 0.08);
      const phase = time * (0.3 + 0.2 * Math.sin(i * 0.1));
      const thickness = 0.7 + 0.5 * Math.sin(time + i * 0.25);
      const opacity = 0.11 + 0.077 * Math.abs(Math.sin(time * 0.2 + i * 0.1));
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(50, 50, 50, ${opacity})`;
      const steps = 100;
      for (let j = 0; j <= steps; j++) {
        const progress = j / steps;
        const x = offset + progress * width;
        const y = progress * height + amplitude * Math.sin(progress * 8 + phase);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Long vertical flowing lines
    const numVerticalLines = 25;
    for (let i = 0; i < numVerticalLines; i++) {
      const xPos = (i / numVerticalLines) * width;
      const amplitude = 35 + 15 * Math.sin(time * 0.15 + i * 0.12);
      const frequency = 0.009 + 0.004 * Math.cos(time * 0.12 + i * 0.07);
      const speed = time * (0.4 + 0.25 * Math.cos(i * 0.15));
      const thickness = 0.6 + 0.4 * Math.sin(time + i * 0.3);
      const opacity = 0.099 + 0.066 * Math.abs(Math.sin(time * 0.25 + i * 0.18));
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(70, 70, 70, ${opacity})`;
      for (let y = 0; y < height; y += 2) {
        const x = xPos + amplitude * Math.sin(y * frequency + speed);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function animate() {
    draw();
    animationFrameId = requestAnimationFrame(animate);
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    cancelAnimationFrame(animationFrameId);
  }

  // --- INIT ---
  if (!container) return { cleanup: () => {} };
  container.innerHTML = '';
  container.style.background = animationUtils.colors.background;
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');
  handleResize();
  window.addEventListener('resize', handleResize);
  animationFrameId = requestAnimationFrame(animate);
  return { cleanup };
}

const GentleWavesAnimation = {
  init: createGentleWavesAnimation
};

export default GentleWavesAnimation;
