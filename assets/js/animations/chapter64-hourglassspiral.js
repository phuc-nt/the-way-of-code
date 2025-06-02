// Animation for Chapter 64: Hourglass Spiral
import animationUtils from './animation-utils.js';
// Visualization: A form that emerges gradually from a central point, showing how patterns develop from simple beginnings

const CANVAS_SIZE = 550;

const HourglassSpiralAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = animationUtils.colors.background;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = CANVAS_SIZE + 'px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Create container for Three.js renderer
    let threeContainer = container.querySelector('.hourglass-spiral-container');
    if (!threeContainer) {
      threeContainer = document.createElement('div');
      threeContainer.className = 'hourglass-spiral-container';
      threeContainer.style.width = '100%';
      threeContainer.style.height = '100%';
      threeContainer.style.position = 'absolute';
      threeContainer.style.top = '0';
      threeContainer.style.left = '0';
      container.appendChild(threeContainer);
    }

    let renderer, scene, camera, pineCone, particleSystem, particles, particleMaterial, spiralGeometry, spiralLine, lineMaterial, animationFrameId;
    let running = true;
    let positions, colors, sizes, spiralPoints;

    function cleanup() {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (particles) particles.dispose();
      if (spiralGeometry) spiralGeometry.dispose();
      if (particleMaterial) particleMaterial.dispose();
      if (lineMaterial) lineMaterial.dispose();
      if (pineCone) {
        if (particleSystem) pineCone.remove(particleSystem);
        if (spiralLine) pineCone.remove(spiralLine);
        if (scene) scene.remove(pineCone);
      }
      if (scene && scene.clear) scene.clear();
      if (renderer) {
        if (threeContainer && renderer.domElement && threeContainer.contains(renderer.domElement)) {
          threeContainer.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
      }
      if (positions) positions.fill(0);
      if (colors) colors.fill(0);
      if (sizes) sizes.fill(0);
      if (spiralPoints) spiralPoints.length = 0;
    }

    // Dynamically import Three.js from CDN for browser compatibility
    import('https://cdn.skypack.dev/three@0.152.2').then(THREE => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(animationUtils.colors.background);
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 16;
      camera.position.y = 0;
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
      threeContainer.appendChild(renderer.domElement);
      pineCone = new THREE.Group();
      // Particles
      const particleCount = 10000;
      particles = new THREE.BufferGeometry();
      positions = new Float32Array(particleCount * 3);
      colors = new Float32Array(particleCount * 3);
      sizes = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const layer = t * 40;
        const angle = layer * 0.3 + Math.random() * 0.2;
        const spiralAngle = t * Math.PI * 40;
        let radius;
        if (t < 0.3) {
          radius = Math.sin(t * Math.PI / 0.3) * 2.5;
        } else if (t < 0.5) {
          radius = 2.5 - (Math.sin((t - 0.3) * Math.PI / 0.2)) * 1.5;
        } else if (t < 0.7) {
          radius = 1 + (Math.sin((t - 0.5) * Math.PI / 0.2)) * 2;
        } else {
          radius = 3 - (Math.sin((t - 0.7) * Math.PI / 0.3)) * 1;
        }
        radius += (Math.random() - 0.5) * 0.1;
        const y = t * 16 - 8;
        const x = Math.cos(spiralAngle) * radius;
        const z = Math.sin(spiralAngle) * radius;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0;
        sizes[i] = Math.random() * 0.03 + 0.01;
      }
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.NormalBlending
      });
      particleSystem = new THREE.Points(particles, particleMaterial);
      pineCone.add(particleSystem);
      // Spiral line
      lineMaterial = new THREE.LineBasicMaterial({ color: '#888888', transparent: true, opacity: 0.3 });
      spiralPoints = [];
      for (let i = 0; i < 200; i++) {
        const t = i / 200;
        const angle = t * Math.PI * 16;
        const y = t * 16 - 8;
        let radius;
        if (t < 0.3) {
          radius = Math.sin(t * Math.PI / 0.3) * 2.5;
        } else if (t < 0.5) {
          radius = 2.5 - (Math.sin((t - 0.3) * Math.PI / 0.2)) * 1.5;
        } else if (t < 0.7) {
          radius = 1 + (Math.sin((t - 0.5) * Math.PI / 0.2)) * 2;
        } else {
          radius = 3 - (Math.sin((t - 0.7) * Math.PI / 0.3)) * 1;
        }
        spiralPoints.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ));
      }
      spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
      spiralLine = new THREE.Line(spiralGeometry, lineMaterial);
      pineCone.add(spiralLine);
      scene.add(pineCone);
      let time = 0;
      function animate() {
        if (!running) return;
        animationFrameId = requestAnimationFrame(animate);
        time += 0.005;
        pineCone.rotation.y = time * 0.45;
        pineCone.rotation.x = Math.sin(time * 0.25) * 0.05;
        pineCone.rotation.z = Math.cos(time * 0.35) * 0.03;
        const breathe = 1 + Math.sin(time * 0.25) * 0.02;
        pineCone.scale.set(breathe, breathe, breathe);
        const posArr = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < posArr.length; i += 3) {
          posArr[i] += Math.sin(time + i) * 0.00005;
          posArr[i + 1] += Math.cos(time + i) * 0.00005;
          posArr[i + 2] += Math.sin(time + i + 1) * 0.00005;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      }
      animate();
    });

    // Cleanup
    return {
      cleanup
    };
  }
};

export default HourglassSpiralAnimation;
