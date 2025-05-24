// Script Node.js để chuyển đổi file Markdown thành JSON
// Sử dụng: node md-to-json.js

const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '../content_vi');
const dataPath = path.join(__dirname, '../data');

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
    console.log('Created data directory');
}

// Xử lý file giới thiệu
function processIntroFile() {
    const introPath = path.join(contentPath, 'introduce.md');
    
    if (!fs.existsSync(introPath)) {
        console.error(`Intro file not found: ${introPath}`);
        return;
    }
    
    const content = fs.readFileSync(introPath, 'utf8');
    const lines = content.split('\n');
    
    // Cấu trúc dữ liệu intro
    const introData = {
        title: '',
        subtitle: '',
        author: {
            original: '',
            adaptation: ''
        },
        quote: {
            text: '',
            author: ''
        },
        introduction: [],
        totalChapters: 81 // Mặc định là 81 chương
    };
    
    let currentSection = null;
    let inQuote = false;
    let quoteText = [];
    
    // Parse từng dòng
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Bỏ qua comment
        if (line.startsWith('<!--') && line.includes('-->')) {
            continue;
        }
        
        // Tiêu đề chính
        if (line.startsWith('# ')) {
            introData.title = line.substring(2).trim();
            continue;
        }
        
        // Tiêu đề phụ (trong dấu *)
        if (line.startsWith('*') && line.endsWith('*') && !line.includes('Dựa') && !line.includes('Chuyển')) {
            introData.subtitle = line.substring(1, line.length - 1).trim();
            continue;
        }
        
        // Thông tin tác giả
        if (line.includes('Dựa trên')) {
            introData.author.original = line.replace('*Dựa trên', '').replace('*', '').trim();
            continue;
        }
        
        if (line.includes('Chuyển thể bởi')) {
            introData.author.adaptation = line.replace('*Chuyển thể bởi', '').replace('*', '').trim();
            continue;
        }
        
        // Trích dẫn
        if (line.startsWith('> ') && !line.includes('—')) {
            inQuote = true;
            quoteText.push(line.substring(2).trim());
            continue;
        } else if (inQuote && line.includes('—')) {
            // Author của quote
            inQuote = false;
            const authorMatch = line.match(/—\s*\*(.+?)\*/);
            if (authorMatch) {
                introData.quote.author = authorMatch[1].trim();
                introData.quote.text = quoteText.join(' ').replace(/\s+/g, ' ');
            }
            quoteText = [];
            continue;
        } else if (inQuote) {
            if (line.startsWith('> ')) {
                quoteText.push(line.substring(2).trim());
            } else if (line === '>') {
                quoteText.push(''); // Empty line in quote
            } else {
                inQuote = false; // End of quote
            }
            continue;
        }
        
        // Tiêu đề phần giới thiệu
        if (line.startsWith('## ')) {
            const title = line.substring(3).trim();
            currentSection = {
                title: title,
                paragraphs: []
            };
            introData.introduction.push(currentSection);
            continue;
        }
        
        // Nội dung của phần giới thiệu
        if (currentSection && line && !line.startsWith('#')) {
            // Thay thế các ký tự markdown bằng ký tự tương ứng
            let processedLine = line;
            
            // Xử lý các đoạn được bôi đậm bọc trong **...**
            processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '"$1"');
            
            // Xử lý các đoạn nghiêng bọc trong *...*
            processedLine = processedLine.replace(/\*([^*]+)\*/g, '$1');
            
            currentSection.paragraphs.push(processedLine);
        }
    }
    
    // Ghi file JSON
    fs.writeFileSync(
        path.join(dataPath, 'intro.json'),
        JSON.stringify(introData, null, 2),
        'utf8'
    );
    
    console.log('Successfully processed intro file');
}

// Xử lý file chương
function processChapterFile(filename) {
    const chapterPath = path.join(contentPath, filename);
    const match = filename.match(/chuong-(\d+)\.md/);
    
    if (!match) {
        console.warn(`Skipping file with invalid format: ${filename}`);
        return;
    }
    
    const chapterId = parseInt(match[1]);
    const content = fs.readFileSync(chapterPath, 'utf8');
    const lines = content.split('\n');
    
    // Cấu trúc dữ liệu chương
    const chapterData = {
        id: chapterId,
        title: '',
        verses: []
    };
    
    let currentVerse = {
        text: []
    };
    
    // Bỏ qua dòng đầu tiên nếu nó là comment
    let startIndex = 0;
    if (lines[0] && lines[0].trim().startsWith('<!--')) {
        startIndex = 1;
    }
    
    // Parse tiêu đề
    if (lines[startIndex] && lines[startIndex].trim().startsWith('# ')) {
        chapterData.title = lines[startIndex].trim().substring(2);
        startIndex++;
    }
    
    // Parse nội dung
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Bỏ qua dòng phân cách "---"
        if (line === '---') {
            continue;
        }
        
        // Nếu gặp dòng trống và đang có nội dung trong verse hiện tại
        if (!line && currentVerse.text.length > 0) {
            // Lưu verse hiện tại và tạo verse mới
            chapterData.verses.push({...currentVerse});
            currentVerse = {
                text: []
            };
            continue;
        }
        
        // Thêm dòng vào verse hiện tại nếu không phải dòng trống
        if (line) {
            currentVerse.text.push(line);
        }
    }
    
    // Thêm verse cuối cùng nếu còn
    if (currentVerse.text.length > 0) {
        chapterData.verses.push({...currentVerse});
    }
    
    // Ghi file JSON
    fs.writeFileSync(
        path.join(dataPath, `chapter-${chapterId}.json`),
        JSON.stringify(chapterData, null, 2),
        'utf8'
    );
    
    console.log(`Successfully processed chapter ${chapterId}`);
}

// Xử lý tất cả file
function processAllFiles() {
    try {
        // Xử lý file giới thiệu
        processIntroFile();
        
        // Lấy danh sách các file chương và sắp xếp theo số
        const files = fs.readdirSync(contentPath)
            .filter(file => file.match(/^chuong-\d+\.md$/))
            .sort((a, b) => {
                const numA = parseInt(a.match(/chuong-(\d+)\.md/)[1]);
                const numB = parseInt(b.match(/chuong-(\d+)\.md/)[1]);
                return numA - numB;
            });
        
        // Xử lý từng file chương
        for (const file of files) {
            processChapterFile(file);
        }
        
        console.log('All files processed successfully!');
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

// Chạy xử lý
processAllFiles();
