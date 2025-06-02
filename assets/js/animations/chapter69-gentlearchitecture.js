// Animation for Chapter 69: Gentle Architecture
import animationUtils from './animation-utils.js';
// Visualization: A structure that stands through stillness, showing how stability comes from non-action

const CANVAS_SIZE = 550;

const GentleArchitectureAnimation = {
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
    let threeContainer = container.querySelector('.gentle-architecture-container');
    if (!threeContainer) {
      threeContainer = document.createElement('div');
      threeContainer.className = 'gentle-architecture-container';
      threeContainer.style.width = '100%';
      threeContainer.style.height = '100%';
      threeContainer.style.position = 'absolute';
      threeContainer.style.top = '0';
      threeContainer.style.left = '0';
      container.appendChild(threeContainer);
    }

    let renderer, scene, camera, structure, platforms, animationFrameId;
    let running = true;

    function cleanup() {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (threeContainer && renderer.domElement && threeContainer.contains(renderer.domElement)) {
          threeContainer.removeChild(renderer.domElement);
        }
      }
      if (scene && scene.traverse) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      if (threeContainer && threeContainer.parentNode) threeContainer.parentNode.removeChild(threeContainer);
    }

    // Dynamically import Three.js from CDN for browser compatibility
    import('https://cdn.skypack.dev/three@0.152.2').then(THREE => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, CANVAS_SIZE / CANVAS_SIZE, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(animationUtils.colors.background);
      threeContainer.appendChild(renderer.domElement);
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      const directionalLight = new THREE.DirectionalLight(0x808080, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(ambientLight);
      scene.add(directionalLight);
      // Materials
      const material = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.6 });
      // Vessel
      function createVessel() {
        const points = [];
        const layers = 20;
        const pointsPerLayer = 8;
        for (let i = 0; i <= layers; i++) {
          const y = i - layers/2;
          const radius = 5 * Math.sin(Math.PI * (i/layers));
          for (let j = 0; j < pointsPerLayer; j++) {
            const angle = (j/pointsPerLayer) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            points.push(new THREE.Vector3(x, y, z));
          }
        }
        return points;
      }
      function createStructure(points) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const pointsPerLayer = 8;
        for (let i = 0; i < points.length - pointsPerLayer; i++) {
          vertices.push(points[i].x, points[i].y, points[i].z);
          vertices.push(points[i + pointsPerLayer].x, points[i + pointsPerLayer].y, points[i + pointsPerLayer].z);
        }
        for (let i = 0; i < points.length; i += pointsPerLayer) {
          for (let j = 0; j < pointsPerLayer; j++) {
            const p1 = points[i + j];
            const p2 = points[i + ((j + 1) % pointsPerLayer)];
            vertices.push(p1.x, p1.y, p1.z);
            vertices.push(p2.x, p2.y, p2.z);
          }
        }
        for (let i = 0; i < points.length - pointsPerLayer; i += pointsPerLayer) {
          for (let j = 0; j < pointsPerLayer; j++) {
            const p1 = points[i + j];
            const p2 = points[i + pointsPerLayer + ((j + 1) % pointsPerLayer)];
            if (Math.random() < 0.3) {
              vertices.push(p1.x, p1.y, p1.z);
              vertices.push(p2.x, p2.y, p2.z);
            }
          }
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return new THREE.LineSegments(geometry, material);
      }
      function createPlatforms() {
        const group = new THREE.Group();
        const platformCount = 5;
        for (let i = 0; i < platformCount; i++) {
          const radius = 3 + Math.random() * 2;
          const segments = 6;
          const geometry = new THREE.BufferGeometry();
          const vertices = [];
          for (let j = 0; j < segments; j++) {
            const angle1 = (j/segments) * Math.PI * 2;
            const angle2 = ((j+1)/segments) * Math.PI * 2;
            vertices.push(0, 0, 0);
            vertices.push(Math.cos(angle1) * radius, 0, Math.sin(angle1) * radius);
            vertices.push(Math.cos(angle2) * radius, 0, Math.sin(angle2) * radius);
          }
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
          const platform = new THREE.LineSegments(geometry, material);
          platform.position.y = (i - platformCount/2) * 4;
          platform.position.x = Math.sin(i * 1.2) * 3;
          platform.position.z = Math.cos(i * 1.2) * 3;
          platform.rotation.x = Math.random() * 0.2;
          platform.rotation.z = Math.random() * 0.2;
          group.add(platform);
        }
        return group;
      }
      const vesselPoints = createVessel();
      structure = createStructure(vesselPoints);
      platforms = createPlatforms();
      scene.add(structure);
      scene.add(platforms);
      camera.position.z = 20;
      camera.position.y = 5;
      camera.lookAt(0, 0, 0);
      function animate() {
        if (!running) return;
        animationFrameId = requestAnimationFrame(animate);
        structure.rotation.y += 0.002;
        platforms.rotation.y += 0.001;
        renderer.render(scene, camera);
      }
      animate();
      function handleResize() {
        const width = threeContainer.clientWidth;
        const height = threeContainer.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
      }
      window.addEventListener('resize', handleResize);
    });

    // Cleanup
    return {
      cleanup
    };
  }
};

export default GentleArchitectureAnimation;
