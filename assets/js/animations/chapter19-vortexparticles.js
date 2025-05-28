// chapter19-vortexparticles.js - Animation cho chương 19: Vortex Particle System
// Visualization: Particles naturally drawn to a center point, finding harmony in simplicity
// Themes: simplicity over learning, return to intuition, being the center

import animationUtils from './animation-utils.js';

const chapter19VortexParticles = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let animationId = null;
    let renderer, scene, camera, particleSystem, particleMaterial;

    // Ensure Three.js is available
    if (typeof window.THREE === 'undefined') {
      return animationUtils.handleError(container, 'Không tìm thấy Three.js.');
    }
    const THREE = window.THREE;

    // Setup scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(this.settings.width, this.settings.height);
    renderer.setClearColor(0xF0EEE6, 1);
    container.appendChild(renderer.domElement);
    camera.position.z = 7;

    // Create particles
    const particleCount = 25000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const indices = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random();
      const angle = t * Math.PI * 20;
      const radius = 0.6 + t * 2.2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (t - 0.5) * 5;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      sizes[i] = 0.03 + 0.04 * Math.random();
      opacities[i] = 0.4 + 0.6 * Math.random();
      indices[i] = i;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    particles.setAttribute('index', new THREE.BufferAttribute(indices, 1));

    // Shader material
    particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x333333) },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float index;
        uniform float time;
        varying float vOpacity;
        void main() {
          vOpacity = opacity;
          vec3 pos = position;
          float i = index;
          float speed = 0.2 + 0.2 * fract(i / 1000.0);
          float angle = time * speed + i * 0.001;
          float twistAmount = sin(time * 0.3) * 0.5;
          float twist = pos.y * twistAmount;
          float r = length(pos.xy);
          float breathe = 1.0 + sin(time * 0.5) * 0.1;
          r *= breathe;
          float theta = atan(pos.y, pos.x) + twist;
          pos.x = r * cos(theta);
          pos.y = r * sin(theta);
          pos.z += sin(time * 0.2 + i * 0.01) * 0.2;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
    });
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Animation loop
    const animate = (t) => {
      const time = (t || 0) * 0.0005;
      particleMaterial.uniforms.time.value = time;
      camera.position.x = Math.sin(time * 0.1) * 1.5;
      camera.position.y = Math.cos(time * 0.15) * 1.0;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    // Cleanup
    return {
      cleanup: () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (scene) {
          scene.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      }
    };
  }
};

export default chapter19VortexParticles;
