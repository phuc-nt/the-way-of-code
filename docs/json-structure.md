# Cấu trúc dữ liệu JSON và Hiển thị

Tài liệu này mô tả chi tiết cấu trúc dữ liệu JSON và cách dữ liệu được hiển thị trên giao diện web.

## Cấu trúc JSON

Dự án sử dụng hai loại file JSON chính:

### 1. File intro.json

File `data/intro.json` chứa thông tin giới thiệu và metadata của dự án:

```json
{
  "title": "ĐẠO CỦA CODE",
  "subtitle": "Nghệ Thuật Vĩnh Cửu của Vibe Coding",
  "author": {
    "original": "Lão Tử",
    "adaptation": "Rick Rubin"
  },
  "quote": {
    "text": "Trích dẫn giới thiệu...",
    "author": "Tác giả trích dẫn"
  },
  "introduction": [
    {
      "title": "Giới thiệu về tác phẩm",
      "paragraphs": [
        "Đoạn giới thiệu 1",
        "Đoạn giới thiệu 2"
      ]
    },
    {
      "title": "Về bản dịch và trang web",
      "paragraphs": [
        "Thông tin về bản dịch"
      ]
    }
  ],
  "totalChapters": 81
}
```

### 2. File chapter-X.json

Mỗi file `data/chapter-X.json` chứa nội dung của một chương:

```json
{
  "id": 48,
  "title": "Chương 48",
  "content": {
    "verses": [
      {
        "id": "verse-1",
        "lines": [
          "Dòng 1 đoạn thơ 1",
          "Dòng 2 đoạn thơ 1",
          "..."
        ]
      },
      {
        "id": "verse-2",
        "lines": [
          "Dòng 1 đoạn thơ 2",
          "Dòng 2 đoạn thơ 2",
          "..."
        ]
      }
    ],
    "commentary": [
      {
        "id": "comment-1",
        "content": "Nội dung chú thích 1 với định dạng **Markdown**"
      },
      {
        "id": "comment-2",
        "content": "Nội dung chú thích 2"
      }
    ]
  }
}
```

## Cách dữ liệu được hiển thị

### Trang chủ (index.html)

Trang chủ hiển thị thông tin từ file `intro.json`:

- Tiêu đề (`title`) và tiêu đề phụ (`subtitle`)
- Thông tin tác giả (`author`)
- Trích dẫn (`quote`)
- Nội dung giới thiệu (`introduction`)
- Danh sách các chương (`totalChapters`)

### Trang chi tiết chương (chapter.html)

Trang chi tiết chương hiển thị thông tin từ file `chapter-X.json`:

#### 1. Header

- Tiêu đề chương (`title`)
- Menu điều hướng chương trước/sau

#### 2. Nội dung chính (verses)

Mỗi đoạn thơ (`verses`) được hiển thị như sau:

- Mỗi đoạn thơ được bọc trong thẻ `<p class="verse">`
- Mỗi dòng trong đoạn thơ được phân cách bằng thẻ `<br>`
- Định dạng Markdown trong các dòng thơ được chuyển đổi sang HTML

```html
<div class="verse-container">
  <p class="verse" id="verse-1">
    Dòng 1 đoạn thơ 1<br>
    Dòng 2 đoạn thơ 1
  </p>
  <p class="verse" id="verse-2">
    Dòng 1 đoạn thơ 2<br>
    Dòng 2 đoạn thơ 2
  </p>
</div>
```

#### 3. Chú thích (commentary)

Phần chú thích được hiển thị như sau:

- Tiêu đề "Chú giải"
- Mỗi đoạn chú thích được bọc trong thẻ `<div class="commentary-item">`
- Mỗi dòng được bọc trong thẻ `<p>`
- Định dạng Markdown được chuyển đổi thành HTML:
  - `**text**` → `<strong>text</strong>`
  - `*text*` → `<em>text</em>`
  - `-` → Danh sách có dấu đầu dòng
  - ```code``` → `<code>code</code>`
  - `[text](url)` → `<a href="url">text</a>`

```html
<div class="comment-section">
  <h3>Chú giải</h3>
  <blockquote class="comment-quote fade-in">
    <div id="comment-1" class="commentary-item">
      <p>Nội dung chú thích 1 với định dạng <strong>Markdown</strong></p>
    </div>
    <div id="comment-2" class="commentary-item">
      <p>Nội dung chú thích 2</p>
    </div>
  </blockquote>
</div>
```

## Quá trình render

1. JavaScript trong file `assets/js/main.js` đọc dữ liệu từ JSON thông qua API `fetch()`
2. Hàm `renderChapterContent()` tạo HTML cho phần nội dung chương
3. Hàm `renderCommentaryContent()` tạo HTML cho phần chú thích
4. Hàm `parseMarkdown()` chuyển đổi cú pháp Markdown thành HTML

## CSS và styling

Mọi kiểu dáng đều được định nghĩa trong các file CSS trong thư mục `assets/css/`:

- `.verse`: Styling cho đoạn thơ
- `.comment-section`: Styling cho phần chú thích
- `.commentary-item`: Styling cho từng đoạn chú thích

## Lưu ý quan trọng

- Định dạng Markdown chỉ được hỗ trợ trong phần chú thích (`commentary`), không phải trong phần nội dung chính (`verses`)
- Mỗi đoạn thơ và chú thích đều có ID riêng để dễ dàng styling và tham chiếu
- Hiệu ứng `fade-in` và các hiệu ứng khác được áp dụng qua các lớp CSS
