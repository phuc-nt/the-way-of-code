# Quy trình thêm/chỉnh sửa chương mới

Tài liệu này hướng dẫn chi tiết từng bước quy trình thêm chương mới hoặc chỉnh sửa chương hiện có.

## Quy trình tổng quan

1. **Viết nội dung**: Tạo/sửa file Markdown trong thư mục `content_vi/`
2. **Chuyển đổi**: Chạy script để chuyển đổi Markdown sang JSON
3. **Kiểm thử**: Kiểm tra hiển thị trên trang web
4. **Điều chỉnh**: Chỉnh sửa lại nếu cần thiết

## Bước 1: Viết nội dung Markdown

### Tạo file mới

```bash
# Tạo file chương mới (thay X bằng số chương cần tạo)
touch content_vi/chuong-X.md
```

### Cấu trúc chuẩn

```markdown
# Chương X

Đoạn thơ 1 dòng 1,  
Đoạn thơ 1 dòng 2,  
Đoạn thơ 1 dòng 3.  

Đoạn thơ 2 dòng 1,  
Đoạn thơ 2 dòng 2,  
Đoạn thơ 2 dòng 3.  

---  

## Chú thích  

Đoạn chú thích 1 với **định dạng Markdown**.
- **"Khái niệm 1"**: Giải thích và liên hệ với **lập trình**.
- **"Khái niệm 2"**: Giải thích thêm.

Đoạn chú thích 2 với bổ sung thêm ý nghĩa.
```

### Chỉnh sửa file hiện có

Mở file cần chỉnh sửa với trình soạn thảo văn bản và sửa nội dung theo cấu trúc chuẩn ở trên.

## Bước 2: Chuyển đổi Markdown sang JSON

Sau khi đã viết hoặc chỉnh sửa nội dung, chạy script để chuyển đổi sang JSON:

```bash
# Từ thư mục gốc của dự án
node scripts/md-to-json.js
```

Script sẽ tạo/cập nhật file JSON trong thư mục `data/`:

- Từ `content_vi/chuong-X.md` → `data/chapter-X.json`

## Bước 3: Kiểm thử hiển thị

### Khởi động server web tạm thời

```bash
# Sử dụng Python để tạo server HTTP đơn giản
python -m http.server

# Hoặc nếu sử dụng Node.js
npx serve
```

### Kiểm tra trên trình duyệt

- Mở trình duyệt và truy cập: `http://localhost:8000/chapter.html?id=X` (với X là số chương)
- Kiểm tra xem:
  - Nội dung chương hiển thị đúng không
  - Định dạng Markdown có được render đúng không
  - Các đoạn thơ, chú thích có đúng vị trí không

## Bước 4: Điều chỉnh nội dung nếu cần

Nếu phát hiện lỗi hoặc cần điều chỉnh:

1. Quay lại sửa file Markdown trong thư mục `content_vi/`
2. Chạy lại script chuyển đổi
3. Kiểm tra lại trên trình duyệt

## Các trường hợp đặc biệt

### Xóa chương

Để xóa một chương:

```bash
# Xóa file Markdown
rm content_vi/chuong-X.md

# Xóa file JSON
rm data/chapter-X.json

# Hoặc, chỉ cần xóa file Markdown và chạy lại script chỉ khi cần tạo lại tất cả JSON
```

### Đổi thứ tự chương

Để đổi thứ tự các chương:

1. Đổi tên file trong thư mục `content_vi/`
2. Chạy lại script chuyển đổi
3. Các file JSON sẽ được tạo lại với số thứ tự mới

```bash
# Đổi tên từ chương 5 thành chương 6
mv content_vi/chuong-5.md content_vi/chuong-6.md

# Chạy script chuyển đổi
node scripts/md-to-json.js
```

## Danh sách kiểm tra chất lượng

Trước khi hoàn tất, hãy kiểm tra những điểm sau:

1. **Cấu trúc Markdown**:
   - Tiêu đề chương bắt đầu với `# `
   - Các đoạn thơ cách nhau một dòng trống
   - Mỗi dòng thơ kết thúc bằng 2 khoảng trắng và xuống dòng
   - Dấu phân cách `---` trước phần chú thích
   - Tiêu đề chú thích bắt đầu với `## Chú thích`

2. **Nội dung**:
   - Đảm bảo không có lỗi chính tả
   - Các định dạng Markdown được sử dụng đúng cách
   - Đảm bảo chương mới phù hợp với phong cách của các chương khác

3. **Hiển thị**:
   - Kiểm tra trên các kích thước màn hình khác nhau
   - Kiểm tra trên các trình duyệt khác nhau nếu có thể

## Xử lý sự cố thường gặp

### Script chuyển đổi báo lỗi

- Kiểm tra xem Node.js đã được cài đặt chưa
- Đảm bảo bạn đang chạy script từ thư mục gốc của dự án
- Kiểm tra quyền đọc/ghi file

### Nội dung không hiển thị đúng

- Kiểm tra file JSON đã được tạo đúng chưa
- Kiểm tra cấu trúc Markdown có tuân thủ đúng quy định không
- Kiểm tra ID chương trong URL có khớp với số chương không

### Định dạng Markdown không hiển thị đúng

- Kiểm tra cú pháp Markdown có chính xác không
- Đảm bảo bạn đang sử dụng định dạng được hỗ trợ
- Kiểm tra file JSON và xem nội dung Markdown có được chuyển đổi đúng không
