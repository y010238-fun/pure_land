/* ===========================
   主入口文件 - main.js
   初始化所有模組並綁定事件
   =========================== */

import { initScene3D, handleImageUpload } from './modules/scene3d.js';
import { initTTS, toggleSpeech, stopSpeech, isSpeechActive } from './modules/tts.js';
import { initVoiceInput, toggleVoiceInput } from './modules/voiceInput.js';
import { initVoiceChat, toggleVoiceChat } from './modules/voiceChat.js';
import { callGeminiAPI, saveApiKey, getApiKey } from './modules/apiClient.js';
import { addMessage, addLoadingIndicator, removeMessage } from './modules/chatUI.js';

// 頁面載入完成後初始化
window.addEventListener('DOMContentLoaded', () => {
    // 初始化圖示
    lucide.createIcons();

    // 初始化各模組
    initScene3D();
    initTTS();
    initVoiceInput();
    initVoiceChat();

    // 檢查是否有 API Key
    const apiKey = getApiKey();
    if (!apiKey) {
        setTimeout(() => toggleSettings(), 1000);
    } else {
        document.getElementById('api-key-input').value = apiKey;
    }
});

/**
 * 切換設定視窗
 */
window.toggleSettings = function () {
    const modal = document.getElementById('settings-modal');
    modal.classList.toggle('hidden');
};

/**
 * 儲存 API Key
 */
window.saveApiKeyHandler = function () {
    const input = document.getElementById('api-key-input').value.trim();
    if (input) {
        saveApiKey(input);
        toggleSettings();
        addMessage('ai', '金鑰已經連結好了，智慧之光點亮了。來，告訴我，你最近有什麼心事嗎？');
    } else {
        alert('請輸入有效的 API Key');
    }
};

/**
 * 切換語音輸入 - 自動開喇叭
 */
window.toggleVoiceInputHandler = function () {
    const isRecording = toggleVoiceInput();

    // 錄音模式：自動開喇叭
    if (isRecording && !isSpeechActive()) {
        toggleSpeech();
    }
};

/**
 * 切換語音互動模式 - 自動開喇叭
 */
window.toggleVoiceChatHandler = function () {
    const isActive = toggleVoiceChat();

    // 語音互動模式：自動開喇叭
    if (isActive && !isSpeechActive()) {
        toggleSpeech();
    }
};

/**
 * 處理圖片上傳
 */
window.handleImageUploadHandler = function (event) {
    handleImageUpload(event);
};

/**
 * 發送訊息 - 自動關喇叭
 */
window.sendMessage = async function () {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    const sendBtn = document.getElementById('send-btn');

    if (!userText) return;

    if (!getApiKey()) {
        alert('請先設定 API Key');
        toggleSettings();
        return;
    }

    // 停止之前的語音
    stopSpeech();

    // 文字輸入模式：自動關喇叭
    if (isSpeechActive()) {
        toggleSpeech();
    }

    // 顯示使用者訊息
    await addMessage('user', userText);
    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="animate-spin" data-lucide="loader-2"></i>';
    lucide.createIcons();

    // 顯示載入指示器
    const loadingId = addLoadingIndicator();

    // 呼叫 API
    try {
        const responseText = await callGeminiAPI(userText);
        removeMessage(loadingId);
        await addMessage('ai', responseText);
    } catch (error) {
        removeMessage(loadingId);
        await addMessage('ai', '（阿彌陀佛似乎正在入定，連線出現了問題，請檢查您的網路或 API Key）\n\n錯誤代碼：' + error.message);
        console.error(error);
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i data-lucide="send"></i>';
        lucide.createIcons();
        inputField.focus();
    }
};

/**
 * 鍵盤事件處理（Enter 送出訊息，輸入時自動關喇叭）
 */
window.handleKeyPress = function (event) {
    // 使用者開始打字時，自動關喇叭
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        if (isSpeechActive()) {
            toggleSpeech();
        }
    }

    if (event.key === 'Enter') {
        sendMessage();
    }
};