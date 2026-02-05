/* ===========================
   聊天 UI 模組 - chatUI.js
   訊息顯示、打字機效果
   =========================== */

import { scrollToBottom, generateId, delay } from './utils.js';
import { speakText, isSpeechActive, getSpeechCharIndex } from './tts.js';
import { isVoiceChatActive } from './voiceChat.js';

/**
 * 添加訊息到聊天記錄
 * @param {string} role - 'user' 或 'ai'
 * @param {string} text - 訊息內容
 */
export async function addMessage(role, text) {
    const historyDiv = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');

    const isAI = role === 'ai';
    msgDiv.className = `${isAI ? 'msg-ai' : 'msg-user'} p-4 rounded-lg ${isAI ? 'self-start' : 'self-end'} max-w-[90%] ${isAI ? '' : 'fade-in'} shadow-sm`;

    if (isAI) {
        // AI 訊息顯示
        const title = document.createElement('div');
        title.className = 'text-sm text-yellow-500 mb-1 font-bold flex items-center gap-1';
        title.innerHTML = '<i data-lucide="sparkles" width="12"></i> 阿彌陀佛';
        msgDiv.appendChild(title);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'markdown-content text-gray-200 typing-cursor';
        msgDiv.appendChild(contentDiv);

        historyDiv.appendChild(msgDiv);
        scrollToBottom(historyDiv);
        lucide.createIcons();

        // 語音模式時使用純文字確保同步，非語音模式使用 Markdown
        const displayContent = isSpeechActive() ? text.replace(/[#*_`~\[\](){}|\\]/g, ' ') : marked.parse(text);

        // 如果語音開關且不在語音互動模式，開始朗讀
        // （語音互動模式由 speakAndContinue 控制朗讀，避免重複）
        if (isSpeechActive() && !isVoiceChatActive()) {
            speakText(text);
        }

        // 執行打字機特效
        const isPlainText = isSpeechActive();
        await typeWriterEffect(contentDiv, displayContent, isPlainText);

        // 打字結束，移除游標
        contentDiv.classList.remove('typing-cursor');
    } else {
        // 使用者訊息顯示
        const content = document.createElement('div');
        content.className = 'text-white';
        content.innerText = text;
        msgDiv.appendChild(content);

        historyDiv.appendChild(msgDiv);
        scrollToBottom(historyDiv);
        lucide.createIcons();
    }

    return msgDiv;
}

/**
 * 打字機效果（支援 HTML 結構）- 語音同步版
 * @param {HTMLElement} container - 容器元素
 * @param {string} htmlString - HTML 字串
 * @param {boolean} isPlainText - 是否為純文字模式
 */
async function typeWriterEffect(container, htmlString, isPlainText = false) {
    const tempDiv = document.createElement('div');

    if (isPlainText) {
        // 純文字模式：將換行轉為 <br> 標籤
        tempDiv.innerHTML = htmlString.replace(/\n/g, '<br>');
    } else {
        tempDiv.innerHTML = htmlString;
    }

    const nodes = Array.from(tempDiv.childNodes);
    let currentIndex = 0;

    for (const node of nodes) {
        currentIndex = await typeNode(node, container, currentIndex);
    }
}

/**
 * 遞迴式打字節點
 * @param {Node} sourceNode - 來源節點
 * @param {HTMLElement} targetParent - 目標父元素
 * @param {number} startIndex - 文字的起始索引（用於語音同步）
 */
async function typeNode(sourceNode, targetParent, startIndex = 0) {
    const historyDiv = document.getElementById('chat-history');
    let currentIndex = startIndex;

    if (sourceNode.nodeType === Node.TEXT_NODE) {
        const text = sourceNode.textContent;
        const textNode = document.createTextNode('');
        targetParent.appendChild(textNode);

        // 根據是否開啟語音，動態調整打字速度
        const baseDelay = isSpeechActive() ? 100 : 150;

        for (let i = 0; i < text.length; i++) {
            textNode.textContent += text[i];
            scrollToBottom(historyDiv);

            // 語音模式：使用滑動窗口等待語音進度
            if (isSpeechActive()) {
                const targetPos = currentIndex + i;
                let waitCount = 0;
                const maxWait = 20; // 最多等待 20 個檢查週期

                while (getSpeechCharIndex() < targetPos && waitCount < maxWait && window.speechSynthesis.speaking) {
                    await delay(30);
                    waitCount++;
                }
            }

            // 標點符號額外停頓
            const char = text[i];
            const isPunctuation = ['，', '。', '！', '？', '、', '：', '\n'].includes(char);
            const extraDelay = (isSpeechActive() && isPunctuation) ? 400 : 0;

            await delay(baseDelay + extraDelay);
        }

        return currentIndex + text.length;
    } else if (sourceNode.nodeType === Node.ELEMENT_NODE) {
        const element = document.createElement(sourceNode.tagName);
        Array.from(sourceNode.attributes).forEach(attr => {
            element.setAttribute(attr.name, attr.value);
        });
        targetParent.appendChild(element);

        const children = Array.from(sourceNode.childNodes);
        for (const child of children) {
            currentIndex = await typeNode(child, element, currentIndex);
        }
        return currentIndex;
    }

    return currentIndex;
}

/**
 * 添加載入指示器
 * @returns {string} 載入元素 ID
 */
export function addLoadingIndicator() {
    const historyDiv = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    const id = 'loading-' + Date.now();

    msgDiv.id = id;
    msgDiv.className = 'msg-ai p-4 rounded-lg self-start fade-in flex gap-1 items-center';
    msgDiv.innerHTML = `
        <div class="typing-dot w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div class="typing-dot w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div class="typing-dot w-2 h-2 bg-yellow-500 rounded-full"></div>
    `;

    historyDiv.appendChild(msgDiv);
    scrollToBottom(historyDiv);
    return id;
}

/**
 * 移除訊息
 * @param {string} id - 訊息元素 ID
 */
export function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}
