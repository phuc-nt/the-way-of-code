# Đạo Của Code - The Way of Code

Trang web tĩnh để hiển thị bộ 81 chương của "Đạo của Code" - chuyển thể từ Đạo Đức Kinh sang ngữ cảnh lập trình.

## Tổng quan về dự án

"Đạo Của Code" là một dự án web tĩnh hiển thị 81 chương chuyển thể từ Đạo Đức Kinh sang ngữ cảnh lập trình. Dự án sử dụng HTML, CSS, và JavaScript thuần, không dùng framework. Nội dung được viết dưới dạng Markdown, được chuyển đổi thành JSON và hiển thị trên web.

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
│   └── ...                 # Các chương khác
│
├── content_vi/             # Nội dung gốc ở định dạng Markdown
│   ├── introduce.md        # Giới thiệu 
│   ├── chuong-1.md         # Nội dung chương 1
│   └── ...                 # Các chương khác
│
├── assets/
│   ├── css/                # CSS chính và animations
│   ├── js/                 # JavaScript chính và xử lý render
│   └── images/             # Hình ảnh (nếu có)
│
├── scripts/                # Scripts
│   └── md-to-json.js       # Script chuyển đổi Markdown sang JSON
│
└── docs/                   # Tài liệu chi tiết
    ├── README.md           # Tổng quan tài liệu
    ├── adding-new-chapter.md    # Hướng dẫn thêm chương mới
    ├── json-structure.md        # Cấu trúc JSON chi tiết
    └── markdown-to-json.md      # Chi tiết chuyển đổi Markdown
```

## Quy trình cập nhật nội dung

### 1. Chỉnh sửa hoặc thêm chương mới

Để thêm hoặc chỉnh sửa nội dung:

1. Chỉnh sửa hoặc tạo file Markdown trong thư mục `content_vi/`
2. Tuân theo cấu trúc Markdown chuẩn:

```markdown
# Chương X

Đoạn thơ 1 dòng 1,  
Đoạn thơ 1 dòng 2.  

Đoạn thơ 2 dòng 1,  
Đoạn thơ 2 dòng 2.  

---  

## Chú thích  

Chú thích với **định dạng Markdown**.
```

### 2. Chuyển đổi Markdown sang JSON

Sau khi chỉnh sửa nội dung, chạy script để cập nhật file JSON:

```bash
node scripts/md-to-json.js
```

### 3. Kiểm tra hiển thị

Tạo một server local để kiểm tra thay đổi:

```bash
# Sử dụng Python để tạo server HTTP đơn giản
python -m http.server

# Hoặc nếu sử dụng Node.js
npx serve
```

Truy cập: `http://localhost:8000/chapter.html?id=X` (X là số chương)

## Cấu trúc dữ liệu

### File JSON chương

Mỗi chương được lưu trong một file JSON riêng với cấu trúc:

```json
{
  "id": 1,
  "title": "Chương 1",
  "content": {
    "verses": [
      {
        "id": "verse-1",
        "lines": ["Dòng 1", "Dòng 2"]
      }
    ],
    "commentary": [
      {
        "id": "comment-1",
        "content": "Nội dung chú thích với định dạng **Markdown**"
      }
    ]
  }
}
```

## Triển khai lên web

Để triển khai lên GitHub Pages:

1. Đưa toàn bộ dự án lên GitHub repository
2. Vào Settings > Pages
3. Thiết lập nguồn (Source) là branch "main" (hoặc "master")
4. Đợi một vài phút để website được triển khai

## Mở rộng

### Thêm ngôn ngữ mới
Bạn có thể thêm ngôn ngữ mới bằng cách:
1. Tạo thư mục `content_XX` (ví dụ: `content_en` cho tiếng Anh)
2. Sao chép và chỉnh sửa script chuyển đổi để hỗ trợ ngôn ngữ mới
3. Cập nhật trang web để thêm bộ chọn ngôn ngữ

### Tùy chỉnh giao diện
Bạn có thể dễ dàng tùy chỉnh giao diện bằng cách chỉnh sửa các file CSS trong thư mục `assets/css/`.

## Tài liệu chi tiết

Để biết thêm chi tiết về các quy trình và cấu trúc dữ liệu, vui lòng tham khảo các tài liệu trong thư mục `docs/`:

- [Cách thêm chương mới](docs/adding-new-chapter.md)
- [Cấu trúc dữ liệu JSON](docs/json-structure.md)
- [Chuyển đổi Markdown sang JSON](docs/markdown-to-json.md)

## Thông tin kỹ thuật

Trang web này được xây dựng với:
- HTML5, CSS3, JavaScript thuần (không sử dụng framework)
- Dữ liệu được quản lý dưới dạng JSON
- Animation nhẹ nhàng và chuyển trang mượt mà
- Thiết kế responsive, tương thích với mọi thiết bị
