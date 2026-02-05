/* ===========================
   工具函數模組 - utils.js
   常用輔助函數
   =========================== */

/**
 * 平滑捲動到聊天記錄底部
 * @param {HTMLElement} element - 聊天容器元素
 */
export function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

/**
 * 生成隨機 ID
 * @returns {string} 唯一識別碼
 */
export function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * 清理 Markdown 文字（為語音合成準備）
 * @param {string} text - 原始文字
 * @returns {string} 清理後的文字
 */
export function cleanTextForSpeech(text) {
    return text
        .replace(/\*\*/g, '')      // 移除粗體
        .replace(/\*/g, '')        // 移除斜體
        .replace(/\#/g, '')        // 移除標題符號
        .replace(/\[.*?\]/g, '')   // 移除連結文字
        .replace(/\(.*?\)/g, '')   // 移除括號備註
        .replace(/<.*?>/g, '');    // 移除 HTML 標籤
}

/**
 * 延遲函數
 * @param {number} ms - 延遲毫秒數
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
