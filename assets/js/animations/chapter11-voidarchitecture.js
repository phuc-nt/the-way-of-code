// chapter11-voidarchitecture.js - Animation cho Chapter 11
// Visualization về "không gian âm" thể hiện qua bánh xe, bình gốm và căn phòng

import animationUtils from './animation-utils.js';

const chapter11Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors, // Sử dụng màu từ config chung
    opacity: 0.6,
    rotationSpeeds: {
      wheel: 0.002,
      vessel: 0.001,
      room: 0.0005
    }
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
    let wheel = null;
    let vessel = null;
    let room = null;
    
    // Khởi tạo Scene
    scene = new THREE.Scene();
    
    // Lấy kích thước container
    const { width, height } = animationUtils.getContainerDimensions(container);
    const dpr = animationUtils.getDevicePixelRatio();
    
    // Khởi tạo camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    // Khởi tạo renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(dpr, 2)); // Giới hạn ở 2 cho hiệu năng
    renderer.setSize(width, height);
    renderer.setClearColor(parseInt(this.settings.colors.background.replace('#', '0x'), 16));
    
    container.appendChild(renderer.domElement);
    
    // Thêm ánh sáng
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0x808080, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    // Khởi tạo vật liệu
    const material = new THREE.LineBasicMaterial({ 
      color: parseInt(this.settings.colors.primary.replace('rgba(', '').split(',')[0], 10),
      transparent: true,
      opacity: this.settings.opacity
    });
    
    // Tạo bánh xe với 30 nan hoa ("Ba mươi nan hoa kết nối trục")
    const createWheel = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const spokes = 30;
      const radius = 8;
      const hubRadius = 1;
      
      // Tạo trục bánh xe
      for (let i = 0; i < spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2;
        const nextAngle = ((i + 1) / spokes) * Math.PI * 2;
        
        // Đường tròn trục
        vertices.push(
          Math.cos(angle) * hubRadius, 0, Math.sin(angle) * hubRadius,
          Math.cos(nextAngle) * hubRadius, 0, Math.sin(nextAngle) * hubRadius
        );
        
        // Nan hoa
        vertices.push(
          Math.cos(angle) * hubRadius, 0, Math.sin(angle) * hubRadius,
          Math.cos(angle) * radius, 0, Math.sin(angle) * radius
        );
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    // Tạo bình gốm ("Đất sét tạo hình bình gốm")
    const createVessel = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const layers = 20;
      const pointsPerLayer = 16;
      
      for (let i = 0; i <= layers; i++) {
        const y = i - layers/2;
        // Tạo hình dạng bình
        const radius = 3 * Math.sin(Math.PI * (i/layers));
        
        for (let j = 0; j < pointsPerLayer; j++) {
          const angle1 = (j/pointsPerLayer) * Math.PI * 2;
          const angle2 = ((j+1)/pointsPerLayer) * Math.PI * 2;
          
          vertices.push(
            Math.cos(angle1) * radius, y, Math.sin(angle1) * radius,
            Math.cos(angle2) * radius, y, Math.sin(angle2) * radius
          );

          // Đường thẳng dọc
          if (i < layers) {
            vertices.push(
              Math.cos(angle1) * radius, y, Math.sin(angle1) * radius,
              Math.cos(angle1) * radius, y + 1, Math.sin(angle1) * radius
            );
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    // Tạo căn phòng ("Ta xây tường với cửa sổ và cửa ra vào")
    const createRoom = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const size = 6;
      const height = 8;
      
      // Khung cơ bản
      const basePoints = [
        [-size, 0, -size],
        [size, 0, -size],
        [size, 0, size],
        [-size, 0, size],
        [-size, height, -size],
        [size, height, -size],
        [size, height, size],
        [-size, height, size]
      ];

      // Kết nối các điểm
      for (let i = 0; i < 4; i++) {
        // Hình vuông dưới
        vertices.push(
          ...basePoints[i],
          ...basePoints[(i + 1) % 4]
        );
        // Hình vuông trên
        vertices.push(
          ...basePoints[i + 4],
          ...basePoints[((i + 1) % 4) + 4]
        );
        // Các đường thẳng đứng
        vertices.push(
          ...basePoints[i],
          ...basePoints[i + 4]
        );
      }

      // Thêm khung cửa
      const doorWidth = 2;
      const doorHeight = 4;
      vertices.push(
        -doorWidth/2, 0, -size,
        -doorWidth/2, doorHeight, -size,
        doorWidth/2, 0, -size,
        doorWidth/2, doorHeight, -size,
        -doorWidth/2, doorHeight, -size,
        doorWidth/2, doorHeight, -size
      );

      // Thêm cửa sổ
      const windowSize = 1.5;
      const windowHeight = 5;
      const addWindow = (x, z) => {
        vertices.push(
          x - windowSize, windowHeight - windowSize, z,
          x + windowSize, windowHeight - windowSize, z,
          x + windowSize, windowHeight + windowSize, z,
          x - windowSize, windowHeight + windowSize, z,
          x - windowSize, windowHeight - windowSize, z
        );
      };

      // Thêm cửa sổ vào các mặt
      addWindow(-size, 0);
      addWindow(size, 0);

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    // Khởi tạo các đối tượng
    wheel = createWheel();
    vessel = createVessel();
    room = createRoom();

    // Định vị các phần tử
    wheel.position.set(-12, 0, 0);
    vessel.position.set(12, 0, 0);
    room.position.set(0, -4, 0);

    scene.add(wheel);
    scene.add(vessel);
    scene.add(room);

    // Định vị camera
    camera.position.set(15, 15, 25);
    camera.lookAt(0, 0, 0);

    // Animation
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Xoay nhẹ nhàng
      wheel.rotation.y += this.settings.rotationSpeeds.wheel;
      vessel.rotation.y += this.settings.rotationSpeeds.vessel;
      room.rotation.y += this.settings.rotationSpeeds.room;

      renderer.render(scene, camera);
    };
    
    // Khởi động animation
    animate();

    // Xử lý resize
    const handleResize = () => {
      const { width, height } = animationUtils.getContainerDimensions(container);
      const dpr = animationUtils.getDevicePixelRatio();
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(dpr, 2));
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object có hàm cleanup
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        
        // Dọn dẹp tài nguyên Three.js
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        
        // Dọn dẹp geometry và materials
        if (scene) {
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
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
      }
    };
  }
};

export default chapter11Animation;