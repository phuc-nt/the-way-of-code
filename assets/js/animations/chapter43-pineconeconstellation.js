// Animation for Chapter 43: Pinecone Constellation (Three.js)
// Visualization: A delicate constellation that appears through empty space, showing how the gentlest connections create the strongest patterns

const CHAPTER43_SIZE = 550;

const pineconeConstellationAnimation = {
  init(container) {
    if (!container) return null;
    // Hide loader
    const loader = container.querySelector('.animation-loader');
    if (loader) loader.style.display = 'none';

    // Dynamically load Three.js if not present
    function loadThree(callback) {
      if (window.THREE) return callback(window.THREE);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
      script.onload = () => callback(window.THREE);
      document.head.appendChild(script);
    }

    let cleanupFn = null;
    loadThree((THREE) => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#F0EEE6');
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 10;
      camera.position.y = 0;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(CHAPTER43_SIZE, CHAPTER43_SIZE);
      container.appendChild(renderer.domElement);
      // Main group
      const pineCone = new THREE.Group();
      const geometries = [];
      const materials = [];
      const meshes = [];
      const lines = [];
      // Constellation points
      const layers = 45;
      const pointsPerLayer = 12;
      const vertices = [];
      for (let layer = 0; layer < layers; layer++) {
        const yPosition = (layer / layers) * 18 - 9;
        let layerRadius;
        if (layer < 10) {
          layerRadius = 3.5 * (layer / 10) * 0.7;
        } else if (layer < 35) {
          layerRadius = 2.45 + Math.sin(((layer - 10) / 25) * Math.PI) * 1.8;
        } else {
          layerRadius = Math.sin(((layers - layer) / 10) * Math.PI * 0.5) * 2;
        }
        const taper = 1 - (layer / layers) * 0.3;
        for (let i = 0; i < pointsPerLayer; i++) {
          const angle = (i / pointsPerLayer) * Math.PI * 2 + (layer * 0.2);
          const x = Math.cos(angle) * layerRadius * taper;
          const z = Math.sin(angle) * layerRadius * taper;
          vertices.push(new THREE.Vector3(x, yPosition, z));
          const dotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
          geometries.push(dotGeometry);
          const dotMaterial = new THREE.MeshBasicMaterial({ color: '#888888' });
          materials.push(dotMaterial);
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          meshes.push(dot);
          dot.position.set(x, yPosition, z);
          pineCone.add(dot);
        }
      }
      // Line material
      const lineMaterial = new THREE.LineBasicMaterial({
        color: '#999999',
        transparent: true,
        opacity: 0.3
      });
      materials.push(lineMaterial);
      // Layer rings
      for (let layer = 0; layer < layers; layer++) {
        const startIdx = layer * pointsPerLayer;
        const linePoints = [];
        for (let i = 0; i < pointsPerLayer; i++) {
          linePoints.push(vertices[startIdx + i]);
        }
        linePoints.push(vertices[startIdx]);
        const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        geometries.push(geometry);
        const line = new THREE.Line(geometry, lineMaterial);
        lines.push(line);
        pineCone.add(line);
      }
      // Vertical lines
      for (let i = 0; i < pointsPerLayer; i++) {
        const linePoints = [];
        for (let layer = 0; layer < layers; layer++) {
          linePoints.push(vertices[layer * pointsPerLayer + i]);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        geometries.push(geometry);
        const line = new THREE.Line(geometry, lineMaterial);
        lines.push(line);
        pineCone.add(line);
      }
      // Diagonal connections
      for (let layer = 0; layer < layers - 1; layer++) {
        for (let i = 0; i < pointsPerLayer; i++) {
          const currentIdx = layer * pointsPerLayer + i;
          const nextLayerIdx = (layer + 1) * pointsPerLayer + ((i + 1) % pointsPerLayer);
          const linePoints = [vertices[currentIdx], vertices[nextLayerIdx]];
          const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
          geometries.push(geometry);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.push(line);
          pineCone.add(line);
        }
      }
      pineCone.rotation.z = Math.PI;
      scene.add(pineCone);
      let time = 0;
      let animationFrameId = null;
      function animate() {
        animationFrameId = requestAnimationFrame(animate);
        time += 0.00125;
        pineCone.rotation.y += 0.00125;
        const breathe = 1 + Math.sin(time * 0.0625) * 0.02;
        pineCone.scale.set(breathe, breathe, breathe);
        renderer.render(scene, camera);
      }
      animate();
      cleanupFn = function() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        geometries.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        meshes.forEach(mesh => pineCone.remove(mesh));
        lines.forEach(line => pineCone.remove(line));
        scene.remove(pineCone);
        scene.clear && scene.clear();
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (loader) loader.style.display = 'flex';
      };
    });
    return {
      cleanup() {
        if (cleanupFn) cleanupFn();
      }
    };
  }
};

export default pineconeConstellationAnimation;
