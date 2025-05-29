// chapter29-fractalbranchesacred.js - Animation cho chương 29: Fractal Branches Sacred (Three.js)
// Được chuyển từ raw_animation/29, tuân thủ chuẩn animation module của hệ thống
import animationUtils from './animation-utils.js';

const chapter29FractalBranchesSacred = {
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550
  },

  init(container) {
    if (!container) return null;
    const loader = container.querySelector('.animation-loader');
    let renderer, scene, camera, mainGroup, fractalSystem, animationFrameId, clock;
    const width = this.settings.width;
    const height = this.settings.height;
    // Setup scene
    scene = new window.THREE.Scene();
    camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new window.THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor('#F0EEE7');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    camera.position.z = 5;
    mainGroup = new window.THREE.Group();
    scene.add(mainGroup);
    // Lighting
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new window.THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, 3, -5);
    scene.add(pointLight);
    // Fractal system
    // ... FractalBranch, FractalSystem classes (see below) ...
    // --- BEGIN FractalBranch & FractalSystem ---
    const LINGER_START = 0.6;
    const LINGER_END = 0.8;
    const DELAY_PER_LEVEL = 0.15;
    const GROWTH_MULTIPLIER = 3;
    const CROSS_BRACE_COUNT = 2;
    const WAVE_AMPLITUDE = 0.05;
    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    class FractalBranch {
      constructor(props, parent) {
        this.props = props;
        this.parent = parent;
        this.lines = [];
        this.children = [];
        this.group = new window.THREE.Group();
        this.parent.add(this.group);
        this.disposed = false;
      }
      update(phase) {
        if (this.disposed) return;
        const { start, length, angle, depth, maxDepth, scale } = this.props;
        const [sx, sy, sz] = start;
        const atMaxDepth = depth === maxDepth;
        let growthFactor;
        if (phase >= 0.9) {
          growthFactor = 1;
        } else if (atMaxDepth && phase > LINGER_START) {
          growthFactor = 1;
        } else {
          const growthPhase = Math.min(1, Math.max(0, (phase - depth * DELAY_PER_LEVEL) * GROWTH_MULTIPLIER));
          growthFactor = easeInOut(growthPhase);
        }
        const actualLength = length * growthFactor;
        const ex = sx + Math.cos(angle) * actualLength;
        const ey = sy + Math.sin(angle) * actualLength;
        const ez = sz;
        if (this.lines.length === 0) {
          const mainGeometry = new window.THREE.BufferGeometry();
          const mainPoints = new Float32Array([sx, sy, sz, ex, ey, ez]);
          mainGeometry.setAttribute('position', new window.THREE.BufferAttribute(mainPoints, 3));
          const mainMaterial = new window.THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.4, linewidth: 0.5 });
          const mainLine = new window.THREE.Line(mainGeometry, mainMaterial);
          this.group.add(mainLine);
          this.lines.push(mainLine);
          if (growthFactor > 0.3) {
            const crossLength = length * (0.2 + Math.sin(phase * Math.PI * 2) * 0.05);
            const crossAngle1 = angle + Math.PI/2;
            const crossAngle2 = angle - Math.PI/2;
            for (let i = 0; i < CROSS_BRACE_COUNT; i++) {
              const t = (i + 1) / 4;
              const px = sx + (ex - sx) * t;
              const py = sy + (ey - sy) * t;
              const pz = sz + (ez - sz) * t;
              const wave = Math.sin(t * Math.PI * 2 + phase * Math.PI * 4) * WAVE_AMPLITUDE;
              const crossGeometry = new window.THREE.BufferGeometry();
              const crossPoints = new Float32Array([
                px + Math.cos(crossAngle1) * crossLength * (t + wave),
                py + Math.sin(crossAngle1) * crossLength * (t + wave),
                pz,
                px + Math.cos(crossAngle2) * crossLength * (t + wave),
                py + Math.sin(crossAngle2) * crossLength * (t + wave),
                pz
              ]);
              crossGeometry.setAttribute('position', new window.THREE.BufferAttribute(crossPoints, 3));
              const crossMaterial = new window.THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.4, linewidth: 0.5 });
              const crossLine = new window.THREE.Line(crossGeometry, crossMaterial);
              this.group.add(crossLine);
              this.lines.push(crossLine);
            }
          }
        } else {
          const mainLine = this.lines[0];
          const positions = mainLine.geometry.attributes.position.array;
          positions[3] = ex;
          positions[4] = ey;
          positions[5] = ez;
          mainLine.geometry.attributes.position.needsUpdate = true;
          if (this.lines.length > 1 && growthFactor > 0.3) {
            const crossLength = length * (0.2 + Math.sin(phase * Math.PI * 2) * 0.05);
            for (let i = 0; i < CROSS_BRACE_COUNT; i++) {
              const lineIndex = i + 1;
              if (lineIndex < this.lines.length) {
                const crossLine = this.lines[lineIndex];
                const positions = crossLine.geometry.attributes.position.array;
                const t = (i + 1) / 4;
                const px = sx + (ex - sx) * t;
                const py = sy + (ey - sy) * t;
                const pz = sz + (ez - sz) * t;
                const wave = Math.sin(t * Math.PI * 2 + phase * Math.PI * 4) * WAVE_AMPLITUDE;
                const crossAngle1 = angle + Math.PI/2;
                const crossAngle2 = angle - Math.PI/2;
                positions[0] = px + Math.cos(crossAngle1) * crossLength * (t + wave);
                positions[1] = py + Math.sin(crossAngle1) * crossLength * (t + wave);
                positions[2] = pz;
                positions[3] = px + Math.cos(crossAngle2) * crossLength * (t + wave);
                positions[4] = py + Math.sin(crossAngle2) * crossLength * (t + wave);
                positions[5] = pz;
                crossLine.geometry.attributes.position.needsUpdate = true;
              }
            }
          }
        }
        if (depth < maxDepth && !(phase >= 0.8 && depth > 0) && phase >= depth * 0.15 && phase < 0.95) {
          const numBranches = 3 + (depth < 2 ? 1 : 0);
          if (this.children.length === 0) {
            for (let i = 0; i < numBranches; i++) {
              const t = (i + 1) / (numBranches + 1);
              const spread = 0.8 + (depth * 0.1);
              const branchAngle = angle + (t - 0.5) * Math.PI * spread;
              const branchProps = {
                start: [
                  sx + (ex - sx) * t,
                  sy + (ey - sy) * t,
                  sz + (ez - sz) * t
                ],
                length: length * (0.6 - depth * 0.05),
                angle: branchAngle,
                depth: depth + 1,
                maxDepth,
                scale: scale * 0.8
              };
              this.children.push(new FractalBranch(branchProps, this.group));
            }
          } else {
            for (let i = 0; i < this.children.length; i++) {
              const t = (i + 1) / (numBranches + 1);
              this.children[i].props.start = [
                sx + (ex - sx) * t,
                sy + (ey - sy) * t,
                sz + (ez - sz) * t
              ];
            }
          }
        }
        this.children.forEach(child => child.update(phase));
      }
      dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.children.forEach(child => child.dispose());
        this.children = [];
        this.lines.forEach(line => {
          this.group.remove(line);
          line.geometry.dispose();
          line.material.dispose();
        });
        this.lines = [];
        this.parent.remove(this.group);
      }
    }
    class FractalSystem {
      constructor(parentGroup) {
        this.group = new window.THREE.Group();
        parentGroup.add(this.group);
        this.branches = [];
        this.initialize();
      }
      initialize() {
        const count = 6;
        const scale = 2;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const branchProps = {
            start: [
              Math.cos(angle) * scale * 0.2,
              Math.sin(angle) * scale * 0.2,
              0
            ],
            length: scale,
            angle: angle + Math.PI/2,
            depth: 0,
            maxDepth: 7,
            scale: scale
          };
          this.branches.push(new FractalBranch(branchProps, this.group));
        }
      }
      update(time) {
        this.branches.forEach(branch => branch.update(time));
      }
      dispose() {
        this.branches.forEach(branch => branch.dispose());
        this.branches = [];
        this.group.parent && this.group.parent.remove(this.group);
      }
    }
    // --- END FractalBranch & FractalSystem ---
    fractalSystem = new FractalSystem(mainGroup);
    clock = new window.THREE.Clock();
    let lastFrameTime = 0;
    const CYCLE_LENGTH = 60;
    const GROWTH_PHASE_LENGTH = 25;
    const FRAME_RATE = 20;
    const frameInterval = 1000 / FRAME_RATE;
    function animate(currentTime) {
      if (!lastFrameTime) lastFrameTime = currentTime;
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        const elapsedTime = clock.getElapsedTime();
        const cycleTime = elapsedTime % CYCLE_LENGTH;
        const isGrowthComplete = cycleTime >= GROWTH_PHASE_LENGTH;
        const time = isGrowthComplete ? 1.0 : (cycleTime / GROWTH_PHASE_LENGTH);
        fractalSystem.update(time);
        if (isGrowthComplete) {
          const spinStartTime = elapsedTime - GROWTH_PHASE_LENGTH;
          const verySlowRotationSpeed = 0.025;
          mainGroup.rotation.z = spinStartTime * verySlowRotationSpeed;
          mainGroup.rotation.x = 0;
          mainGroup.rotation.y = 0;
        } else {
          mainGroup.rotation.x = 0;
          mainGroup.rotation.y = 0;
          mainGroup.rotation.z = 0;
        }
        renderer.render(scene, camera);
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    animationUtils.fadeOutLoader(container);
    return {
      cleanup: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        if (fractalSystem) fractalSystem.dispose();
      }
    };
  }
};

export default chapter29FractalBranchesSacred;
