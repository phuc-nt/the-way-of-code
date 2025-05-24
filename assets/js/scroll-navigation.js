// Tính năng scroll vô hạn để chuyển chương
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem đang ở trang chapter không
    if (window.location.pathname.endsWith('chapter.html')) {
        initInfiniteScroll();
        // Thêm class cho animation khi trang mới load
        document.querySelector('.container').classList.add('fade-in-content');
    }
});

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
    
    // Lấy thông tin chương hiện tại và tổng số chương
    const urlParams = new URLSearchParams(window.location.search);
    let currentChapterId = parseInt(urlParams.get('id') || '1');
    let totalChapters = 81; // Giá trị mặc định
    
    // Lấy tổng số chương thực tế từ intro.json
    fetch('data/intro.json')
        .then(response => response.json())
        .then(data => {
            totalChapters = data.totalChapters;
            updateScrollIndicators(); // Cập nhật chỉ báo sau khi có tổng số chương
        })
        .catch(error => {
            console.error('Error loading intro data:', error);
        });
    
    // Thêm các phần tử chỉ báo scroll
    addScrollIndicators();
    
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
        
        // Ngăn chặn sự kiện mặc định trong một số trường hợp
        // event.preventDefault();
        
        // Ghi nhớ hướng cuộn (dương là cuộn xuống, âm là cuộn lên)
        // Tương thích với cả Chrome, Firefox và Safari
        const scrollDirection = event.deltaY || event.detail * -40 || event.wheelDelta * -1;
        
        // Chỉ xử lý khi cuộn đủ mạnh
        if (Math.abs(scrollDirection) > 50) {
            clearTimeout(scrollTimeout);
            
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
            } else {
                // Nếu không, đặt thời gian chờ bình thường
                scrollTimeout = setTimeout(() => {
                    handleScrollNavigation(scrollDirection);
                }, 150);
            }
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
    
    // Thêm phần tử chỉ báo scroll
    function addScrollIndicators() {
        const scrollIndicatorTop = document.createElement('div');
        scrollIndicatorTop.className = 'scroll-indicator scroll-indicator-top';
        scrollIndicatorTop.innerHTML = '<div class="scroll-arrow">↑</div><div class="scroll-text">Chương trước</div>';
        
        const scrollIndicatorBottom = document.createElement('div');
        scrollIndicatorBottom.className = 'scroll-indicator scroll-indicator-bottom';
        scrollIndicatorBottom.innerHTML = '<div class="scroll-arrow">↓</div><div class="scroll-text">Chương tiếp</div>';
        
        document.body.appendChild(scrollIndicatorTop);
        document.body.appendChild(scrollIndicatorBottom);
        
        // Thêm sự kiện click để điều hướng khi nhấp vào - không có độ trễ vì đây là hành động chủ ý
        scrollIndicatorTop.addEventListener('click', () => {
            if (currentChapterId > 1 && !isScrolling && !scrollCooldown && !scrollDelayActive) {
                // Thêm hiệu ứng khi click
                scrollIndicatorTop.style.transform = 'translateX(-50%) scale(0.95)';
                setTimeout(() => {
                    scrollIndicatorTop.style.transform = '';
                    isScrolling = true;
                    activateCooldown();
                    navigateToChapter(currentChapterId - 1);
                }, 100);
            }
        });
        
        scrollIndicatorBottom.addEventListener('click', () => {
            if (currentChapterId < totalChapters && !isScrolling && !scrollCooldown && !scrollDelayActive) {
                // Thêm hiệu ứng khi click
                scrollIndicatorBottom.style.transform = 'translateX(-50%) scale(0.95)';
                setTimeout(() => {
                    scrollIndicatorBottom.style.transform = '';
                    isScrolling = true;
                    activateCooldown();
                    navigateToChapter(currentChapterId + 1);
                }, 100);
            }
        });
        
        // Cập nhật trạng thái hiển thị chỉ báo
        updateScrollIndicators();
    }
    
    // Cập nhật trạng thái hiển thị của các chỉ báo
    function updateScrollIndicators() {
        const scrollIndicatorTop = document.querySelector('.scroll-indicator-top');
        const scrollIndicatorBottom = document.querySelector('.scroll-indicator-bottom');
        
        if (!scrollIndicatorTop || !scrollIndicatorBottom) return;
        
        if (currentChapterId <= 1) {
            scrollIndicatorTop.classList.add('disabled');
        } else {
            scrollIndicatorTop.classList.remove('disabled');
            scrollIndicatorTop.querySelector('.scroll-text').textContent = `Chương ${currentChapterId - 1}`;
        }
        
        if (currentChapterId >= totalChapters) {
            scrollIndicatorBottom.classList.add('disabled');
        } else {
            scrollIndicatorBottom.classList.remove('disabled');
            scrollIndicatorBottom.querySelector('.scroll-text').textContent = `Chương ${currentChapterId + 1}`;
        }
    }
    
    // Cập nhật trạng thái hiển thị của chỉ báo dựa trên trạng thái scroll
    function updateScrollIndicatorsState() {
        const scrollIndicatorTop = document.querySelector('.scroll-indicator-top');
        const scrollIndicatorBottom = document.querySelector('.scroll-indicator-bottom');
        
        if (!scrollIndicatorTop || !scrollIndicatorBottom) return;
        
        // Thêm/xóa class 'ready' mà không thay đổi nội dung text
        if (topScrolled && currentChapterId > 1) {
            scrollIndicatorTop.classList.add('ready');
            // Không hiện text "Scroll lại để chuyển chương" nữa
        } else {
            scrollIndicatorTop.classList.remove('ready');
        }
        
        // Tương tự ở cuối trang
        if (bottomScrolled && currentChapterId < totalChapters) {
            scrollIndicatorBottom.classList.add('ready');
            // Không hiện text "Scroll lại để chuyển chương" nữa
        } else {
            scrollIndicatorBottom.classList.remove('ready');
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
        
        // Nếu đang trong thời gian chờ, không xử lý
        if (scrollDelayActive) return;
        
        // Thiết lập thời gian hết hạn cho các trạng thái scroll - 2 giây
        const resetScrollState = () => {
            setTimeout(() => {
                topScrolled = false;
                bottomScrolled = false;
                // Cập nhật trạng thái visual nếu cần
                updateScrollIndicatorsState();
            }, 2000);
        };
        
        try {
            // Nếu có wheelDirection (từ sự kiện wheel), sử dụng nó để xác định hướng scroll
            if (wheelDirection !== null) {            
                if (wheelDirection > 0 && 
                    scrollPosition + windowHeight > documentHeight - windowHeight / 2) {
                    // Scroll xuống và đã gần đến cuối trang
                    if (currentChapterId < totalChapters) {
                        if (!bottomScrolled) {
                            // Lần đầu tiên scroll đến cuối - chỉ đánh dấu và hiển thị chỉ báo
                            bottomScrolled = true;
                            updateScrollIndicatorsState();
                            resetScrollState();
                        } else {
                            // Lần thứ hai scroll đến cuối - chuyển chương
                            bottomScrolled = false; // Reset trạng thái
                            updateScrollIndicatorsState();
                            
                            // Kích hoạt độ trễ và hiển thị indicator mạnh hơn
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId + 1);
                            });
                        }
                        return;
                    }
                } else if (wheelDirection < 0 && scrollPosition < windowHeight / 2) {
                    // Scroll lên và đã gần đến đầu trang
                    if (currentChapterId > 1) {
                        if (!topScrolled) {
                            // Lần đầu tiên scroll đến đầu - chỉ đánh dấu và hiển thị chỉ báo
                            topScrolled = true;
                            updateScrollIndicatorsState();
                            resetScrollState();
                        } else {
                            // Lần thứ hai scroll đến đầu - chuyển chương
                            topScrolled = false; // Reset trạng thái
                            updateScrollIndicatorsState();
                            
                            // Kích hoạt độ trễ và hiển thị indicator mạnh hơn
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId - 1);
                            });
                        }
                        return;
                    }
                } else {
                    // Nếu không ở gần đầu hoặc cuối, đặt lại trạng thái
                    if (scrollPosition > windowHeight / 2 && scrollPosition + windowHeight < documentHeight - windowHeight / 2) {
                        topScrolled = false;
                        bottomScrolled = false;
                        updateScrollIndicatorsState();
                    }
                }
            } else {
                // Phương thức truyền thống dựa trên vị trí scroll
                
                // Kiểm tra scroll đến cuối trang - sử dụng ngưỡng lớn hơn
                if (scrollPosition + windowHeight >= documentHeight - scrollThreshold) {
                    // Scroll xuống để đi đến chương tiếp theo
                    if (currentChapterId < totalChapters) {
                        if (!bottomScrolled) {
                            // Lần đầu tiên scroll đến cuối - chỉ đánh dấu và hiển thị chỉ báo
                            bottomScrolled = true;
                            updateScrollIndicatorsState();
                            resetScrollState();
                        } else {
                            // Lần thứ hai scroll đến cuối - chuyển chương
                            bottomScrolled = false; // Reset trạng thái
                            updateScrollIndicatorsState();
                            
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId + 1);
                            });
                        }
                        return;
                    }
                }
                
                // Kiểm tra scroll lên đầu trang - sử dụng ngưỡng lớn hơn
                if (scrollPosition <= scrollThreshold) {
                    // Scroll lên để đi đến chương trước
                    if (currentChapterId > 1) {
                        if (!topScrolled) {
                            // Lần đầu tiên scroll đến đầu - chỉ đánh dấu và hiển thị chỉ báo
                            topScrolled = true;
                            updateScrollIndicatorsState();
                            resetScrollState();
                        } else {
                            // Lần thứ hai scroll đến đầu - chuyển chương
                            topScrolled = false; // Reset trạng thái
                            updateScrollIndicatorsState();
                            
                            activateScrollDelay(() => {
                                isScrolling = true;
                                activateCooldown();
                                navigateToChapter(currentChapterId - 1);
                            });
                        }
                        return;
                    }
                }
                
                // Nếu không ở gần đầu hoặc cuối, đặt lại trạng thái
                if (scrollPosition > scrollThreshold && scrollPosition + windowHeight < documentHeight - scrollThreshold) {
                    topScrolled = false;
                    bottomScrolled = false;
                    updateScrollIndicatorsState();
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
        
        // Tăng độ hiển thị của chỉ báo scroll để báo hiệu sắp chuyển chương
        // Sử dụng phương pháp an toàn hơn để xác định hướng
        let direction = 'bottom';
        try {
            const callbackStr = callback.toString();
            direction = callbackStr.indexOf('currentChapterId + 1') !== -1 ? 'bottom' : 'top';
        } catch (e) {
            console.log('Could not determine direction from callback, using default', e);
        }
        
        const indicator = document.querySelector(`.scroll-indicator-${direction}`);
        
        if (indicator) {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translateX(-50%) scale(1.1)';
        }
        
        // Đặt 300ms độ trễ để người dùng có thể hủy bằng cách cuộn ngược lại
        setTimeout(() => {
            // Đặt lại style của indicator
            if (indicator) {
                indicator.style.opacity = '';
                indicator.style.transform = '';
            }
            
            scrollDelayActive = false;
            callback();
        }, 300);
    }
    
    // Điều hướng đến chương mới
    function navigateToChapter(chapterId) {
        // Hiển thị hiệu ứng chuyển trang
        document.body.classList.add('page-transition');
        
        // Thêm phần tử loading để cải thiện UX
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'chapter-loading';
        loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingIndicator);
        
        // Chuyển đến chương mới với thời gian transition dài hơn
        setTimeout(() => {
            window.location.href = `chapter.html?id=${chapterId}`;
        }, 500); // Tăng thời gian để transition mượt mà hơn
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
                        
                        // Hiệu ứng cho nút chỉ báo
                        const indicatorBottom = document.querySelector('.scroll-indicator-bottom');
                        if (indicatorBottom) {
                            indicatorBottom.style.opacity = '1';
                            indicatorBottom.style.transform = 'translateX(-50%) scale(1.1)';
                            setTimeout(() => {
                                navigateToChapter(currentChapterId + 1);
                            }, 200);
                        } else {
                            navigateToChapter(currentChapterId + 1);
                        }
                    }
                    break;
                    
                case 'ArrowLeft':
                case 'PageUp':
                    // Điều hướng đến chương trước
                    if (currentChapterId > 1) {
                        isScrolling = true;
                        activateCooldown();
                        
                        // Hiệu ứng cho nút chỉ báo
                        const indicatorTop = document.querySelector('.scroll-indicator-top');
                        if (indicatorTop) {
                            indicatorTop.style.opacity = '1';
                            indicatorTop.style.transform = 'translateX(-50%) scale(1.1)';
                            setTimeout(() => {
                                navigateToChapter(currentChapterId - 1);
                            }, 200);
                        } else {
                            navigateToChapter(currentChapterId - 1);
                        }
                    }
                    break;
                    
                default:
                    break;
            }
        });
    }
}
