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
            
            // Đếm tổng số file chapter*.json trong thư mục data
            countChapterFiles().then(totalChapters => {
                // Render danh sách chương
                renderChapterList(totalChapters);
            });
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
        <h1 class="main-title fade-in">${data.banner.title}</h1>
        <p class="subtitle fade-in-delayed">${data.banner.subtitle}</p>
        <p class="author fade-in-delayed">${data.banner.attribution}</p>
        <img src="assets/image/illustrator.png" alt="Minh họa Đạo Của Code" class="hero-illustration fade-in-delayed">
    `;
}

// Render phần giới thiệu
function renderIntroduction(data) {
    const introElement = document.getElementById('introduction');
    if (!introElement) return;
    
    let introHTML = '';
    
    // Render quote
    if (data.content.quote) {
        introHTML += `
            <blockquote class="quote fade-in">
                <p>${data.content.quote.text}</p>
                <footer>— <em>${data.content.quote.author}</em></footer>
            </blockquote>
        `;
    }
    
    // Render các phần giới thiệu
    data.content.sections.forEach(section => {
        introHTML += `<div class="intro-text fade-in-up">`;
        
        if (section.title) {
            introHTML += `<h2>${section.title}</h2>`;
        }
        
        // Chuyển đổi xuống dòng thành phần tử <p>
        const paragraphs = section.content.split('\n\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                introHTML += `<p>${paragraph}</p>`;
            }
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
    
    // Thêm liên kết đến trang outro
    listHTML += `<li><a href="outro.html" class="chapter-link special-link">Lời kết</a></li>`;
    
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
            
            // Đếm tổng số chương từ các file
            return countChapterFiles()
                .then(totalChapters => {
                    // Render navigation ở header và footer
                    const parsedChapterId = parseInt(chapterId);
                    
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
    
    // Kiểm tra cấu trúc dữ liệu
    if (!data.content) {
        console.error('Invalid chapter data structure:', data);
        contentElement.innerHTML = `<p class="error">Lỗi cấu trúc dữ liệu chương.</p>`;
        return;
    }
    
    // Render các đoạn thơ (verses)
    contentHTML += `<div class="verse-container">`;
    
    if (data.content.verses && data.content.verses.length > 0) {
        data.content.verses.forEach(verse => {
            contentHTML += `<p class="verse" id="${verse.id}">`;
            
            verse.lines.forEach((line, index) => {
                // Xử lý định dạng Markdown cho từng dòng
                const parsedLine = parseMarkdown(line);
                contentHTML += parsedLine;
                if (index < verse.lines.length - 1) {
                    contentHTML += `<br>`;
                }
            });
            
            contentHTML += `</p>`;
        });
    }
    
    contentHTML += `</div>`;
    
    // Thêm phần chú giải (commentary) nếu có
    if (data.content.commentary && data.content.commentary.length > 0) {
        contentHTML += `
            <div class="comment-section">
                <h3>Chú giải</h3>
                <div class="commentary-container fade-in">
                    ${renderCommentaryContent(data.content.commentary)}
                </div>
            </div>
        `;
    }
    
    contentElement.innerHTML = contentHTML;
}

// Hàm riêng để xử lý nội dung phần chú giải (commentary)
function renderCommentaryContent(commentaryItems) {
    let commentaryHTML = '';
    
    commentaryItems.forEach(item => {
        // Kiểm tra nếu nội dung comment có tồn tại
        if (!item.content) return;
        
        // Xử lý từng dòng riêng biệt để giữ định dạng xuống dòng
        const contentLines = item.content.split('\n');
        let processedContent = '';
        
        // Xử lý từng dòng riêng biệt
        contentLines.forEach(line => {
            if (line.trim()) {
                // Xử lý Markdown cho từng dòng
                processedContent += `<p>${parseMarkdown(line)}</p>`;
            } else {
                // Thêm khoảng trống cho dòng trống
                processedContent += `<br>`;
            }
        });
        
        // Đưa vào một thẻ div với id để dễ styling
        commentaryHTML += `<div id="${item.id}" class="commentary-item">${processedContent}</div>`;
    });
    
    return commentaryHTML;
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
    } else if (chapterId == totalChapters) {
        // Nếu là chương cuối, hiển thị link đến outro
        navHTML += `<a href="outro.html" class="next-chapter">Lời kết</a>`;
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
    } else if (chapterId == totalChapters) {
        // Nếu là chương cuối, hiển thị link đến outro
        navHTML += `<a href="outro.html" class="next-chapter">Lời kết</a>`;
    } else {
        navHTML += `<span class="next-chapter" style="visibility: hidden">Chương tiếp</span>`;
    }
    
    navHTML += '</div>';
    navElement.innerHTML = navHTML;
}

// Trả về số chương cố định
async function countChapterFiles() {
    return 81; // Website có 81 chương cố định
}

// Hàm để xử lý định dạng Markdown cơ bản
function parseMarkdown(text) {
    if (!text) return '';
    
    // Escape các ký tự HTML đặc biệt trước tiên (trừ những ký tự cần thiết cho markdown)
    text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Xử lý in đậm: **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Xử lý in nghiêng: *text* -> <em>text</em> (nếu không phải là phần của **text**)
    text = text.replace(/\*([^\*]*?)\*/g, '<em>$1</em>');
    
    // Xử lý code inline: `text` -> <code>text</code>
    text = text.replace(/\`(.*?)\`/g, '<code>$1</code>');
    
    // Xử lý liên kết: [text](url) -> <a href="url">text</a>
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Xử lý đường gạch ngang cho các dòng thụt vào (definition lists)
    text = text.replace(/^(\s*)-\s+(.*)$/gm, '$1• $2');
    
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
