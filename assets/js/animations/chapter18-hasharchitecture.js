// chapter18-hasharchitecture.js - Animation cho chương 18: Hash Architecture
import animationUtils from './animation-utils.js';

const chapter18HashArchitecture = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    // Tạo scene Three.js
    const scene = new window.THREE.Scene();
    scene.background = new window.THREE.Color(animationUtils.colors.background);
    // Camera
    const camera = new window.THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    // Renderer
    const renderer = new window.THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    // Main group
    const group = new window.THREE.Group();
    scene.add(group);
    // Recursive pattern function
    function createRecursivePattern(size, depth, maxDepth, opacity, position, rotation) {
      const group = new window.THREE.Group();
      // Base square
      const baseGeometry = new window.THREE.BufferGeometry();
      const basePoints = [
        new window.THREE.Vector3(-size, -size, 0),
        new window.THREE.Vector3(size, -size, 0),
        new window.THREE.Vector3(size, size, 0),
        new window.THREE.Vector3(-size, size, 0),
        new window.THREE.Vector3(-size, -size, 0)
      ];
      baseGeometry.setFromPoints(basePoints);
      const baseMaterial = new window.THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity });
      const baseLine = new window.THREE.Line(baseGeometry, baseMaterial);
      group.add(baseLine);
      // Diagonals
      const diagonal1Geometry = new window.THREE.BufferGeometry();
      diagonal1Geometry.setFromPoints([
        new window.THREE.Vector3(-size, -size, 0),
        new window.THREE.Vector3(size, size, 0)
      ]);
      const diagonal1 = new window.THREE.Line(diagonal1Geometry, baseMaterial);
      group.add(diagonal1);
      const diagonal2Geometry = new window.THREE.BufferGeometry();
      diagonal2Geometry.setFromPoints([
        new window.THREE.Vector3(size, -size, 0),
        new window.THREE.Vector3(-size, size, 0)
      ]);
      const diagonal2 = new window.THREE.Line(diagonal2Geometry, baseMaterial);
      group.add(diagonal2);
      // Recursion
      if (depth < maxDepth) {
        const newSize = size * 0.5;
        const offset = size * 0.7;
        const childPositions = [
          {position: [offset, offset, 0], rotation: [0, 0, Math.PI/4]},
          {position: [-offset, offset, 0], rotation: [0, 0, -Math.PI/4]},
          {position: [offset, -offset, 0], rotation: [0, 0, -Math.PI/4]},
          {position: [-offset, -offset, 0], rotation: [0, 0, Math.PI/4]}
        ];
        childPositions.forEach(child => {
          const childElement = createRecursivePattern(newSize, depth + 1, maxDepth, opacity - 0.1, child.position, child.rotation);
          childElement.position.set(child.position[0], child.position[1], child.position[2]);
          childElement.rotation.set(child.rotation[0], child.rotation[1], child.rotation[2]);
          group.add(childElement);
        });
      }
      group.position.set(position[0], position[1], position[2]);
      group.rotation.set(rotation[0], rotation[1], rotation[2]);
      return group;
    }
    // Add patterns
    group.add(createRecursivePattern(2, 0, 3, 0.6, [0, 0, 0], [0, 0, 0]));
    group.add(createRecursivePattern(1, 0, 2, 0.6, [0, 0, 1], [Math.PI/6, Math.PI/6, Math.PI/4]));
    group.add(createRecursivePattern(0.8, 0, 2, 0.6, [0, 0, -1], [-Math.PI/6, -Math.PI/6, -Math.PI/4]));
    // Lighting
    scene.add(new window.THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new window.THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, 3, -5);
    scene.add(pointLight);
    // Animation
    const clock = new window.THREE.Clock();
    let animationId = null;
    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      group.rotation.y = Math.sin(time * 0.15) * 0.2;
      group.rotation.x = Math.cos(time * 0.1) * 0.1;
      renderer.render(scene, camera);
    }
    animate();
    animationUtils.fadeOutLoader(container);
    // Resize
    function handleResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', handleResize);
    // Cleanup
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        scene.traverse(object => {
          if (object instanceof window.THREE.Mesh || object instanceof window.THREE.Line) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }
};

export default chapter18HashArchitecture;
