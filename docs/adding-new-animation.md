# Thêm Hiệu Ứng Visual Vào Dự Án

Tài liệu này hướng dẫn cách thêm hiệu ứng visual mới vào dự án. Dự án sử dụng một hệ thống animation module hóa, hỗ trợ cả Three.js và Canvas 2D.

## Mục Lục
- [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
- [Hướng Dẫn Từng Bước](#hướng-dẫn-từng-bước)
- [Ví Dụ: Chuyển Đổi Component React của Chương 1](#ví-dụ-chuyển-đổi-component-react-của-chương-1)
- [Quy Tắc Thực Hành](#quy-tắc-thực-hành)

## Kiến Trúc Hệ Thống

Hệ thống animation được tổ chức theo kiến trúc module như sau:

```
assets/
  ├── js/
  │   ├── animations/
  │   │   ├── animation-utils.js      # Tiện ích và cấu hình dùng chung
  │   │   ├── animation-manager.js    # Quản lý animation module
  │   │   ├── chapter1-interference.js
  │   │   ├── chapter2-tessellation.js
  │   │   ├── chapter3-binaryflow.js
  │   │   ├── chapter4-verticalbars.js
  │   │   ├── chapter5-emptyvessel.js
  │   │   ├── chapter6-particleflower.js
  │   │   ├── chapter7-pinecone.js
  │   │   ├── chapter8-waterascii.js
  │   │   ├── chapter9-canyonflows.js
  │   │   └── chapter10-yinyang.js
  │   └── animations-import.js        # Bridge giữa module và global scope
```

### Các Thành Phần Chính

1. **animation-utils.js**: Chứa cấu hình và các hàm tiện ích dùng chung:
   - Màu sắc và thiết lập theme
   - Kích thước container
   - Trạng thái loading
   - Xử lý lỗi
   - Tiện ích dọn dẹp tài nguyên

2. **animation-manager.js**: Hệ thống quản lý animation module trung tâm:
   - Khởi tạo animation dựa trên chapter ID
   - Sử dụng dynamic import để tải các module animation
   - Xử lý trạng thái loading
   - Quản lý việc dọn dẹp
   - Cung cấp metadata

3. **animations-import.js**: Bridge giữa hệ thống module và global scope:
   - Import animationManager từ module system
   - Expose animationManager ra global scope để các file khác có thể sử dụng

4. **Animation Từng Chương**: Mỗi chapter có một module animation riêng:
   - Tuân thủ interface thống nhất
   - Sử dụng cấu hình dùng chung
   - Tự quản lý việc thiết lập và dọn dẹp

## Hướng Dẫn Từng Bước

1. **Tạo Module Animation**
   ```javascript
   // assets/js/animations/chapter-X-name.js
   import animationUtils from './animation-utils.js';
   
   const chapterXAnimation = {
     // Thiết lập riêng cho animation này
     settings: {
       colors: animationUtils.colors,  // Sử dụng màu dùng chung
       // Các thiết lập khác cho chapter
     },
     
     init(container) {
       // Khởi tạo animation
       if (!container) return null;
       
       // Hiển thị loader trong quá trình thiết lập
       const loader = container.querySelector('.animation-loader');
       
       // Thiết lập animation
       // ...
       
       // Ẩn loader khi animation đã sẵn sàng
       animationUtils.fadeOutLoader(container);
       
       // Trả về object có hàm cleanup
       return {
         cleanup: () => {
           // Dọn dẹp tài nguyên
         }
       };
     }
   };
   
   export default chapterXAnimation;
   ```

2. **Cập Nhật Metadata trong Animation Manager**
   ```javascript
   // Trong animation-manager.js, thêm metadata cho chapter mới
   metadata: {
     // ...existing code...
     X: {  // Số chapter của bạn
       name: "animationName",
       themes: "Theme 1, Theme 2, ...",
       visualization: "Mô tả visualization",
       description: "Mô tả chi tiết về ý nghĩa của animation"
     }
   }
   ```

3. **Thêm Case cho Animation trong Switch**
   ```javascript
   // Trong animation-manager.js, thêm case mới trong switch
   case "animationName":
     import('./chapter-X-name.js')
       .then(module => {
         this.instance = module.default.init(container);
       })
       .catch(error => {
         this.handleError(container, `Lỗi khi tải animation: ${error.message}`);
       });
     break;
   ```

4. **Cập Nhật Main.js**
   ```javascript
   // Trong main.js, thêm điều kiện cho chapter mới
   if (data.id === 1 || data.id === 2 || data.id === X) {  // Thêm số chapter của bạn
     contentHTML += `
       <div class="animation-container" id="animation-container">
         <div class="animation-loader">
           <div>
             <span class="loading-text">Đang tải hiệu ứng visual...</span>
             <noscript>JavaScript cần được bật để hiển thị hiệu ứng</noscript>
           </div>
         </div>
       </div>
     `;
   }
   ```

## Ví Dụ: Chuyển Đổi Component React sang Module JS

Đây là cách chúng ta chuyển đổi component React thành module JavaScript:

1. **Chuyển Đổi Cấu Hình**
   ```javascript
   // Từ React props
   const initialZoom = 6;
   
   // Thành
   settings: {
     initialZoom: 6,
     waveSourceCount: 5,
     resolution: 32,
     colors: animationUtils.colors,
     lineOpacity: 0.4
   }
   ```

2. **Chuyển Đổi Logic Khởi Tạo**
   ```javascript
   // Từ React useEffect
   useEffect(() => {
     if (!containerRef.current) return;
     // ...code khởi tạo
   }, []);
   
   // Thành
   init(container) {
     if (!container) return null;
     // ...code khởi tạo giữ nguyên
   }
   ```

3. **Chuyển Đổi Cleanup**
   ```javascript
   // Từ React cleanup
   return () => {
     // ...code dọn dẹp
   };
   
   // Thành
   return {
     cleanup: () => {
       // ...code dọn dẹp giữ nguyên
     }
   };
   ```

4. **Chuyển Đổi Styles**
   ```javascript
   // Từ React inline styles
   style={{ 
     margin: 0,
     background: '#F0EEE6',
     // ...
   }}
   
   // Thành CSS trong animations.css
   .animation-container {
     margin: 0;
     background: #F0EEE6;
     /* ... */
   }
   ```

5. **Thêm Export Module**
   ```javascript
   // Cuối file
   export default chapterAnimation;
   ```

## Quy Tắc Thực Hành

1. **Quản Lý Cấu Hình**
   - Sử dụng màu sắc từ `animation-utils.js`
   - Giữ các thiết lập riêng trong module animation
   - Mô tả rõ mục đích của từng thiết lập

2. **Quản Lý Tài Nguyên**
   - Luôn implement cleanup đầy đủ
   - Giải phóng tài nguyên Three.js
   - Gỡ bỏ event listeners
   - Dọn dẹp canvas

3. **Hiệu Năng**
   - Sử dụng requestAnimationFrame cho animation
   - Xử lý resize hợp lý
   - Tính đến device pixel ratio
   - Tối ưu vòng lặp render

4. **Xử Lý Lỗi**
   - Kiểm tra dependencies cần thiết
   - Cung cấp fallback khi có thể
   - Sử dụng tiện ích xử lý lỗi dùng chung

5. **Tổ Chức Code**
   - Giữ tính module hóa cho animation
   - Tái sử dụng tiện ích dùng chung
   - Tuân thủ quy ước đặt tên
   - Viết tài liệu cho thuật toán phức tạp

6. **Module System**
   - Sử dụng ES6 modules cho import/export
   - Đảm bảo `import` và `export` đúng cú pháp
   - Khi chỉnh sửa cấu trúc module, cập nhật đồng thời trong `animation-manager.js`
   - Sử dụng dynamic import để tải animation theo demand

Nhớ cập nhật tài liệu này khi thêm tính năng mới hoặc quy tắc thực hành mới.
