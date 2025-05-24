// main.js - File JavaScript chính

// Khởi tạo theme manager
const themeManager = {
    // Lấy theme từ localStorage hoặc dùng light mode mặc định
    getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    },

    // Lưu theme vào localStorage
    setTheme(theme) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.updateActiveButton(theme);
    },

    // Cập nhật trạng thái active của các nút
    updateActiveButton(theme) {
        document.querySelectorAll('.theme-button').forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
    },

    // Khởi tạo theme switcher
    init() {
        // Áp dụng theme đã lưu
        const currentTheme = this.getCurrentTheme();
        this.setTheme(currentTheme);

        // Thêm event listeners cho các nút
        document.querySelectorAll('.theme-button').forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.setTheme(theme);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo theme manager
    themeManager.init();
    
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
                <h1 class="chapter-heading">Chương này đang dịch</h1>
                <p style="text-align: center">Hãy quay lại vào lúc khác. <a href="index.html">Quay lại trang chủ</a></p>
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
    let commentVerses = [];
    
    // Render từng verse
    data.verses.forEach(verse => {
        // Kiểm tra xem verse này có phải là tiêu đề chú thích hay không
        if (verse.text[0] && verse.text[0].startsWith('## Chú thích')) {
            hasComment = true;
            return; // Bỏ qua verse này
        }
        
        // Nếu verse tiếp theo là nội dung chú thích
        if (hasComment) {
            // Lưu các verse của phần chú thích để xử lý riêng
            commentVerses.push(verse);
            return; // Bỏ qua verse này
        }
        
        // Verse bình thường
        contentHTML += `<p class="verse">`;
        
        verse.text.forEach((line, index) => {
            // Xử lý định dạng Markdown cho từng dòng
            const parsedLine = parseMarkdown(line);
            contentHTML += parsedLine;
            if (index < verse.text.length - 1) {
                contentHTML += `<br>`;
            }
        });
        
        contentHTML += `</p>`;
    });
    
    contentHTML += `</div>`;
    
    // Thêm phần chú thích dưới dạng blockquote nếu có
    if (hasComment && commentVerses.length > 0) {
        contentHTML += `
            <div class="comment-section">
                <h3>Chú thích</h3>
                <blockquote class="comment-quote fade-in">
                    ${renderCommentContent(commentVerses)}
                </blockquote>
            </div>
        `;
    }
    
    contentElement.innerHTML = contentHTML;
}

// Hàm riêng để xử lý nội dung phần chú thích
function renderCommentContent(commentVerses) {
    let commentHTML = '';
    let inList = false;
    let inOrderedList = false;
    
    commentVerses.forEach(verse => {
        // Duyệt qua từng dòng văn bản trong verse để xử lý đúng format
        for (let i = 0; i < verse.text.length; i++) {
            const line = verse.text[i];
            
            // Xử lý danh sách có đánh số
            if (line.match(/^\d+\.\s/)) {
                if (!inOrderedList) {
                    // Bắt đầu danh sách có đánh số mới
                    if (commentHTML.endsWith('</p>')) {
                        commentHTML = commentHTML.slice(0, -4);
                    }
                    commentHTML += '<ol>';
                    inOrderedList = true;
                    inList = true;
                }
                // Thêm mục danh sách có đánh số
                const content = line.replace(/^\d+\.\s+/, '');
                commentHTML += `<li>${parseMarkdown(content)}</li>`;
            } 
            // Xử lý danh sách gạch đầu dòng
            else if (line.match(/^-\s/) || line.match(/^\*\s/)) {
                if (!inList || inOrderedList) {
                    // Kết thúc danh sách có đánh số nếu đang trong đó
                    if (inOrderedList) {
                        commentHTML += '</ol>';
                        inOrderedList = false;
                    }
                    
                    // Bắt đầu danh sách gạch đầu dòng mới
                    if (commentHTML.endsWith('</p>')) {
                        commentHTML = commentHTML.slice(0, -4);
                    }
                    if (!inList) {
                        commentHTML += '<ul>';
                        inList = true;
                    }
                }
                // Thêm mục danh sách gạch đầu dòng
                const content = line.replace(/^-\s+/, '').replace(/^\*\s+/, '');
                commentHTML += `<li>${parseMarkdown(content)}</li>`;
            } 
            else {
                // Đóng danh sách nếu đang mở
                if (inList) {
                    commentHTML += inOrderedList ? '</ol>' : '</ul>';
                    inList = false;
                    inOrderedList = false;
                }
                
                // Xử lý đoạn văn thông thường
                if (line.trim() !== '') {
                    commentHTML += `<p>${parseMarkdown(line)}</p>`;
                }
            }
        }
    });
    });
    
    // Đảm bảo kết thúc tất cả các thẻ mở
    if (inList) {
        commentHTML += '</ol>';
    }
    
    return commentHTML;
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
    
    // Thêm dropdown cho phép chọn bất kỳ chương nào
    navHTML += `
        <div class="chapter-dropdown">
            <button class="dropdown-button" onclick="toggleChapterDropdown('header-dropdown')">
                <span class="chapter-title">Chương ${chapterId}</span>
                <span class="dropdown-icon" id="header-dropdown-icon"></span>
            </button>
            <div id="header-dropdown" class="dropdown-content">
                ${generateChapterLinks(totalChapters, chapterId)}
            </div>
        </div>
    `;
    
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
    
    // Thêm dropdown cho phép chọn bất kỳ chương nào
    navHTML += `
        <div class="chapter-dropdown">
            <button class="dropdown-button" onclick="toggleChapterDropdown('footer-dropdown')">
                <span class="chapter-title">Chương ${chapterId}</span>
                <span class="dropdown-icon" id="footer-dropdown-icon"></span>
            </button>
            <div id="footer-dropdown" class="dropdown-content">
                ${generateChapterLinks(totalChapters, chapterId)}
            </div>
        </div>
    `;
    
    // Link chương sau
    if (chapterId < totalChapters) {
        navHTML += `<a href="chapter.html?id=${chapterId + 1}" class="next-chapter">Chương tiếp</a>`;
    } else {
        navHTML += `<span class="next-chapter" style="visibility: hidden">Chương tiếp</span>`;
    }
    
    navHTML += '</div>';
    navElement.innerHTML = navHTML;
}

// Hàm để xử lý định dạng Markdown cơ bản
function parseMarkdown(text) {
    if (!text) return '';
    
    // Xử lý in đậm: **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Xử lý in nghiêng: *text* -> <em>text</em> (nếu không phải là phần của **text**)
    text = text.replace(/\*([^\*]*?)\*/g, '<em>$1</em>');
    
    // Xử lý code inline: `text` -> <code>text</code>
    text = text.replace(/\`(.*?)\`/g, '<code>$1</code>');
    
    // Xử lý liên kết: [text](url) -> <a href="url">text</a>
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    return text;
}

// Hàm tạo danh sách các liên kết chương cho dropdown
function generateChapterLinks(totalChapters, currentChapterId) {
    let links = '';
    for (let i = 1; i <= totalChapters; i++) {
        const isCurrentChapter = i === currentChapterId;
        links += `
            <a href="chapter.html?id=${i}" ${isCurrentChapter ? 'style="font-weight: bold; background-color: rgba(52, 152, 219, 0.1);"' : ''}>
                Chương ${i}
            </a>
        `;
    }
    return links;
}

// Hàm để hiển thị/ẩn dropdown
function toggleChapterDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const iconId = dropdownId === 'header-dropdown' ? 'header-dropdown-icon' : 'footer-dropdown-icon';
    const icon = document.getElementById(iconId);
    
    // Đóng tất cả các dropdown khác trước khi mở dropdown mới
    const allDropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i].id !== dropdownId && allDropdowns[i].classList.contains('show')) {
            allDropdowns[i].classList.remove('show');
            
            // Reset icon của dropdown khác
            const otherId = allDropdowns[i].id === 'header-dropdown' ? 'header-dropdown-icon' : 'footer-dropdown-icon';
            document.getElementById(otherId).classList.remove('rotate-icon');
        }
    }
    
    // Bật/tắt dropdown hiện tại
    dropdown.classList.toggle('show');
    icon.classList.toggle('rotate-icon');
}

// Đóng dropdown khi người dùng click bất kỳ đâu trên trang
document.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-button') && 
        !event.target.parentElement.matches('.dropdown-button') && 
        !event.target.matches('.dropdown-icon')) {
        
        const dropdowns = document.getElementsByClassName('dropdown-content');
        const icons = document.getElementsByClassName('dropdown-icon');
        
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
        
        for (let i = 0; i < icons.length; i++) {
            if (icons[i].classList.contains('rotate-icon')) {
                icons[i].classList.remove('rotate-icon');
            }
        }
    }
});
