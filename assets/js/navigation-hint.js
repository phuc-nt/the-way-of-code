// Tắt tính năng gợi ý điều hướng theo yêu cầu
// document.addEventListener('DOMContentLoaded', () => {
//     // Kiểm tra xem đang ở trang chapter không
//     if (window.location.pathname.endsWith('chapter.html')) {
//         // Kiểm tra xem đã hiển thị gợi ý chưa
//         const hasShownHint = localStorage.getItem('navigationHintShown');
//         
//         if (!hasShownHint) {
//             setTimeout(showNavigationHint, 2000);
//         }
//     }
// });

function showNavigationHint() {
    // Tạo phần tử hint
    const hintElement = document.createElement('div');
    hintElement.className = 'navigation-hint';
    hintElement.innerHTML = `
        <div class="hint-content">
            <h3>Cách điều hướng</h3>
            <p>Bạn có thể:</p>
            <ul>
                <li><span class="hint-key">←</span> <span class="hint-key">→</span> Dùng phím mũi tên để chuyển chương</li>
                <li><span class="hint-key">PageUp</span> <span class="hint-key">PageDown</span> Chuyển chương trước/sau</li>
                <li>Cuộn đến cuối hoặc đầu trang để chuyển chương</li>
                <li>Dùng chỉ báo ở đầu và cuối trang</li>
            </ul>
            <button id="close-hint" class="hint-close-button">Đã hiểu</button>
        </div>
    `;
    
    // Thêm vào body
    document.body.appendChild(hintElement);
    
    // Hiệu ứng hiển thị
    setTimeout(() => {
        hintElement.classList.add('show');
    }, 100);
    
    // Xử lý nút đóng
    document.getElementById('close-hint').addEventListener('click', () => {
        hintElement.classList.remove('show');
        
        // Đánh dấu đã hiển thị
        localStorage.setItem('navigationHintShown', 'true');
        
        // Xóa phần tử sau animation
        setTimeout(() => {
            document.body.removeChild(hintElement);
        }, 500);
    });
}
