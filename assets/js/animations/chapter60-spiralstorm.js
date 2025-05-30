// Animation for Chapter 60: Spiral Storm
// Visualization: A spiral system that finds its own balance through minimal guidance (Three.js)

const CANVAS_SIZE = 550;
const BG_COLOR = 0xf0eee7;

const SpiralStormAnimation = {
  async init(container) {
    if (!container) return null;
    // Hide loader if present
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Container setup
    container.style.background = '#F0EEE7';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '4px';
    container.style.width = '100%';
    container.style.maxWidth = CANVAS_SIZE + 'px';
    container.style.aspectRatio = '1/1';
    container.style.height = 'auto';
    container.style.minHeight = '0';
    container.style.display = 'block';

    // Dynamically import Three.js if not present
    let THREE;
    if (window.THREE) {
      THREE = window.THREE;
    } else {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js');
      window.THREE = THREE;
    }

    // Remove old canvas if exists
    let mount = container.querySelector('.spiralstorm-mount');
    if (mount) {
      mount.innerHTML = '';
    } else {
      mount = document.createElement('div');
      mount.className = 'spiralstorm-mount';
      mount.style.width = '100%';
      mount.style.height = '100%';
      mount.style.position = 'absolute';
      mount.style.left = '0';
      mount.style.top = '0';
      mount.style.right = '0';
      mount.style.bottom = '0';
      mount.style.overflow = 'hidden';
      container.appendChild(mount);
    }

    // Setup scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);
    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    mount.appendChild(renderer.domElement);

    // Responsive resize
    function resizeRenderer() {
      const size = Math.min(mount.offsetWidth, mount.offsetHeight);
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    // Create group and add to scene
    const group = new THREE.Group();
    scene.add(group);

    // FlowLine helper
    function FlowLine({ points, radius, height, twist, phase, parent }) {
      const linePoints = [];
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = t * Math.PI * 2 * twist + phase;
        const r = radius * (1 + Math.sin(t * Math.PI * 3) * 0.5);
        const h = height * t + Math.sin(t * Math.PI * 2) * 1.2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        linePoints.push(new THREE.Vector3(x, h, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const material = new THREE.LineBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.5
      });
      const line = new THREE.Line(geometry, material);
      parent.add(line);
      return line;
    }

    // FlowStructure helper
    function FlowStructure({ baseRadius, baseHeight, parent }) {
      const count = 24;
      for (let i = 0; i < count; i++) {
        const props = {
          points: 50,
          radius: baseRadius * (1 + Math.sin(i / count * Math.PI * 2) * 0.2),
          height: baseHeight * (1 + Math.cos(i / count * Math.PI * 2) * 0.2),
          twist: 2.5 + Math.sin(i / count * Math.PI) * 0.8,
          phase: (i / count) * Math.PI * 2,
          parent
        };
        FlowLine(props);
      }
    }

    // Main flow structures
    FlowStructure({ baseRadius: 2, baseHeight: 3, parent: group });
    // Secondary flow structures
    const group2 = new THREE.Group();
    group2.position.set(0, -2.5, 0);
    group2.rotation.set(Math.PI * 0.1, 0, 0);
    FlowStructure({ baseRadius: 1.5, baseHeight: 2, parent: group2 });
    group.add(group2);
    const group3 = new THREE.Group();
    group3.position.set(0, 1.5, 0);
    group3.rotation.set(-Math.PI * 0.1, Math.PI * 0.5, 0);
    FlowStructure({ baseRadius: 1, baseHeight: 1.5, parent: group3 });
    group.add(group3);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, 3, -5);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 7;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId;
    let running = true;
    function animate() {
      if (!running) return;
      const time = clock.getElapsedTime();
      group.rotation.y = Math.sin(time * 0.2) * 0.5;
      group.rotation.x = Math.cos(time * 0.15) * 0.3;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return {
      cleanup: () => {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeRenderer);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => { if (material.dispose) material.dispose(); });
              } else {
                if (object.material.dispose) object.material.dispose();
              }
            }
          }
        });
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
        if (mount && mount.parentNode) mount.parentNode.removeChild(mount);
      }
    };
  }
};

export default SpiralStormAnimation;
