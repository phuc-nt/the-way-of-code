// animation-manager.js - Hệ thống quản lý animation trung tâm
// Phần chính quản lý và khởi tạo animation dựa trên chapter ID

// Đối tượng quản lý animation tổng
const animationManager = {
  instance: null,
  
  // Object chứa các thông tin metadata về các animation
  metadata: {
    1: {
      name: "interferenceWaves",
      themes: "Interference, Pattern, Wave, Interaction, Harmony",
      visualization: "Precise geometric interference patterns with wave interactions",
      description: "Hình ảnh trừu tượng về \"cái vô danh\" và \"cái có tên\" - hai khía cạnh của mọi abstraction trong code"
    },
    2: {
      name: "tessellationPatterns",
      themes: "Duality of opposites, quiet example, cycles of creation/dissolution",
      visualization: "Geometric patterns that emerge and dissolve naturally, illustrating how opposites define and transform each other",
      description: "Mô phỏng về sự tương phản, mẫu hình đối lập, và cách chúng bổ sung cho nhau trong thiết kế"
    },
    3: {
      name: "binaryFlow",
      themes: "Emptiness vs expectation, natural self-sufficiency, action through non-action",
      visualization: "Binary patterns that naturally erode and flow, demonstrating how emptiness enables movement",
      description: "Hình ảnh về sự 'không làm' (wu wei) và cách mà khoảng trống tạo ra sự chuyển động tự nhiên"
    },
    4: {
      name: "verticalBars",
      themes: "Inexhaustible source, smoothing complexity, effortless flow",
      visualization: "Vertical patterns that endlessly transform, showing how complexity resolves into fluid motion",
      description: "Hình ảnh về sự liên tục chuyển động mà không cần nỗ lực - từ phức tạp đến đơn giản và ngược lại"
    },
    5: {
      name: "emptyVessel",
      themes: "Impartiality, empty potential, stillness as power",
      visualization: "Particles define a vessel through their movement around emptiness",
      description: "Hình ảnh của một chiếc bình rỗng được định nghĩa bởi không gian trống - thể hiện sức mạnh trong sự im lặng và tiềm năng vô hạn" 
    },
    6: {
      name: "particleFlower",
      themes: "Feminine creative force, eternal fertility, root energy",
      visualization: "Particles bloom and flow from a central source, embodying the eternal creative feminine",
      description: "Hình ảnh về năng lượng sáng tạo nữ tính và sự sinh sôi nảy nở từ một nguồn trung tâm"
    },
    7: {
      name: "pinecone",
      themes: "Detachment leads to fulfillment, eternal endurance, selfless service",
      visualization: "A delicate structure that endures through transparency and interconnection",
      description: "Hình ảnh về sự bền bỉ và khả năng chống chịu thông qua tính trong suốt và kết nối của cấu trúc"
    },
    8: {
      name: "waterAscii",
      themes: "Water as highest good, finding low places, grace without force",
      visualization: "ASCII characters flow like water, seeking their natural level without effort",
      description: "Hình ảnh về tính chất của nước - tìm nơi thấp và yên lặng, nhưng có sức mạnh không thể đo đếm"
    },
    9: {
      name: "canyonFlows",
      themes: "Excess leads to loss, detachment after completion, the way of heaven",
      visualization: "Particles flow naturally downward, neither clinging nor overflowing",
      description: "Hình ảnh về sự hoàn thành tự nhiên và không bám chấp - giống như dòng nước ở hẻm núi tự tìm lối đi riêng"
    },
    10: {
      name: "wavyYinYang",
      themes: "Present awareness, leading without control, doing without expectation",
      visualization: "A meditative circle that breathes and flows while remaining centered in stillness",
      description: "Hình ảnh về sự hiện diện và dẫn dắt mà không kiểm soát - một vòng tròn thiền định chuyển động nhẹ nhàng trong tĩnh lặng"
    }
    // Thêm metadata cho các chapter tiếp theo ở đây
  },
  
  // Hàm dọn dẹp current instance trước khi tạo mới
  cleanup() {
    if (this.instance && typeof this.instance.cleanup === 'function') {
      this.instance.cleanup();
      this.instance = null;
    }
  },
  
  // Hiển thị hoặc tạo loader element
  setupLoader(container) {
    if (!container) return null;
    
    // Đảm bảo loader hiển thị khi animation đang tải
    let loaderElement = container.querySelector('.animation-loader');
    
    // Nếu không tìm thấy loader, tạo một cái mới
    if (!loaderElement) {
      loaderElement = document.createElement('div');
      loaderElement.className = 'animation-loader';
      loaderElement.innerHTML = '<div><span class="loading-text">Đang tải hiệu ứng visual...</span>' + 
                              '<noscript>JavaScript cần được bật để hiển thị hiệu ứng</noscript></div>';
      container.appendChild(loaderElement);
    } else {
      // Nếu đã tồn tại, đảm bảo nó hiển thị
      loaderElement.style.display = 'flex';
    }
    
    return loaderElement;
  },
  
  // Handle error khi không thể tải animation
  handleError(container, message) {
    console.error(message);
    const loaderElement = container.querySelector('.animation-loader');
    if (loaderElement) {
      loaderElement.innerHTML = `<div>Không thể tải hiệu ứng. ${message}</div>`;
    }
    return null;
  },
  
  // Hàm khởi tạo animation dựa trên chapter ID 
  initAnimation(containerId, chapterId) {
    // Dọn dẹp animation hiện tại nếu có
    this.cleanup();
    
    // Tìm container
    const container = document.getElementById(containerId);
    if (!container) {
      return this.handleError(container, "Không tìm thấy container.");
    }
    
    // Hiển thị loader
    this.setupLoader(container);
    
    // Xác định animation cần khởi tạo dựa trên chapter ID
    try {
      if (!this.metadata[chapterId]) {
        return this.handleError(container, `Không có animation cho chapter ${chapterId}.`);
      }
      
      const animationName = this.metadata[chapterId].name;
      switch(animationName) {
        case "interferenceWaves":
          import('./chapter1-interference.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
        
        case "tessellationPatterns":
          import('./chapter2-tessellation.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "binaryFlow":
          import('./chapter3-binaryflow.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "verticalBars":
          import('./chapter4-verticalbars.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "emptyVessel":
          import('./chapter5-emptyvessel.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "particleFlower":
          import('./chapter6-particleflower.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
         
        case "pinecone":
          import('./chapter7-pinecone.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "waterAscii":
          import('./chapter8-waterascii.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "canyonFlows":
          import('./chapter9-canyonflows.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "wavyYinYang":
          import('./chapter10-yinyang.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        default:
          return this.handleError(container, `Không tìm thấy định nghĩa animation cho "${animationName}"`);
      }
    } catch (error) {
      return this.handleError(container, `Lỗi không xác định: ${error.message}`);
    }
  }
};

// Export để sử dụng từ nơi khác
export default animationManager;
