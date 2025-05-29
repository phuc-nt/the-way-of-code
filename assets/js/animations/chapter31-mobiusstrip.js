// chapter31-mobiusstrip.js - Animation cho Chapter 31
// Visualization: Wireframe Möbius strip with smooth animation

import animationUtils from './animation-utils.js';

const chapter31Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    numPoints: 300,           // Số điểm để tạo hình Möbius strip
    ribbonWidth: 0.5,         // Chiều rộng của dải băng
    springStrength: 0.03,     // Độ mạnh của lực đàn hồi
    damping: 0.99,            // Hệ số giảm chấn
    momentum: 0.95,           // Hệ số quán tính
    grabInfluence: 3.0,       // Ảnh hưởng của việc kéo chuột
    rotationSpeed: 0.2        // Tốc độ xoay của dải băng
  },
  
  // Hàm khởi tạo animation - được gọi từ animation manager
  init(container) {
    if (!container) return null;
    if (typeof THREE === 'undefined') {
      console.error('Three.js chưa được tải. Animation sẽ không hoạt động.');
      return null;
    }
    
    // Sử dụng hàm tiện ích để tạo canvas vuông chuẩn
    const canvas = document.createElement('canvas');
    const width = 550;
    const height = 550;
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    
    // Khai báo các biến cần thiết
    const numPoints = this.settings.numPoints;
    const ribbonWidth = this.settings.ribbonWidth;
    const dpr = animationUtils.getDevicePixelRatio();
    
    let mouse = { x: 0, y: 0, z: 0 };
    let target = { x: 0, y: 0, z: 0 };
    let velocity = { x: 0, y: 0, z: 0 };
    let isGrabbed = false;
    let grabPoint = 0;
    let time = 0;
    let animationFrameId = null;
    
    // Thiết lập scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      antialias: true,
      alpha: true
    });
    
    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(this.settings.colors.background);
    
    // Tạo geometry cho Möbius strip
    const createGeometry = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numPoints * 2 * 3);
      const normals = new Float32Array(numPoints * 2 * 3);
      const indices = [];

      // Tạo các tam giác
      for (let i = 0; i < numPoints - 1; i++) {
        indices.push(i * 2, i * 2 + 1, (i + 1) * 2);
        indices.push(i * 2 + 1, (i + 1) * 2 + 1, (i + 1) * 2);
      }

      // Khép vòng tròn cho dải Möbius
      indices.push((numPoints - 1) * 2, (numPoints - 1) * 2 + 1, 0);
      indices.push((numPoints - 1) * 2 + 1, 1, 0);

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setIndex(indices);

      return geometry;
    };

    // Tạo material kiểu wireframe
    const createMaterial = () => {
      return new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth: 1,
        side: THREE.DoubleSide
      });
    };
    
    // Tạo geometry và material
    const geometry = createGeometry();
    const material = createMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    
    const groupRef = new THREE.Group();
    groupRef.add(mesh);
    scene.add(groupRef);

    // Đặt vị trí camera
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
    
    // Xử lý tương tác chuột
    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse.x = x * 3;
      mouse.y = y * 3;
      
      isGrabbed = true;
    };

    const handlePointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse.x = x * 3;
      mouse.y = y * 3;
    };

    const handlePointerUp = () => {
      isGrabbed = false;
    };

    renderer.domElement.addEventListener('mousedown', handlePointerDown);
    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('mouseup', handlePointerUp);
    renderer.domElement.addEventListener('mouseleave', handlePointerUp);
    
    // Vòng lặp animation
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      time += 0.0015;
      
      // Cập nhật target vật lý
      if (isGrabbed) {
        target.x += (mouse.x - target.x) * 0.3;
        target.y += (mouse.y - target.y) * 0.3;
        target.z += (mouse.z - target.z) * 0.3;
      }
      
      const positions = mesh.geometry.attributes.position.array;
      const normals = mesh.geometry.attributes.normal.array;
      
      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const angle = t * Math.PI * 2;
        
        // Tính toán ảnh hưởng từ điểm kéo
        let influence = 0;
        if (isGrabbed) {
          const distFromGrab = Math.abs(t - grabPoint);
          influence = Math.max(0, 1 - distFromGrab * this.settings.grabInfluence);
          influence = Math.pow(influence, 2);
        }
        
        // Bán kính cơ sở với hiệu ứng "thở" (lớn hơn 25%)
        const baseRadius = 1.875 + Math.sin(time * 0.5 + t * Math.PI * 2) * 0.125;
        const radius = baseRadius * (1 - influence * 0.3);
        
        // Tính toán vị trí cơ sở
        let baseX = Math.cos(angle) * radius;
        let baseY = Math.sin(angle) * radius;
        let baseZ = 0;
        
        // Áp dụng ảnh hưởng của kéo
        if (influence > 0) {
          const targetOffsetX = (target.x - baseX) * influence;
          const targetOffsetY = (target.y - baseY) * influence;
          const targetOffsetZ = (target.z - baseZ) * influence;
          
          baseX += targetOffsetX + velocity.x * influence;
          baseY += targetOffsetY + velocity.y * influence;
          baseZ += targetOffsetZ + velocity.z * influence;
        }
        
        // Tính toán xoắn
        const twist = t * Math.PI + time * this.settings.rotationSpeed * (1 - influence * 0.5);
        
        // Thêm sóng
        const wave = Math.sin(angle * 3 + time * 2) * 0.1;
        const waveX = Math.cos(angle + Math.PI/2) * wave;
        const waveY = Math.sin(angle + Math.PI/2) * wave;
        const waveZ = Math.sin(angle * 2 + time) * 0.2;
        
        // Tính toán vector tiếp tuyến
        const tangentX = -Math.sin(angle);
        const tangentY = Math.cos(angle);
        const tangentZ = 0;
        
        // Tính toán vector pháp tuyến với xoắn
        const normalX = Math.cos(angle + twist);
        const normalY = Math.sin(angle + twist);
        const normalZ = Math.sin(twist);
        
        // Tính toán binormal
        const binormalX = tangentY * normalZ - tangentZ * normalY;
        const binormalY = tangentZ * normalX - tangentX * normalZ;
        const binormalZ = tangentX * normalY - tangentY * normalX;
        
        // Biến thiên chiều rộng
        const width = ribbonWidth * (1.0 + Math.sin(twist * 2) * 0.1);
        
        // Đặt các vị trí
        const idx = i * 6;
        positions[idx] = baseX + waveX + binormalX * width;
        positions[idx + 1] = baseY + waveY + binormalY * width;
        positions[idx + 2] = baseZ + waveZ + binormalZ * width;
        positions[idx + 3] = baseX + waveX - binormalX * width;
        positions[idx + 4] = baseY + waveY - binormalY * width;
        positions[idx + 5] = baseZ + waveZ - binormalZ * width;
        
        // Đặt các pháp tuyến
        normals[idx] = normalX;
        normals[idx + 1] = normalY;
        normals[idx + 2] = normalZ;
        normals[idx + 3] = -normalX;
        normals[idx + 4] = -normalY;
        normals[idx + 5] = -normalZ;
      }
      
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.geometry.attributes.normal.needsUpdate = true;
      
      // Xoay nhẹ nhàng qua thời gian
      groupRef.rotation.y = Math.sin(time * 0.3) * 0.2;
      groupRef.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    // Hiển thị loader trong quá trình thiết lập
    const loader = container.querySelector('.animation-loader');
    
    // Bắt đầu animation
    animate.call(this);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Xử lý resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Trả về object có hàm cleanup
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
      
        renderer.domElement.removeEventListener('mousedown', handlePointerDown);
        renderer.domElement.removeEventListener('mousemove', handlePointerMove);
        renderer.domElement.removeEventListener('mouseup', handlePointerUp);
        renderer.domElement.removeEventListener('mouseleave', handlePointerUp);
        
        cancelAnimationFrame(animationFrameId);
        
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        
        if (geometry) geometry.dispose();
        if (material) material.dispose();
      }
    };
  }
};

export default chapter31Animation;
