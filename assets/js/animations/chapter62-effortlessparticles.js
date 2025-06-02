// Animation for Chapter 62: Effortless Particles
import animationUtils from './animation-utils.js';
// Visualization: Particles spiral around a central point of energy, showing how all things return to Source

const CANVAS_SIZE = 550;

const EffortlessParticlesAnimation = {
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
    let threeContainer = container.querySelector('.effortless-particles-container');
    if (!threeContainer) {
      threeContainer = document.createElement('div');
      threeContainer.className = 'effortless-particles-container';
      threeContainer.style.width = '100%';
      threeContainer.style.height = '100%';
      threeContainer.style.position = 'absolute';
      threeContainer.style.top = '0';
      threeContainer.style.left = '0';
      container.appendChild(threeContainer);
    }

    let renderer, scene, camera, points, animationFrameId, clock, geometry, particleMaterial;
    let running = true;
    let count = 20000;
    let positions, colors, sizes;

    function createParticles(THREE) {
      positions = new Float32Array(count * 3);
      colors = new Float32Array(count * 3);
      sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const layer = Math.floor(i / (count / 5)) - 2;
        const t = (i % (count / 5)) / (count / 5);
        const radius = Math.sqrt(t) * 3;
        const angle = t * Math.PI * 15;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = layer * 1.2;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        const baseShade = 0.3;
        const variation = Math.random() * 0.15;
        const shade = baseShade + variation;
        colors[i * 3] = shade;
        colors[i * 3 + 1] = shade;
        colors[i * 3 + 2] = shade;
        sizes[i] = 0.12 + Math.random() * 0.04;
      }
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }

    function createMaterial(THREE) {
      particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 0.9 }
        },
        vertexShader: `
          uniform float time;
          attribute float size;
          attribute vec3 customColor;
          varying vec3 vColor;
          void main() {
            vColor = customColor;
            vec3 pos = position;
            float t = time * 0.2;
            float radius = length(pos.xz);
            float angle = atan(pos.z, pos.x);
            float flow = sin(t + radius * 2.0 - angle) * cos(t * 0.7 + angle * 3.0);
            float layer = floor(pos.y * 2.0) * 0.5;
            float layerPhase = t + layer;
            vec3 motion;
            motion.x = cos(layerPhase) * sin(t * 0.5 + pos.z) * 0.5;
            motion.y = sin(layerPhase * 0.7) * 0.3;
            motion.z = sin(layerPhase) * cos(t * 0.5 + pos.x) * 0.5;
            pos += motion * (1.0 + flow * 0.3);
            pos *= 0.6;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (192.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = (1.0 - smoothstep(0.45, 0.5, dist)) * opacity;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false
      });
    }

    function handleResize() {
      if (!threeContainer || !camera || !renderer) return;
      camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
      const pixelRatio = window.devicePixelRatio || 1;
      renderer.setPixelRatio(pixelRatio);
    }

    function cleanup() {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scene && points) scene.remove(points);
      if (geometry) geometry.dispose();
      if (renderer) {
        if (threeContainer && renderer.domElement && threeContainer.contains(renderer.domElement)) {
          threeContainer.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
      }
      if (scene && scene.clear) scene.clear();
      points = null;
      geometry = null;
      renderer = null;
      scene = null;
      camera = null;
      clock = null;
      particleMaterial = null;
      if (threeContainer && threeContainer.parentNode) threeContainer.parentNode.removeChild(threeContainer);
    }

    // Dynamically import Three.js from CDN for browser compatibility
    import('https://cdn.skypack.dev/three@0.152.2').then(THREE => {
      createParticles(THREE);
      createMaterial(THREE);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      clock = new THREE.Clock();
      const pixelRatio = window.devicePixelRatio || 1;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
      threeContainer.appendChild(renderer.domElement);
      scene.background = new THREE.Color(animationUtils.colors.background);
      camera.position.z = 5;
      points = new THREE.Points(geometry, particleMaterial);
      scene.add(points);
      function animate() {
        if (!running) return;
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        particleMaterial.uniforms.time.value = time;
        renderer.render(scene, camera);
      }
      animate();
      window.addEventListener('resize', handleResize);
    });

    // Cleanup
    return {
      cleanup
    };
  }
};

export default EffortlessParticlesAnimation;
