# Hướng dẫn chuyển đổi Markdown sang JSON

Tài liệu này mô tả chi tiết cách sử dụng script `md-to-json.js` và quy trình chuyển đổi nội dung từ Markdown sang JSON.

## Cách thức hoạt động

Script `md-to-json.js` đọc các file Markdown từ thư mục `content_vi`, phân tích cú pháp Markdown, và tạo ra các file JSON tương ứng trong thư mục `data`.

## Sử dụng script

```bash
# Di chuyển đến thư mục gốc của dự án
cd /path/to/the-way-of-code-3

# Chạy script chuyển đổi
node scripts/md-to-json.js
```

## Cấu trúc Markdown chuẩn

Để đảm bảo script chuyển đổi hoạt động chính xác, file Markdown cần tuân theo cấu trúc sau:

### 1. Header

Bắt đầu với tiêu đề chương:

```markdown
# Chương X
```

### 2. Nội dung chính (verses)

- Mỗi đoạn thơ phân cách bởi một dòng trống
- Mỗi dòng trong đoạn thơ kết thúc với hai khoảng trắng và xuống dòng
- Đừng sử dụng định dạng Markdown trong phần nội dung chính

```markdown
Đây là đoạn thơ đầu tiên,  
mỗi dòng kết thúc bằng hai khoảng trắng.  
Dòng cuối cùng của đoạn.  

Đây là đoạn thơ thứ hai,  
tiếp tục nội dung chương.  
```

### 3. Dấu phân cách

Thêm dấu phân cách giữa nội dung chính và chú thích:

```markdown
---  
```

### 4. Chú thích

Phần chú thích bắt đầu với tiêu đề "Chú thích" và có thể sử dụng định dạng Markdown:

```markdown
## Chú thích  

Đoạn chú thích đầu tiên với **từ ngữ in đậm** và *từ ngữ in nghiêng*.  

- **"Khái niệm 1"**: Liên hệ tới **kỹ thuật lập trình** cụ thể.
- **"Khái niệm 2"**: Giải thích ý nghĩa và áp dụng.

Đoạn chú thích thứ hai bổ sung thêm thông tin và giải thích sâu hơn.
```

## Quy tắc chuyển đổi

Dưới đây là cách script chuyển đổi từ Markdown sang JSON:

1. **Tiêu đề chương** → `title` trong JSON
2. **Số chương** (từ tên file) → `id` trong JSON
3. **Đoạn thơ** → Mảng các đối tượng trong `content.verses`
   - Mỗi đoạn thơ có `id` dạng "verse-N" và mảng các dòng `lines`
4. **Chú thích** → Mảng các đối tượng trong `content.commentary`
   - Mỗi đoạn chú thích có `id` dạng "comment-N" và nội dung `content` với định dạng Markdown

## Hỗ trợ định dạng Markdown

Phần chú thích hỗ trợ các định dạng Markdown sau:

- **In đậm**: `**text**`
- **In nghiêng**: `*text*`
- **Code inline**: `` `code` ``
- **Danh sách gạch đầu dòng**: `- item`
- **Liên kết**: `[text](url)`

## Xử lý lỗi và debugging

Nếu gặp lỗi trong quá trình chuyển đổi:

1. Kiểm tra định dạng file Markdown có đúng không
2. Kiểm tra lỗi trong console khi chạy script
3. Kiểm tra quyền ghi file trong thư mục `data`

## Thêm chương mới

Để thêm chương mới:

1. Tạo file `chuong-X.md` trong thư mục `content_vi`
2. Tuân theo cấu trúc Markdown chuẩn như trên
3. Chạy script để tạo file JSON tương ứng
4. Kiểm tra file JSON đã được tạo trong thư mục `data`

## Lưu ý quan trọng

- Đảm bảo đặt tên file đúng định dạng: `chuong-<số>.md`
- Script sẽ tự động trích xuất số chương từ tên file
- Để máy có thể chạy script, cần cài đặt Node.js
