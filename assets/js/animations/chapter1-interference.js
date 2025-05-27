// chapter1-interference.js - Animation cho Chapter 1
// Visualization của interference waves sử dụng Three.js

import animationUtils from './animation-utils.js';

const chapter1Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    initialZoom: 6, // Kiểm soát khoảng cách zoom của camera
    waveSourceCount: 5,
    resolution: 32,
    colors: animationUtils.colors, // Sử dụng màu từ config chung
    lineOpacity: 0.4 // Opacity riêng cho lines
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    if (typeof THREE === 'undefined') {
      console.error('Three.js chưa được tải. Animation sẽ không hoạt động.');
      return null;
    }
    
    // Các biến nội bộ
    let animationFrameId = null;
    let scene = null;
    let camera = null;
    let renderer = null;
    let lineGroups = [];
    let cameraZoom = this.settings.initialZoom;
    
    // Tạo wave sources
    const createWaveSources = (time, scale) => {
      const result = [];
      const count = this.settings.waveSourceCount;
      
      // Tạo wave sources theo mẫu hình tròn
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = scale * (1 + Math.sin(angle * 3) * 0.2);
        
        result.push({
          position: [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ],
          frequency: 2 + Math.sin(angle * 2),
          amplitude: 0.3 + Math.cos(angle) * 0.1,
          phase: time * 3 + angle
        });
      }
      
      // Thêm nguồn trung tâm
      result.push({
        position: [0, 0, 0],
        frequency: 3,
        amplitude: 0.4,
        phase: time * 4
      });
      
      return result;
    };

    // Tạo geometry trường giao thoa
    const createInterferenceField = (sources, size, resolution, time) => {
      const step = size / resolution;
      const heightMap = [];
      
      // Tính toán lưới mẫu giao thoa
      for (let i = 0; i <= resolution; i++) {
        heightMap[i] = [];
        const x = (i * step) - (size / 2);
        
        for (let j = 0; j <= resolution; j++) {
          const z = (j * step) - (size / 2);
          let height = 0;
          
          // Tổng hợp đóng góp từ tất cả các nguồn sóng
          sources.forEach(({ position: [sx, sy, sz], frequency, amplitude, phase }) => {
            const dx = x - sx;
            const dz = z - sz;
            const distance = Math.sqrt(dx * dx + dz * dz);
            height += Math.sin(distance * frequency - time * 5 + phase) * 
                     amplitude * Math.exp(-distance * 0.3);
          });
          
          heightMap[i][j] = height;
        }
      }
      
      const linesMaterial = new THREE.LineBasicMaterial({ 
        color: parseInt(this.settings.colors.primary.replace('#', '0x'), 16),
        transparent: true,
        opacity: this.settings.lineOpacity
      });
      
      const linesGroup = new THREE.Group();
      lineGroups.push(linesGroup);
      
      // Tạo đường thẳng ngang
      for (let i = 0; i <= resolution; i++) {
        const geometry = new THREE.BufferGeometry();
        const points = [];
        const x = (i * step) - (size / 2);
        
        for (let j = 0; j <= resolution; j++) {
          const z = (j * step) - (size / 2);
          points.push(x, heightMap[i][j], z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const line = new THREE.Line(geometry, linesMaterial);
        linesGroup.add(line);
      }
      
      // Tạo đường thẳng dọc
      for (let j = 0; j <= resolution; j++) {
        const geometry = new THREE.BufferGeometry();
        const points = [];
        const z = (j * step) - (size / 2);
        
        for (let i = 0; i <= resolution; i++) {
          const x = (i * step) - (size / 2);
          points.push(x, heightMap[i][j], z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const line = new THREE.Line(geometry, linesMaterial);
        linesGroup.add(line);
      }
      
      // Thêm đường nhấn mạnh giao thoa
      for (let i = 1; i < resolution; i++) {
        for (let j = 1; j < resolution; j++) {
          const x = (i * step) - (size / 2);
          const z = (j * step) - (size / 2);
          const height = heightMap[i][j];
          const heightDiff = Math.abs(
            height - 
            (heightMap[i-1][j] + heightMap[i+1][j] + 
             heightMap[i][j-1] + heightMap[i][j+1]) / 4
          );
          
          if (heightDiff > 0.2) {
            const geometry1 = new THREE.BufferGeometry();
            const points1 = [
              x - step/2, height, z - step/2,
              x + step/2, height, z + step/2
            ];
            geometry1.setAttribute('position', new THREE.Float32BufferAttribute(points1, 3));
            const line1 = new THREE.Line(geometry1, linesMaterial);
            linesGroup.add(line1);
            
            const geometry2 = new THREE.BufferGeometry();
            const points2 = [
              x - step/2, height, z + step/2,
              x + step/2, height, z - step/2
            ];
            geometry2.setAttribute('position', new THREE.Float32BufferAttribute(points2, 3));
            const line2 = new THREE.Line(geometry2, linesMaterial);
            linesGroup.add(line2);
          }
        }
      }
      
      return linesGroup;
    };

    // Thiết lập container và kích thước
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = animationUtils.getDevicePixelRatio();

    // Thiết lập Scene, camera, renderer
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      
      // Kiểm tra hỗ trợ WebGL
      if (window.WebGLRenderingContext) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height);
        renderer.setClearColor(parseInt(animationUtils.colors.background.replace('#', '0x'), 16));
        container.appendChild(renderer.domElement);
        
        // Xóa loader với hiệu ứng fade out
        animationUtils.fadeOutLoader(container);
      } else {
        // Fallback khi WebGL không được hỗ trợ
        return animationUtils.handleError(container, 'Trình duyệt của bạn không hỗ trợ WebGL, không thể hiển thị hiệu ứng.');
      }
    } catch (error) {
      return animationUtils.handleError(container, `Lỗi khi tạo renderer: ${error.message}`);
    }

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, 3, -5);
    
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    // Định vị camera sử dụng biến zoom
    camera.position.set(0, 0, cameraZoom);
    camera.lookAt(0, 0, 0);

    // Tạo nhóm cho hệ thống giao thoa
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Kiểm tra nếu khởi tạo thành công
    if (!renderer || !scene || !camera) {
      return {
        cleanup: () => {
          console.log("Không có animation nào để dọn dẹp");
        }
      };
    }

    // Vòng lặp animation
    let time = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      time += 0.0013;
      
      // Xóa các nhóm đường thẳng trước đó
      mainGroup.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.children.forEach((line) => {
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
          });
          mainGroup.remove(child);
        }
      });
      lineGroups = [];
      
      // Tạo và thêm trường giao thoa mới
      const sources1 = createWaveSources(time, 1.5);
      const field1 = createInterferenceField(sources1, 1.5 * 4, 32, time);
      mainGroup.add(field1);
      
      const sources2 = createWaveSources(time + 0.33, 0.8);
      const field2 = createInterferenceField(sources2, 0.8 * 4, 32, time + 0.33);
      field2.position.set(0, 1.5, 0);
      field2.rotation.set(Math.PI/6, 0, Math.PI/4);
      mainGroup.add(field2);
      
      const sources3 = createWaveSources(time + 0.66, 0.8);
      const field3 = createInterferenceField(sources3, 0.8 * 4, 32, time + 0.66);
      field3.position.set(0, -1.5, 0);
      field3.rotation.set(-Math.PI/6, 0, -Math.PI/4);
      mainGroup.add(field3);
      
      // Xoay nhóm chính
      mainGroup.rotation.y = Math.sin(time * 0.3) * 0.2;
      mainGroup.rotation.x = Math.cos(time * 0.2) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Xử lý thay đổi kích thước
    const handleResize = () => {
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = animationUtils.getDevicePixelRatio();
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Trả về đối tượng với hàm dọn dẹp
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        
        if (scene) {
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material) => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            } else if (object instanceof THREE.Line) {
              if (object.geometry) object.geometry.dispose();
              if (object.material) object.material.dispose();
            }
          });
        }
      }
    };
  }
};

export default chapter1Animation;
