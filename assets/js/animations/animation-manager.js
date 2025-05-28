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
    },
    11: {
      name: "voidArchitecture",
      themes: "Emptiness creates utility, space enables function, usefulness through void",
      visualization: "Three structures defined by their empty spaces - a wheel's hub, a vessel's cavity, a room's openings",
      description: "Hình ảnh về triết lý không gian âm - giá trị nằm trong khoảng trống của bánh xe, bình gốm và căn phòng"
    },
    12: {
      name: "metamorphosis",
      themes: "Inner over outer, simplicity over sensation, open heart over thought",
      visualization: "A form that transforms from complex to simple, revealing inner essence beneath surface appearance",
      description: "Hình ảnh về quá trình đơn giản hóa và chuyển đổi từ bên ngoài phức tạp đến bản chất đơn giản bên trong, thể hiện tinh thần lọc nhiễu và tập trung vào logic cốt lõi"
    },
    13: {
      name: "doubleHelixEquilibrium",
      themes: "Success equals failure, hope equals fear, finding balance in self",
      visualization: "A double helix where opposing forces dance in perfect equilibrium",
      description: "Hình ảnh chuỗi xoắn kép (double helix) với các điểm cân bằng giữa các lực đối lập, thể hiện triết lý thành-bại, hy vọng-sợ hãi, và sự cân bằng nội tại."
    },
    14: {
      name: "formlessWaves",
      themes: "The formless and intangible, merging into oneness, return to nothingness",
      visualization: "Waves of varying opacity merge and dissolve, revealing the formless nature beneath form",
      description: "Hình ảnh các lớp sóng mờ ảo hòa quyện, tan biến, thể hiện triết lý vô hình, hợp nhất và trở về với hư vô."
    },
    15: {
      name: "watchfulWaves",
      themes: "Profound watchfulness, remaining still, presence in the moment",
      visualization: "Waves ripple outward from still points, creating patterns of watchful awareness",
      description: "Hình ảnh các gợn sóng lan tỏa từ những điểm tĩnh lặng, tạo thành họa tiết của sự tỉnh thức và quan sát sâu sắc."
    },
    16: {
      name: "morphingContours",
      themes: "Emptying of everything, return to source, peace through stillness",
      visualization: "Organic forms continuously empty and return to their source in peaceful cycles",
      description: "Hình ảnh các đường viền hữu cơ liên tục rỗng hóa và trở về nguồn, thể hiện sự bình an qua tĩnh lặng."
    },
    17: {
      name: "kaleidoscopeLeadership",
      themes: "Silent leadership, trust in the team, working unseen",
      visualization: "Each segment silently guides the others, creating harmony through invisible influence",
      description: "Hình ảnh kính vạn hoa - mỗi mảnh ghép âm thầm dẫn dắt, tạo nên sự hài hòa qua ảnh hưởng vô hình."
    },
    18: {
      name: "hashArchitecture",
      themes: "Abandonment of the way, rise of rigid rules, loss of intuition",
      visualization: "Geometric structures that reveal how natural flow becomes constrained by rigid patterns",
      description: "Hình ảnh các cấu trúc hình học cho thấy dòng chảy tự nhiên bị ràng buộc bởi các quy tắc cứng nhắc, thể hiện sự mất mát trực giác."
    },
    19: {
      name: "vortexParticles",
      themes: "Simplicity over learning, return to intuition, being the center",
      visualization: "Particles naturally drawn to a center point, finding harmony in simplicity",
      description: "Các hạt chuyển động xoắn ốc về trung tâm, thể hiện sự trở về trực giác và sự hài hòa trong đơn giản."
    },
    20: {
      name: "flowingPaths",
      themes: "Harmony of opposites, dynamic flow, subtle influence",
      visualization: "Nodes and flowing paths, showing the interplay of heaven, earth, and the vibe coder",
      description: "Các node và đường flow thể hiện sự tương tác giữa trời, đất và coder, nhấn mạnh sự hài hòa và ảnh hưởng tinh tế."
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
          
        case "voidArchitecture":
          import('./chapter11-voidarchitecture.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "metamorphosis":
          import('./chapter12-metamorphosis.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "doubleHelixEquilibrium":
          import('./chapter13-doublehelix.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "formlessWaves":
          import('./chapter14-formlesswaves.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "watchfulWaves":
          import('./chapter15-watchfulwaves.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "morphingContours":
          import('./chapter16-morphingcontours.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "kaleidoscopeLeadership":
          import('./chapter17-kaleidoscope.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "hashArchitecture":
          import('./chapter18-hasharchitecture.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "vortexParticles":
          import('./chapter19-vortexparticles.js')
            .then(module => {
              this.instance = module.default.init(container);
            })
            .catch(error => {
              this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
            });
          break;
          
        case "flowingPaths":
          import('./chapter20-flowingpaths.js')
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
