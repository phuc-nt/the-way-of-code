// main.js - File JavaScript chính

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo ứng dụng
    initApp();
});

// Khởi tạo ứng dụng
function initApp() {
    // Xác định trang hiện tại
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith('chapter.html')) {
        // Nếu đang ở trang chapter.html
        loadChapter();
    } else {
        // Mặc định là trang chủ hoặc bất kỳ trang nào khác
        loadHomePage();
    }
}

// Tải trang chủ
function loadHomePage() {
    // Tải dữ liệu giới thiệu từ JSON
    fetch('data/intro.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Render header
            renderHomeHeader(data);
            
            // Render phần giới thiệu
            renderIntroduction(data);
            
            // Render danh sách chương
            renderChapterList(data.totalChapters);
        })
        .catch(error => {
            console.error('Error loading home page data:', error);
            document.getElementById('home-header').innerHTML = '<h1 class="main-title">Đạo Của Code</h1>';
            document.getElementById('introduction').innerHTML = '<p>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>';
        });
}

// Render header cho trang chủ
function renderHomeHeader(data) {
    const headerElement = document.getElementById('home-header');
    if (!headerElement) return;
    
    headerElement.innerHTML = `
        <h1 class="main-title fade-in">${data.title}</h1>
        <p class="subtitle fade-in-delayed">${data.subtitle}</p>
        <p class="author fade-in-delayed">Dựa trên ${data.author.original} - Chuyển thể bởi ${data.author.adaptation}</p>
    `;
}

// Render phần giới thiệu
function renderIntroduction(data) {
    const introElement = document.getElementById('introduction');
    if (!introElement) return;
    
    let introHTML = '';
    
    // Render quote
    if (data.quote) {
        introHTML += `
            <blockquote class="quote fade-in">
                <p>${data.quote.text}</p>
                <footer>— <em>${data.quote.author}</em></footer>
            </blockquote>
        `;
    }
    
    // Render các phần giới thiệu
    data.introduction.forEach(section => {
        introHTML += `<div class="intro-text fade-in-up">`;
        
        if (section.title) {
            introHTML += `<h2>${section.title}</h2>`;
        }
        
        section.paragraphs.forEach(paragraph => {
            introHTML += `<p>${paragraph}</p>`;
        });
        
        introHTML += `</div>`;
    });
    
    introElement.innerHTML = introHTML;
}

// Render danh sách chương
function renderChapterList(totalChapters) {
    const listElement = document.getElementById('chapter-list');
    if (!listElement) return;
    
    let listHTML = '';
    
    for (let i = 1; i <= totalChapters; i++) {
        listHTML += `<li><a href="chapter.html?id=${i}" class="chapter-link">Chương ${i}</a></li>`;
    }
    
    listElement.innerHTML = listHTML;
}

// Tải nội dung chương từ JSON
function loadChapter() {
    // Lấy ID chương từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get('id');
    
    if (!chapterId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Tải dữ liệu chương từ JSON
    fetch(`data/chapter-${chapterId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Render nội dung chương
            renderChapterContent(data);
            
            // Tải dữ liệu tổng số chương từ intro.json
            return fetch('data/intro.json')
                .then(response => response.json())
                .then(introData => {
                    // Render navigation ở header và footer
                    const parsedChapterId = parseInt(chapterId);
                    const totalChapters = introData.totalChapters;
                    
                    // Render navigation cho header
                    renderChapterHeaderNav(parsedChapterId, totalChapters);
                    
                    // Render navigation ở footer
                    renderFooterNavigation(parsedChapterId, totalChapters);
                    
                    // Cập nhật tiêu đề trang
                    document.title = `Đạo Của Code - ${data.title}`;
                });
        })
        .catch(error => {
            console.error('Error loading chapter data:', error);
            document.getElementById('chapter-content').innerHTML = `
                <h1 class="chapter-heading">Chương không tồn tại</h1>
                <p style="text-align: center">Không tìm thấy chương bạn yêu cầu. <a href="index.html">Quay lại trang chủ</a></p>
            `;
        });
}

// Render nội dung chương
function renderChapterContent(data) {
    const contentElement = document.getElementById('chapter-content');
    if (!contentElement) return;
    
    let contentHTML = `<h1 class="chapter-heading fade-in">${data.title}</h1>`;
    
    contentHTML += `<div class="verse-container">`;
    
    let hasComment = false;
    let commentContent = '';
    
    // Render từng verse
    data.verses.forEach(verse => {
        // Kiểm tra xem verse này có phải là tiêu đề chú thích hay không
        if (verse.text[0] && verse.text[0].startsWith('## Chú thích')) {
            hasComment = true;
            return; // Bỏ qua verse này
        }
        
        // Nếu verse tiếp theo là nội dung chú thích
        if (hasComment) {
            // Lưu nội dung chú thích
            verse.text.forEach(line => {
                commentContent += line + ' ';
            });
            return; // Bỏ qua verse này
        }
        
        // Verse bình thường
        contentHTML += `<p class="verse">`;
        
        verse.text.forEach((line, index) => {
            contentHTML += line;
            if (index < verse.text.length - 1) {
                contentHTML += `<br>`;
            }
        });
        
        contentHTML += `</p>`;
    });
    
    contentHTML += `</div>`;
    
    // Thêm phần chú thích dưới dạng blockquote nếu có
    if (hasComment && commentContent) {
        contentHTML += `
            <div class="comment-section">
                <h3>Chú thích</h3>
                <blockquote class="comment-quote fade-in">
                    <p>${commentContent}</p>
                </blockquote>
            </div>
        `;
    }
    
    contentElement.innerHTML = contentHTML;
}

// Render navigation cho header chương
function renderChapterHeaderNav(chapterId, totalChapters) {
    const navElement = document.getElementById('chapter-navigation');
    if (!navElement) return;
    
    let navHTML = '';
    
    // Link chương trước
    if (chapterId > 1) {
        navHTML += `<a href="chapter.html?id=${chapterId - 1}" class="prev-chapter">Chương trước</a>`;
    } else {
        navHTML += `<span class="prev-chapter" style="visibility: hidden">Chương trước</span>`;
    }
    
    // Tiêu đề chương hiện tại
    navHTML += `<span class="chapter-title">Chương ${chapterId}</span>`;
    
    // Link chương sau
    if (chapterId < totalChapters) {
        navHTML += `<a href="chapter.html?id=${chapterId + 1}" class="next-chapter">Chương tiếp</a>`;
    } else {
        navHTML += `<span class="next-chapter" style="visibility: hidden">Chương tiếp</span>`;
    }
    
    navElement.innerHTML = navHTML;
}

// Render navigation ở footer cho chương
function renderFooterNavigation(chapterId, totalChapters) {
    const navElement = document.getElementById('footer-navigation');
    if (!navElement) return;
    
    let navHTML = '<div class="chapter-nav">';
    
    // Link chương trước
    if (chapterId > 1) {
        navHTML += `<a href="chapter.html?id=${chapterId - 1}" class="prev-chapter">Chương trước</a>`;
    } else {
        navHTML += `<span class="prev-chapter" style="visibility: hidden">Chương trước</span>`;
    }
    
    // Tiêu đề chương hiện tại
    navHTML += `<span class="chapter-title">Chương ${chapterId}</span>`;
    
    // Link chương sau
    if (chapterId < totalChapters) {
        navHTML += `<a href="chapter.html?id=${chapterId + 1}" class="next-chapter">Chương tiếp</a>`;
    } else {
        navHTML += `<span class="next-chapter" style="visibility: hidden">Chương tiếp</span>`;
    }
    
    navHTML += '</div>';
    navElement.innerHTML = navHTML;
}
