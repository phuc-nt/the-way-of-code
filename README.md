# Đạo Của Code - The Way of Code

Trang web tĩnh để hiển thị bộ 81 chương của "Đạo của Code" - chuyển thể từ Đạo Đức Kinh sang ngữ cảnh lập trình.

## Cấu trúc dự án

```
the-way-of-code/
│
├── index.html              # Trang chủ
├── chapter.html            # Template cho từng chương
│
├── data/                   # Dữ liệu JSON
│   ├── intro.json          # Thông tin giới thiệu
│   ├── chapter-1.json      # Nội dung chương 1
│   ├── chapter-2.json      # Nội dung chương 2
│   └── ...
│
├── content_vi/             # Nội dung gốc ở định dạng Markdown
│   ├── introduce.md
│   ├── chuong-1.md
│   ├── chuong-2.md
│   └── ...
│
├── assets/
│   ├── css/
│   │   ├── main.css        # CSS chính
│   │   └── animations.css  # CSS cho các animation
│   │
│   ├── js/
│   │   ├── main.js         # JavaScript chính
│   │   └── render.js       # JS để render nội dung từ JSON
│   │
│   └── images/             # Hình ảnh nếu cần
│
├── scripts/                # Scripts để chuyển đổi markdown sang JSON
│   └── md-to-json.js       # Script chuyển đổi
│
└── README.md               # Hướng dẫn này
```

## Hướng dẫn sử dụng

### 1. Cập nhật nội dung

Để cập nhật nội dung, bạn chỉ cần chỉnh sửa các file Markdown trong thư mục `content_vi/`. Sau đó chạy script chuyển đổi để cập nhật file JSON:

```bash
node scripts/md-to-json.js
```

### 2. Triển khai lên GitHub Pages

Để triển khai lên GitHub Pages:

1. Đưa toàn bộ dự án lên GitHub repository
2. Vào Settings > Pages
3. Thiết lập nguồn (Source) là branch "main" (hoặc "master")
4. Đợi một vài phút để website được triển khai

### 3. Mở rộng

#### Thêm ngôn ngữ mới
Bạn có thể thêm ngôn ngữ mới bằng cách:
1. Tạo thư mục `content_XX` (ví dụ: `content_en` cho tiếng Anh)
2. Sao chép và chỉnh sửa script chuyển đổi để hỗ trợ ngôn ngữ mới
3. Cập nhật trang web để thêm bộ chọn ngôn ngữ

#### Cá nhân hóa giao diện
Bạn có thể dễ dàng tùy chỉnh giao diện bằng cách chỉnh sửa các file CSS trong thư mục `assets/css/`.

## Thông tin kỹ thuật

Trang web này được xây dựng với:
- HTML5, CSS3, JavaScript thuần (không sử dụng framework)
- Dữ liệu được quản lý dưới dạng JSON
- Animation nhẹ nhàng và chuyển trang mượt mà
- Thiết kế responsive, tương thích với mọi thiết bị

## Giấy phép

[Chèn thông tin giấy phép ở đây nếu bạn muốn]
