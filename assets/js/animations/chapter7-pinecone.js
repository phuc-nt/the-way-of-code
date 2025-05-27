// chapter7-pinecone.js
// Animation cho Chapter 7: Pinecone Delicate
// Visualization: A delicate structure that endures through transparency and interconnection
// Themes: detachment leads to fulfillment, eternal endurance, selfless service

import animationUtils from './animation-utils.js';

const chapter7Animation = {
  // Thiết lập riêng cho animation này
  settings: {
    colors: animationUtils.colors,
    width: 550,
    height: 550,
    layers: 38,
    scalesPerLayer: 8
  },
  
  init(container) {
    if (!container) return null;
    
    // Kiểm tra nếu Three.js có sẵn
    const THREE = window.THREE;
    if (!THREE) {
      return animationUtils.handleError(container, "Three.js không có sẵn");
    }
    
    // Khởi tạo Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(this.settings.colors.background);
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 16;
    camera.position.y = 0;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(this.settings.width, this.settings.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Tạo lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Tạo nhóm chính cho pinecone
    const pineCone = new THREE.Group();
    
    // Khởi tạo đối tượng lưu trữ tài nguyên
    const resources = {
      geometries: [],
      materials: [],
      meshes: [],
      lineSegments: [],
      instancedMeshes: []
    };
    
    // Tạo hình dạng cơ bản cho vảy
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.7, 0.7);
    shape.lineTo(0.5, 1.4);
    shape.lineTo(0, 1.7);
    shape.lineTo(-0.5, 1.4);
    shape.lineTo(-0.7, 0.7);
    shape.closePath();
    
    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };
    
    const scaleGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    resources.geometries.push(scaleGeometry);
    
    // Tạo materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({ 
      color: '#e0ded8',
      transparent: true,
      opacity: 0.15,
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.6,
      thickness: 0.1,
      side: THREE.DoubleSide
    });
    resources.materials.push(glassMaterial);
    
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: '#666666',
      transparent: true,
      opacity: 0.3
    });
    resources.materials.push(wireframeMaterial);
    
    // Tạo edge geometry cho wireframe
    const edgesGeometry = new THREE.EdgesGeometry(scaleGeometry);
    resources.geometries.push(edgesGeometry);
    
    const layers = this.settings.layers;
    const scalesPerLayer = this.settings.scalesPerLayer;
    const totalScales = layers * scalesPerLayer;
    
    // Sử dụng InstancedMesh cho hiệu năng tốt hơn
    const instancedMesh = new THREE.InstancedMesh(scaleGeometry, glassMaterial, totalScales);
    resources.instancedMeshes.push(instancedMesh);
    
    // Khởi tạo các matrix cho từng instance
    let scaleIndex = 0;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    for (let layer = 0; layer < layers; layer++) {
      const yPosition = (layer / layers) * 18 - 9 - 0.9;
      let layerRadius;
      
      if (layer < 10) {
        layerRadius = Math.sin((layer / 10) * Math.PI * 0.5) * 2;
      } else {
        layerRadius = 2 + Math.sin(((layer - 10) / (layers - 10)) * Math.PI) * 2.5;
      }
      
      const taper = 1 - (layer / layers) * 0.3;
      
      for (let i = 0; i < scalesPerLayer; i++) {
        const angle = (i / scalesPerLayer) * Math.PI * 2 + (layer * 0.25);
        
        // Set position
        position.set(
          Math.cos(angle) * layerRadius * taper,
          yPosition,
          Math.sin(angle) * layerRadius * taper
        );
        
        // Set rotation
        rotation.set(Math.PI / 3, angle, 0);
        quaternion.setFromEuler(rotation);
        
        // Set scale
        scale.set(0.8, 0.8, 0.8);
        
        // Compose matrix
        matrix.compose(position, quaternion, scale);
        instancedMesh.setMatrixAt(scaleIndex, matrix);
        
        scaleIndex++;
      }
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    pineCone.add(instancedMesh);
    
    // Tạo wireframe lines
    const wireframeGroup = new THREE.Group();
    for (let layer = 0; layer < layers; layer++) {
      const yPosition = (layer / layers) * 18 - 9 - 0.9;
      let layerRadius;
      
      if (layer < 10) {
        layerRadius = Math.sin((layer / 10) * Math.PI * 0.5) * 2;
      } else {
        layerRadius = 2 + Math.sin(((layer - 10) / (layers - 10)) * Math.PI) * 2.5;
      }
      
      const taper = 1 - (layer / layers) * 0.3;
      
      for (let i = 0; i < scalesPerLayer; i++) {
        const angle = (i / scalesPerLayer) * Math.PI * 2 + (layer * 0.25);
        
        const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
        wireframe.rotation.x = Math.PI / 3;
        wireframe.rotation.y = angle;
        wireframe.position.x = Math.cos(angle) * layerRadius * taper;
        wireframe.position.z = Math.sin(angle) * layerRadius * taper;
        wireframe.position.y = yPosition;
        wireframe.scale.set(0.8, 0.8, 0.8);
        
        resources.lineSegments.push(wireframe);
        wireframeGroup.add(wireframe);
      }
    }
    
    pineCone.add(wireframeGroup);
    scene.add(pineCone);
    
    // Animation
    let time = 0;
    let animationFrameId = null;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      time += 0.005;
      
      pineCone.rotation.y = time * 0.3;
      pineCone.rotation.x = Math.sin(time * 0.5) * 0.05;
      pineCone.rotation.z = Math.cos(time * 0.7) * 0.03;
      
      const breathe = 1 + Math.sin(time * 0.5) * 0.02;
      pineCone.scale.set(breathe, breathe, breathe);
      
      renderer.render(scene, camera);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Ẩn loader khi animation đã sẵn sàng
    animationUtils.fadeOutLoader(container);
    
    // Trả về object với hàm cleanup
    return {
      cleanup: () => {
        // Dừng animation
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        // Xóa lights khỏi scene
        scene.remove(ambientLight);
        scene.remove(directionalLight);
        
        // Xóa pinecone khỏi scene
        scene.remove(pineCone);
        
        // Xóa lineSegments khỏi parents
        resources.lineSegments.forEach(line => {
          if (line.parent) {
            line.parent.remove(line);
          }
        });
        
        // Xóa instancedMesh khỏi parent
        resources.instancedMeshes.forEach(instancedMesh => {
          if (instancedMesh.parent) {
            instancedMesh.parent.remove(instancedMesh);
            instancedMesh.dispose();
          }
        });
        
        // Giải phóng geometries
        resources.geometries.forEach(geometry => {
          geometry.dispose();
        });
        
        // Giải phóng materials
        resources.materials.forEach(material => {
          material.dispose();
        });
        
        // Giải phóng renderer
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
      }
    };
  }
};

export default chapter7Animation;
