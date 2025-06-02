// Animation for Chapter 63: Delicate Torus Knot
// Visualization: A knot that forms and moves without strain, showing how complexity emerges from simple principles

import animationUtils from './animation-utils.js';

const CANVAS_SIZE = 550;

const DelicateTorusKnotAnimation = {
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
    let threeContainer = container.querySelector('.delicate-torus-knot-container');
    if (!threeContainer) {
      threeContainer = document.createElement('div');
      threeContainer.className = 'delicate-torus-knot-container';
      threeContainer.style.width = '100%';
      threeContainer.style.height = '100%';
      threeContainer.style.position = 'absolute';
      threeContainer.style.top = '0';
      threeContainer.style.left = '0';
      container.appendChild(threeContainer);
    }

    let renderer, scene, camera, knot, animationFrameId, geometry, material, edges;
    let running = true;

    function cleanup() {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (edges) edges.dispose();
      if (scene && knot) scene.remove(knot);
      if (scene && scene.clear) scene.clear();
      if (renderer) {
        if (threeContainer && renderer.domElement && threeContainer.contains(renderer.domElement)) {
          threeContainer.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
      }
      knot = null;
      geometry = null;
      material = null;
      edges = null;
      renderer = null;
      scene = null;
      camera = null;
      if (threeContainer && threeContainer.parentNode) threeContainer.parentNode.removeChild(threeContainer);
    }

    // Dynamically import Three.js from CDN for browser compatibility
    import('https://cdn.skypack.dev/three@0.152.2').then(THREE => {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
      renderer.setClearColor(animationUtils.colors.background);
      threeContainer.appendChild(renderer.domElement);
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 4;
      geometry = new THREE.TorusKnotGeometry(1.8, 0.3, 150, 24, 3, 4);
      material = new THREE.LineBasicMaterial({ color: 0x777777, transparent: true, opacity: 0.7, linewidth: 0.25 });
      edges = new THREE.EdgesGeometry(geometry);
      knot = new THREE.LineSegments(edges, material);
      knot.position.set(0, 0, 0);
      scene.add(knot);
      let time = 0;
      function animate() {
        if (!running) return;
        animationFrameId = requestAnimationFrame(animate);
        time += 0.002;
        knot.rotation.x = Math.PI / 6 + Math.sin(time * 0.25) * 0.2;
        knot.rotation.y = time * 0.4 + Math.sin(time * 0.15) * 0.3;
        knot.rotation.z = Math.cos(time * 0.2) * 0.15;
        knot.position.x = Math.sin(time * 0.1) * 0.1;
        knot.position.y = Math.cos(time * 0.15) * 0.1;
        const scale = 0.95 + 0.05 * Math.sin(time * 0.6 + Math.sin(time * 0.25) * 0.3);
        knot.scale.setScalar(scale);
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

export default DelicateTorusKnotAnimation;
