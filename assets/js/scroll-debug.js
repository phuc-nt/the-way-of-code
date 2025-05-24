// Debug helper for scroll navigation issues
function enableScrollDebug() {
    // Kích hoạt chế độ debug
    localStorage.setItem('scrollDebugMode', 'true');
    
    // Tạo phần tử debug
    if (!document.querySelector('.scroll-debug-panel')) {
        const debugPanel = document.createElement('div');
        debugPanel.className = 'scroll-debug-panel';
        debugPanel.innerHTML = `
            <h4>Scroll Debug</h4>
            <div id="scroll-debug-content"></div>
            <button id="clear-debug-log">Clear</button>
            <button id="disable-debug">Disable Debug</button>
        `;
        document.body.appendChild(debugPanel);
        
        // Style cho debug panel
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
            max-height: 200px;
            overflow-y: auto;
        `;
        
        // Event listeners cho các nút
        document.getElementById('clear-debug-log').addEventListener('click', () => {
            document.getElementById('scroll-debug-content').innerHTML = '';
        });
        
        document.getElementById('disable-debug').addEventListener('click', () => {
            localStorage.removeItem('scrollDebugMode');
            if (debugPanel && debugPanel.parentNode) {
                debugPanel.parentNode.removeChild(debugPanel);
            }
        });
    }
    
    // Ghi đè console.log cho debug
    const originalLog = console.log;
    console.log = function() {
        // Gọi hàm log gốc
        originalLog.apply(console, arguments);
        
        // Thêm vào debug panel
        const debugContent = document.getElementById('scroll-debug-content');
        if (debugContent) {
            const args = Array.from(arguments).map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg);
                    } catch(e) {
                        return arg.toString();
                    }
                }
                return arg;
            }).join(' ');
            
            const logEntry = document.createElement('div');
            logEntry.textContent = args;
            logEntry.style.borderBottom = '1px solid #333';
            logEntry.style.paddingBottom = '3px';
            logEntry.style.marginBottom = '3px';
            
            debugContent.appendChild(logEntry);
            
            // Giữ scroll ở cuối
            debugContent.scrollTop = debugContent.scrollHeight;
        }
    };
}

// Kiểm tra xem có trong chế độ debug không
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('scrollDebugMode') === 'true') {
        enableScrollDebug();
    }
    
    // Debug mode hotkey: Alt + Shift + D
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.shiftKey && e.key === 'D') {
            if (localStorage.getItem('scrollDebugMode') === 'true') {
                localStorage.removeItem('scrollDebugMode');
                location.reload();
            } else {
                enableScrollDebug();
            }
        }
    });
});
