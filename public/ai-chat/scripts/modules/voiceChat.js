/* ===========================
   語音互動模組 - voiceChat.js
   持續語音對話功能
   =========================== */

import { stopSpeech, speakText, isSpeechActive, toggleSpeech, isSpeechActive as checkSpeechEnabled } from './tts.js';
import { callGeminiAPI, getApiKey } from './apiClient.js';
import { addMessage, addLoadingIndicator, removeMessage } from './chatUI.js';
import { isSpeechActive as isTTSActive } from './tts.js';

// 語音互動狀態
let isVoiceChatMode = false;
let recognition = null;
let currentUtterance = null;
let silenceStartTime = 0;  // 安靜開始時間
const MIN_SILENCE_DURATION = 1500;  // 最短安靜 1.5 秒才重新聆聽
let silenceCheckInterval = null;

/**
 * 初始化語音互動模組
 */
export function initVoiceChat() {
    // 檢查瀏覽器支援度
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log("瀏覽器不支援語音辨識，語音互動功能停用");
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false; // 只取最終結果
    recognition.lang = 'cmn-Hant-TW';

    // 辨識結果處理
    recognition.onresult = async function (event) {
        if (!isVoiceChatMode) return;

        const transcript = event.results[0][0].transcript;
        console.log('語音互動辨識結果:', transcript);

        if (transcript.trim()) {
            // 自動送出訊息
            await processVoiceChatMessage(transcript);
        }
    };

    // 辨識結束 - 使用安靜檢測機制，避免 AI 聽到自己
    recognition.onend = function () {
        // 如果離開語音互動模式，不做任何事
        if (!isVoiceChatMode) {
            stopSilenceCheck();
            return;
        }

        // 如果 AI 正在說話，不重新聆聽
        if (window.speechSynthesis.speaking) {
            silenceStartTime = Date.now();
            startSilenceCheck();
            return;
        }

        // 開始安靜檢測
        silenceStartTime = Date.now();
        startSilenceCheck();
    };

    // 錯誤處理
    recognition.onerror = function (event) {
        console.error("語音互動辨識錯誤:", event.error);

        if (event.error === 'not-allowed') {
            alert("請允許麥克風權限以使用語音互動。");
            stopVoiceChat();
        } else if (isVoiceChatMode) {
            // 其他錯誤時繼續嘗試
            setTimeout(() => {
                if (isVoiceChatMode) startListening();
            }, 1000);
        }
    };

    return true;
}

/**
 * 開始聆聽
 */
function startListening() {
    if (!recognition || !isVoiceChatMode) return;

    // 如果 AI 正在說話，不開始聆聽
    if (window.speechSynthesis.speaking) {
        console.log('AI 正在說話，延後聆聽');
        return;
    }

    try {
        recognition.start();
        updateVoiceChatUI('listening');
    } catch (e) {
        // 可能已經在聆聽中
        console.log('聆聽中...');
    }
}

/**
 * 開始安靜檢測計時器
 */
function startSilenceCheck() {
    if (silenceCheckInterval) return;

    silenceCheckInterval = setInterval(() => {
        // 如果離開語音互動模式，停止檢測
        if (!isVoiceChatMode) {
            stopSilenceCheck();
            return;
        }

        // 如果 AI 開始說話，重置並停止檢測
        if (window.speechSynthesis.speaking) {
            silenceStartTime = Date.now();
            return;
        }

        // 檢查是否已安靜足夠時間
        const silenceDuration = Date.now() - silenceStartTime;
        if (silenceDuration >= MIN_SILENCE_DURATION) {
            stopSilenceCheck();
            if (isVoiceChatMode && !window.speechSynthesis.speaking) {
                console.log(`環境安靜 ${silenceDuration}ms，開始聆聽`);
                startListening();
            }
        }
    }, 100);
}

/**
 * 停止安靜檢測計時器
 */
function stopSilenceCheck() {
    if (silenceCheckInterval) {
        clearInterval(silenceCheckInterval);
        silenceCheckInterval = null;
    }
}

/**
 * 處理語音互動訊息
 * @param {string} text - 辨識到的文字
 */
async function processVoiceChatMessage(text) {
    if (!getApiKey()) {
        speakAndContinue('請先設定 API Key 才能使用語音互動功能。');
        return;
    }

    updateVoiceChatUI('processing');

    // 停止之前的語音
    stopSpeech();

    // 顯示使用者訊息
    await addMessage('user', text);

    // 顯示載入指示器
    const loadingId = addLoadingIndicator();

    try {
        const responseText = await callGeminiAPI(text);
        removeMessage(loadingId);

        // ⚠️ 重要：先開始朗讀，再顯示文字，確保語音和文字同步
        // speakAndContinue 會立即開始播放，addMessage 會用打字機效果跟隨語音進度
        speakAndContinue(responseText);

        // 不用 await，讓打字機效果和語音並行
        addMessage('ai', responseText);

    } catch (error) {
        removeMessage(loadingId);
        const errorMsg = '阿彌陀佛似乎正在入定，連線出現了問題。';
        speakAndContinue(errorMsg);
        addMessage('ai', errorMsg);
        console.error(error);
    }
}

/**
 * 朗讀文字並在結束後繼續聆聽
 * @param {string} text - 要朗讀的文字
 */
function speakAndContinue(text) {
    updateVoiceChatUI('speaking');

    // ⚠️ 重要：開始朗讀前，必須先停止語音辨識，避免 AI 聽到自己的聲音
    if (recognition) {
        try {
            recognition.stop();
            console.log('停止語音辨識以避免自我聆聽');
        } catch (e) {
            // 可能未在辨識中
        }
    }

    // 停止之前的語音
    stopSpeech();

    // 確保喇叭開啟（自動開喇叭）
    if (!checkSpeechEnabled()) {
        toggleSpeech();
    }

    // 清理文字（移除 markdown 等）
    const cleanText = text
        .replace(/[#*_`~\[\](){}|\\]/g, '')
        .replace(/\n+/g, '。')
        .trim();

    // 使用 tts.js 的 speakText 來朗讀（已設定好柔和男聲）
    // 並取得 currentUtterance 來設置 onend
    currentUtterance = speakText(cleanText);

    // 如果 currentUtterance 存在，設置結束回調
    if (currentUtterance) {
        currentUtterance.onend = function () {
            console.log('朗讀完成，準備繼續聆聽');
            silenceStartTime = Date.now();
            if (isVoiceChatMode) {
                startSilenceCheck();
            }
        };

        currentUtterance.onerror = function (event) {
            console.error('語音合成錯誤:', event);
            if (isVoiceChatMode) {
                silenceStartTime = Date.now();
                startSilenceCheck();
            }
        };
    } else {
        // 如果 speakText 返回 null（喇叭未開啟），直接開始聆聽
        console.log('喇叭未開啟，跳過朗讀');
        silenceStartTime = Date.now();
        if (isVoiceChatMode) {
            startSilenceCheck();
        }
    }
}

/**
 * 更新語音互動 UI 狀態
 * @param {string} state - 'listening' | 'processing' | 'speaking' | 'idle'
 */
function updateVoiceChatUI(state) {
    const btn = document.getElementById('voice-chat-btn');
    const statusText = {
        'listening': '聆聽中...',
        'processing': '思考中...',
        'speaking': '說話中...',
        'idle': '語音互動'
    };

    // 更新輸入框提示
    const inputField = document.getElementById('user-input');
    if (inputField && state !== 'idle') {
        inputField.placeholder = statusText[state];
    }

    // 更新按鈕樣式
    if (btn) {
        btn.classList.remove('voice-chat-listening', 'voice-chat-processing', 'voice-chat-speaking');
        if (state !== 'idle') {
            btn.classList.add(`voice-chat-${state}`);
        }
    }
}

/**
 * 開始語音互動模式
 */
export function startVoiceChat() {
    if (!recognition) {
        if (!initVoiceChat()) {
            alert('您的瀏覽器不支援語音互動功能。');
            return false;
        }
    }

    if (!getApiKey()) {
        alert('請先設定 API Key');
        return false;
    }

    isVoiceChatMode = true;

    // 更新按鈕狀態
    const btn = document.getElementById('voice-chat-btn');
    if (btn) {
        btn.classList.add('voice-chat-active');
    }

    // 開始聆聽
    startListening();

    // 隱藏一般輸入區的某些元素（可選）
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.placeholder = '語音互動模式中...';
    }

    console.log('語音互動模式已啟動');
    return true;
}

/**
 * 停止語音互動模式
 */
export function stopVoiceChat() {
    isVoiceChatMode = false;

    // 停止安靜檢測
    stopSilenceCheck();

    // 停止辨識
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {
            // 可能未在辨識中
        }
    }

    // 停止朗讀
    window.speechSynthesis.cancel();

    // 關閉喇叭
    if (checkSpeechEnabled()) {
        toggleSpeech();
    }

    // 更新按鈕狀態
    const btn = document.getElementById('voice-chat-btn');
    if (btn) {
        btn.classList.remove('voice-chat-active', 'voice-chat-listening', 'voice-chat-processing', 'voice-chat-speaking');
    }

    // 恢復輸入框
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.placeholder = '輸入文字或點擊麥克風說話...';
    }

    updateVoiceChatUI('idle');
    console.log('語音互動模式已停止');
}

/**
 * 切換語音互動模式
 * @returns {boolean} 當前狀態
 */
export function toggleVoiceChat() {
    if (isVoiceChatMode) {
        stopVoiceChat();
    } else {
        startVoiceChat();
    }
    return isVoiceChatMode;
}

/**
 * 取得語音互動狀態
 * @returns {boolean}
 */
export function isVoiceChatActive() {
    return isVoiceChatMode;
}
