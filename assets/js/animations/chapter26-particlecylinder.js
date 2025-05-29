// chapter26-particlecylinder.js - Animation cho chương 26: Particle Cylinder Radiance
// Được chuyển từ raw_animation/26, tuân thủ chuẩn animation module của hệ thống
import animationUtils from './animation-utils.js';

const chapter26ParticleCylinder = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let renderer, scene, camera, particleMaterial, geometry, points, animationFrameId, clock;
    const width = this.settings.width;
    const height = this.settings.height;
    // Setup scene
    scene = new window.THREE.Scene();
    camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new window.THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xF0EEE6);
    container.appendChild(renderer.domElement);
    camera.position.z = 6.25;

    // Particle material
    particleMaterial = new window.THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.4 }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        float rand(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        void main() {
          vColor = customColor;
          vec3 pos = position;
          float radius = length(pos.xz);
          float angle = atan(pos.z, pos.x);
          float height = pos.y;
          float pulse = sin(time * 2.0) * 0.2 + 0.8;
          float wave = sin(radius * 3.0 - time * 3.0) * 0.2;
          float verticalWave = cos(radius * 2.0 - time * 1.5) * 0.3;
          float rotationSpeed = 0.05 / (radius + 1.0);
          float newAngle = angle + time * rotationSpeed;
          vec3 newPos;
          newPos.x = cos(newAngle) * (radius + wave) * pulse;
          newPos.z = sin(newAngle) * (radius + wave) * pulse;
          newPos.y = height + verticalWave;
          newPos *= 2.34375;
          pos = newPos;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (100.0 / -mvPosition.z);
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

    // Generate particles
    const count = 37500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const radius = Math.pow(t, 0.5);
      const angle = t * Math.PI * 30;
      const height = (Math.random() - 0.5) * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      const centerDist = Math.sqrt(radius);
      const baseShade = 0.02 + centerDist * 0.13;
      const variation = Math.random() * 0.05;
      const shade = baseShade + variation;
      colors[i * 3] = shade;
      colors[i * 3 + 1] = shade;
      colors[i * 3 + 2] = shade;
      sizes[i] = (1.0 - centerDist) * 0.164 + 0.133;
    }
    geometry = new window.THREE.BufferGeometry();
    geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new window.THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new window.THREE.BufferAttribute(sizes, 1));
    points = new window.THREE.Points(geometry, particleMaterial);
    scene.add(points);
    clock = new window.THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * 0.4;
      particleMaterial.uniforms.time.value = time;
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        if (geometry) geometry.dispose();
        if (particleMaterial) particleMaterial.dispose();
      }
    };
  }
};

export default chapter26ParticleCylinder;
