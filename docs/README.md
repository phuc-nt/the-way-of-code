# Tài liệu hướng dẫn - Đạo Của Code

Đây là thư mục tài liệu chi tiết cho dự án "Đạo Của Code". Tài liệu này cung cấp hướng dẫn chi tiết về cách duy trì, cập nhật và mở rộng dự án.

> **Lưu ý**: Để biết thông tin tổng quan về dự án, vui lòng xem [README chính](../README.md) ở thư mục gốc.

## Mục lục

- [Hướng dẫn cho người bảo trì](#hướng-dẫn-cho-người-bảo-trì)
- [Tài liệu chi tiết](#tài-liệu-chi-tiết)

## Hướng dẫn cho người bảo trì

Thư mục này chứa các tài liệu hướng dẫn chi tiết để giúp bạn duy trì và mở rộng dự án. Mỗi tài liệu tập trung vào một khía cạnh khác nhau của dự án:

1. [**Cách thêm chương mới**](adding-new-chapter.md) - Hướng dẫn chi tiết từng bước để thêm hoặc chỉnh sửa nội dung chương.

2. [**Cấu trúc dữ liệu JSON**](json-structure.md) - Chi tiết về cấu trúc dữ liệu JSON và cách nó được hiển thị trên giao diện.

3. [**Chuyển đổi Markdown sang JSON**](markdown-to-json.md) - Mô tả chi tiết về cách hoạt động của script chuyển đổi và các quy tắc định dạng Markdown.

## Cập nhật tài liệu

Khi thay đổi cấu trúc dự án hoặc thêm tính năng mới, vui lòng cập nhật tài liệu hướng dẫn này để đảm bảo thông tin luôn chính xác và hữu ích cho người bảo trì trong tương lai.

## Quy trình cơ bản

Quy trình cơ bản để thêm hoặc cập nhật nội dung:

1. **Chỉnh sửa Markdown**: Tạo hoặc chỉnh sửa file Markdown trong `content_vi/`
2. **Chuyển đổi sang JSON**: Chạy `node scripts/md-to-json.js`
3. **Kiểm thử**: Khởi động server local và kiểm tra hiển thị
4. **Triển khai**: Đẩy thay đổi lên GitHub để triển khai lên GitHub Pages

Để biết chi tiết hơn về từng bước, vui lòng tham khảo các tài liệu hướng dẫn cụ thể được liệt kê ở trên.

### 3. Cấu trúc file JSON

File JSON sau khi chuyển đổi sẽ có cấu trúc như sau:

```json
{
  "id": 48,
  "title": "Chương 48",
  "content": {
    "verses": [
      {
        "id": "verse-1",
        "lines": [
          "Đây là dòng 1 của đoạn thơ 1",
          "Đây là dòng 2 của đoạn thơ 1",
          "..."
        ]
      },
      {
        "id": "verse-2",
        "lines": [
          "Đây là dòng 1 của đoạn thơ 2",
          "Đây là dòng 2 của đoạn thơ 2",
          "..."
        ]
      }
    ],
    "commentary": [
      {
        "id": "comment-1",
        "content": "Đoạn chú thích 1 với **Markdown** được hỗ trợ.\n- Điểm quan trọng 1\n- Điểm quan trọng 2"
      },
      {
        "id": "comment-2",
        "content": "Đoạn chú thích 2 với thêm diễn giải."
      }
    ]
  }
}
```

### 4. Quy tắc khi viết nội dung

- **Đoạn thơ**: Mỗi dòng kết thúc bằng hai khoảng trắng và xuống dòng
- **Chú thích**: Có thể sử dụng Markdown để định dạng:
  - `**từ ngữ**`: In đậm
  - `*từ ngữ*`: In nghiêng
  - `-` ở đầu dòng: Danh sách có dấu đầu dòng
  - `[text](url)`: Liên kết
  - ``code``: Hiển thị code

## Tùy chỉnh giao diện

### Thay đổi CSS

- CSS chính của trang web nằm trong thư mục `assets/css/`
- Tùy chỉnh các kiểu cho thẻ `.verse` để điều chỉnh hiển thị đoạn thơ
- Tùy chỉnh các kiểu cho thẻ `.comment-quote` để điều chỉnh hiển thị phần chú thích

### Thay đổi JavaScript

- Logic JavaScript nằm trong file `assets/js/main.js`
- Hàm `renderChapterContent()`: Render nội dung chương
- Hàm `renderCommentaryContent()`: Render nội dung chú thích
- Hàm `parseMarkdown()`: Xử lý định dạng Markdown

## Triển khai lên web

Để triển khai lên GitHub Pages:

1. Đưa toàn bộ dự án lên GitHub repository
2. Vào Settings > Pages
3. Thiết lập nguồn (Source) là branch "main" (hoặc "master")
4. Đợi một vài phút để website được triển khai

Trang web sẽ có địa chỉ dạng: `https://username.github.io/the-way-of-code-3`

## Hỗ trợ và đóng góp

Nếu bạn muốn đóng góp vào dự án hoặc gặp vấn đề, vui lòng tạo issue hoặc pull request trên GitHub repository.
