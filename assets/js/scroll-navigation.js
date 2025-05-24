// Tính năng scroll vô hạn để chuyển chương
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem đang ở trang chapter không
    if (window.location.pathname.endsWith('chapter.html')) {
        initInfiniteScroll();
        // Thêm class cho animation khi trang mới load
        document.querySelector('.container').classList.add('fade-in-content');
        
        // Thêm các phần tử glow edge
        addGlowElements();
    }
});

// Thêm các phần tử edge glow
function addGlowElements() {
    const glowTop = document.createElement('div');
    glowTop.className = 'edge-glow-top';
    
    const glowBottom = document.createElement('div');
    glowBottom.className = 'edge-glow-bottom';
    
    document.body.appendChild(glowTop);
    document.body.appendChild(glowBottom);
}

// Khởi tạo tính năng scroll vô hạn
function initInfiniteScroll() {
    let isScrolling = false;
    let scrollTimeout;
    let lastScrollPos = window.scrollY;
    const scrollThreshold = 400; // Tăng ngưỡng scroll để giảm độ nhạy
    let scrollCooldown = false; // Thêm thời gian hồi để tránh chuyển chương liên tục
    let scrollDelayActive = false; // Biến để kiểm soát độ trễ khi kích hoạt scroll
    let topScrolled = false; // Đánh dấu người dùng đã scroll đến đầu trang một lần
    let bottomScrolled = false; // Đánh dấu người dùng đã scroll đến cuối trang một lần
    let recentlyLoaded = true; // Đánh dấu trang mới được tải
    let pageLoadTimestamp = new Date().getTime(); // Thời điểm trang được tải
    
    // Lấy thông tin chương hiện tại và tổng số chương
    const urlParams = new URLSearchParams(window.location.search);
    let currentChapterId = parseInt(urlParams.get('id') || '1');
    let totalChapters = 81; // Giá trị mặc định
    
    // Lấy tổng số chương thực tế từ intro.json
    fetch('data/intro.json')
        .then(response => response.json())
        .then(data => {
            totalChapters = data.totalChapters;
        })
        .catch(error => {
            console.error('Error loading intro data:', error);
        });
    
    // Thêm hỗ trợ điều hướng bằng bàn phím
    addKeyboardNavigation();
    
    // Xử lý sự kiện scroll
    window.addEventListener('scroll', () => {
        if (isScrolling || scrollCooldown) return;
        
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            handleScrollNavigation();
        }, 150); // Tăng thời gian chờ để giảm độ nhạy
    });
    
    // Thêm sự kiện wheel để cải thiện tương thích với Chrome và Safari
    window.addEventListener('wheel', (event) => {
        if (isScrolling || scrollCooldown) return;
        
        // Ghi nhớ hướng cuộn (dương là cuộn xuống, âm là cuộn lên)
        // Tương thích với cả Chrome, Firefox và Safari
        const scrollDirection = event.deltaY || event.detail * -40 || event.wheelDelta * -1;
        
        // Chỉ xử lý khi cuộn đủ mạnh
        if (Math.abs(scrollDirection) > 50) {
            clearTimeout(scrollTimeout);
            
            // Thêm một trễ nhỏ để tránh việc phát hiện scroll nhiều lần
            const delayTime = 50;
            
            // Đặt timeout để tránh kích hoạt nhiều lần khi scroll nhanh
            scrollTimeout = setTimeout(() => {
                // Thêm sự kiện để kiểm tra vị trí cuộn
                const scrollPosition = window.scrollY || window.pageYOffset;
                const documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight
                );
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                // Kiểm tra ngay nếu ở gần đầu trang hoặc cuối trang
                if ((scrollDirection > 0 && scrollPosition + windowHeight > documentHeight - windowHeight / 2) ||
                    (scrollDirection < 0 && scrollPosition < windowHeight / 2)) {
                    // Kích hoạt ngay lập tức nếu đã ở gần đầu/cuối trang
                    handleScrollNavigation(scrollDirection);
                }
            }, delayTime);
        }
    }, { passive: false });
    
    // Thêm hỗ trợ cảm ứng cho thiết bị di động
    let touchStartY = 0;
    let touchEndY = 0;
    const minTouchDistance = 100; // Khoảng cách tối thiểu để xem là vuốt
    
    // Sự kiện chạm bắt đầu
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    
    // Sự kiện chạm kết thúc
    window.addEventListener('touchend', (event) => {
        if (isScrolling || scrollCooldown) return;
        
        touchEndY = event.changedTouches[0].screenY;
        
        // Tính toán khoảng cách vuốt
        const touchDistance = touchEndY - touchStartY;
        
        // Nếu khoảng cách đủ lớn, xác định hướng vuốt
        if (Math.abs(touchDistance) > minTouchDistance) {
            // Vuốt lên (giá trị âm) => Chuyển chương tiếp, vuốt xuống (giá trị dương) => Chương trước
            const direction = -touchDistance; // Đảo ngược để phù hợp với logic scroll
            
            handleScrollNavigation(direction);
        }
    }, { passive: true });
    
    // Cập nhật trạng thái hiển thị của dải sáng (edge glow)
    function updateEdgeGlowState() {
        const glowTop = document.querySelector('.edge-glow-top');
        const glowBottom = document.querySelector('.edge-glow-bottom');
        
        if (!glowTop || !glowBottom) return;
        
        // Debug info - ghi log để kiểm tra trạng thái
        console.log('Edge Glow State:', {
            topScrolled,
            bottomScrolled,
            recentlyLoaded,
            timeSinceLoad: new Date().getTime() - pageLoadTimestamp,
            currentChapter: currentChapterId
        });
        
        // Force reflow để đảm bảo animation chạy ngay
        void glowTop.offsetWidth;
        void glowBottom.offsetWidth;
        
        // Áp dụng hiệu ứng cho dải sáng trên
        if (topScrolled && currentChapterId > 1) {
            glowTop.classList.add('active');
            // Tự động xóa class 'active' sau khi animation kết thúc
            setTimeout(() => {
                glowTop.classList.remove('active');
            }, 1500); // Thời gian bằng với thời lượng của animation
        } else {
            glowTop.classList.remove('active');
        }
        
        // Áp dụng hiệu ứng cho dải sáng dưới
        if (bottomScrolled && currentChapterId < totalChapters) {
            glowBottom.classList.add('active');
            // Tự động xóa class 'active' sau khi animation kết thúc
            setTimeout(() => {
                glowBottom.classList.remove('active');
            }, 1500); // Thời lượng của animation
        } else {
            glowBottom.classList.remove('active');
        }
    }
    
    // Xử lý việc chuyển chương khi scroll - yêu cầu scroll hai lần để chuyển chương
    function handleScrollNavigation(wheelDirection = null) {
        // Lấy thông tin vị trí scroll và kích thước trang
        const scrollPosition = window.scrollY || window.pageYOffset;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Nếu đang trong thời gian chờ hoặc đang chuyển chương, không xử lý
        if (scrollDelayActive || isScrolling || scrollCooldown) return;
        
        // Cập nhật lại giá trị recentlyLoaded mỗi lần scroll
        const currentTime = new Date().getTime();
        const timeSinceLoad = currentTime - pageLoadTimestamp;
        recentlyLoaded = timeSinceLoad < 1500;
        
        // Thiết lập thời gian hết hạn cho các trạng thái scroll - 2 giây
        const resetScrollState = () => {
            setTimeout(() => {
                topScrolled = false;
                bottomScrolled = false;
                // Cập nhật trạng thái dải sáng
                updateEdgeGlowState();
            }, 2000);
        };
        
        try {
            // Nếu có wheelDirection (từ sự kiện wheel), sử dụng nó để xác định hướng scroll
            if (wheelDirection !== null) {            
                if (wheelDirection > 0 && 
                    scrollPosition + windowHeight > documentHeight - windowHeight / 2) {
                    // Scroll xuống và đã gần đến cuối trang
                    if (currentChapterId < totalChapters) {
                        // Chỉ ghi log cho debug
                        console.log("Đã đụng bottom, bottomScrolled =", bottomScrolled, ", recentlyLoaded =", recentlyLoaded);
                        
                        if (!bottomScrolled) {
                            // Lần đầu tiên scroll đến cuối - chỉ đánh dấu và hiển thị dải sáng
                            bottomScrolled = true;
                            console.log("LẦN ĐẦU TIÊN đụng bottom, đang hiện dải sáng");
                            // Hiển thị ngay lập tức dải sáng khi đụng đến cuối
                            updateEdgeGlowState();
                            // Đặt lại trạng thái sau 2 giây nếu không có tương tác tiếp
                            resetScrollState();
                        } else if (!recentlyLoaded) { // Kiểm tra nếu không phải mới load trang
                            // Lần thứ hai scroll đến cuối - chuyển chương
                            console.log("LẦN THỨ HAI đụng bottom, chuẩn bị chuyển chương");
                            bottomScrolled = false; // Reset trạng thái
                            updateEdgeGlowState();
                            
                            // Kích hoạt hiệu ứng trượt xuống đến chương tiếp theo
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId + 1, 'bottom');
                            });
                        } else {
                            console.log("Trang mới tải, không chuyển chương");
                        }
                        return;
                    }
                } else if (wheelDirection < 0 && scrollPosition < windowHeight / 2) {
                    // Scroll lên và đã gần đến đầu trang
                    if (currentChapterId > 1) {
                        // Chỉ ghi log cho debug
                        console.log("Đã đụng top, topScrolled =", topScrolled, ", recentlyLoaded =", recentlyLoaded);
                        
                        if (!topScrolled) {
                            // Lần đầu tiên scroll đến đầu - chỉ đánh dấu và hiển thị dải sáng
                            topScrolled = true;
                            console.log("LẦN ĐẦU TIÊN đụng top, đang hiện dải sáng");
                            // Hiển thị ngay lập tức dải sáng khi đụng đến đầu trang
                            updateEdgeGlowState();
                            resetScrollState();
                        } else if (!recentlyLoaded) { // Kiểm tra nếu không phải mới load trang
                            // Lần thứ hai scroll đến đầu - chuyển chương
                            console.log("LẦN THỨ HAI đụng top, chuẩn bị chuyển chương");
                            topScrolled = false; // Reset trạng thái
                            updateEdgeGlowState();
                            
                            // Kích hoạt hiệu ứng trượt lên đến chương trước
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId - 1, 'top');
                            });
                        } else {
                            console.log("Trang mới tải, không chuyển chương");
                        }
                        return;
                    }
                } else {
                    // Nếu không ở gần đầu hoặc cuối, đặt lại trạng thái
                    if (scrollPosition > windowHeight / 2 && scrollPosition + windowHeight < documentHeight - windowHeight / 2) {
                        topScrolled = false;
                        bottomScrolled = false;
                        updateEdgeGlowState();
                    }
                }
            } else {
                // Phương thức truyền thống dựa trên vị trí scroll
                
                // Kiểm tra scroll đến cuối trang - sử dụng ngưỡng lớn hơn
                if (scrollPosition + windowHeight >= documentHeight - scrollThreshold) {
                    // Scroll xuống để đi đến chương tiếp theo
                    if (currentChapterId < totalChapters) {
                        // Ghi log để debug
                        console.log("Đã đụng bottom (scroll thường), bottomScrolled =", bottomScrolled, ", recentlyLoaded =", recentlyLoaded);
                        
                        if (!bottomScrolled) {
                            // Lần đầu tiên scroll đến cuối - chỉ đánh dấu và hiển thị dải sáng
                            bottomScrolled = true;
                            console.log("LẦN ĐẦU TIÊN đụng bottom (scroll thường), đang hiện dải sáng");
                            // Hiển thị ngay lập tức dải sáng
                            updateEdgeGlowState();
                            resetScrollState();
                        } else if (!recentlyLoaded) { // Kiểm tra nếu không phải mới load trang
                            // Lần thứ hai scroll đến cuối - chuyển chương
                            console.log("LẦN THỨ HAI đụng bottom (scroll thường), chuẩn bị chuyển chương");
                            bottomScrolled = false; // Reset trạng thái
                            updateEdgeGlowState();
                            
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId + 1, 'bottom');
                            });
                        } else {
                            console.log("Trang mới tải, không chuyển chương");
                        }
                        return;
                    }
                }
                
                // Kiểm tra scroll lên đầu trang - sử dụng ngưỡng lớn hơn
                if (scrollPosition <= scrollThreshold) {
                    // Scroll lên để đi đến chương trước
                    if (currentChapterId > 1) {
                        // Ghi log để debug
                        console.log("Đã đụng top (scroll thường), topScrolled =", topScrolled, ", recentlyLoaded =", recentlyLoaded);
                        
                        if (!topScrolled) {
                            // Lần đầu tiên scroll đến đầu - chỉ đánh dấu và hiển thị dải sáng
                            topScrolled = true;
                            console.log("LẦN ĐẦU TIÊN đụng top (scroll thường), đang hiện dải sáng");
                            // Hiển thị ngay lập tức dải sáng
                            updateEdgeGlowState();
                            resetScrollState();
                        } else if (!recentlyLoaded) { // Kiểm tra nếu không phải mới load trang
                            // Lần thứ hai scroll đến đầu - chuyển chương
                            console.log("LẦN THỨ HAI đụng top (scroll thường), chuẩn bị chuyển chương");
                            topScrolled = false; // Reset trạng thái
                            updateEdgeGlowState();
                            
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId - 1, 'top');
                            });
                        } else {
                            console.log("Trang mới tải, không chuyển chương");
                        }
                        return;
                    }
                }
                
                // Nếu không ở gần đầu hoặc cuối, đặt lại trạng thái
                if (scrollPosition > scrollThreshold && scrollPosition + windowHeight < documentHeight - scrollThreshold) {
                    topScrolled = false;
                    bottomScrolled = false;
                    updateEdgeGlowState();
                }
            }
        } catch (error) {
            console.error("Lỗi trong handleScrollNavigation:", error);
        }
        
        // Lưu vị trí scroll
        lastScrollPos = scrollPosition;
    }
    
    // Kích hoạt thời gian hồi để tránh kích hoạt liên tục
    function activateCooldown() {
        scrollCooldown = true;
        setTimeout(() => {
            scrollCooldown = false;
        }, 1000); // 1 giây thời gian hồi
    }
    
    // Kích hoạt độ trễ nhẹ trước khi chuyển chương để người dùng có thời gian hủy
    function activateScrollDelay(callback) {
        scrollDelayActive = true;
        setTimeout(() => {
            scrollDelayActive = false;
            callback();
        }, 300);
    }
    
    // Điều hướng đến chương mới với hiệu ứng trượt trang
    function navigateToChapter(chapterId, direction) {
        // Lưu thẻ container hiện tại để áp dụng animation
        const currentContainer = document.querySelector('.container');
        
        // Xác định animation dựa vào hướng
        if (direction === 'top') {
            currentContainer.classList.add('slide-out-top');
        } else {
            currentContainer.classList.add('slide-out-bottom');
        }
        
        // Thêm class cho body để không thể scroll trong quá trình chuyển chương
        document.body.classList.add('page-transition');
        
        // Tạo URL mới để chuyển đến
        const nextChapterURL = `chapter.html?id=${chapterId}`;
        
        // Chuyển đến chương mới với thời gian transition
        setTimeout(() => {
            // Thêm tham số cho hiệu ứng vào URL để trang mới biết cần animation nào
            const transitionParam = direction === 'top' ? '&transition=top' : '&transition=bottom';
            window.location.href = nextChapterURL + transitionParam;
        }, 500);
    }
    
    // Thêm hỗ trợ điều hướng bằng bàn phím (mũi tên)
    function addKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Bỏ qua nếu đang trong trạng thái chuyển chương
            if (isScrolling || scrollCooldown) return;
            
            // Bỏ qua nếu đang nhập liệu trong input hoặc textarea
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
            
            switch (event.key) {
                case 'ArrowRight': 
                case 'PageDown':
                    // Điều hướng đến chương tiếp theo
                    if (currentChapterId < totalChapters) {
                        isScrolling = true;
                        activateCooldown();
                        navigateToChapter(currentChapterId + 1, 'bottom');
                    }
                    break;
                    
                case 'ArrowLeft':
                case 'PageUp':
                    // Điều hướng đến chương trước
                    if (currentChapterId > 1) {
                        isScrolling = true;
                        activateCooldown();
                        navigateToChapter(currentChapterId - 1, 'top');
                    }
                    break;
                    
                default:
                    break;
            }
        });
    }
    
    // Kiểm tra nếu trang được load với hiệu ứng chuyển tiếp
    function checkTransitionEffect() {
        const urlParams = new URLSearchParams(window.location.search);
        const transition = urlParams.get('transition');
        
        if (transition) {
            const container = document.querySelector('.container');
            
            if (transition === 'top') {
                container.classList.add('slide-in-bottom');
            } else if (transition === 'bottom') {
                container.classList.add('slide-in-top');
            }
            
            // Xóa tham số transition để tránh nó xuất hiện trong URL và gây nhầm lẫn
            const newUrl = window.location.pathname + '?id=' + urlParams.get('id');
            history.replaceState({}, document.title, newUrl);
        }
    }
    
    // Chạy kiểm tra hiệu ứng khi trang load xong
    checkTransitionEffect();
    
    // Xóa trạng thái mới tải sau khoảng thời gian - không cần thiết vì chúng ta đã cập nhật recentlyLoaded mỗi lần scroll
    // setTimeout(() => {
    //     recentlyLoaded = false;
    // }, 1500);
}
