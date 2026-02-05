/* ===========================
   語音合成模組 - tts.js
   Text-to-Speech 語音朗讀功能
   =========================== */

import { cleanTextForSpeech } from './utils.js';

// 語音狀態
let isSpeechEnabled = false;
let currentUtterance = null;
let speechCharIndex = 0; // 當前朗讀到的字符位置

/**
 * 初始化語音合成
 */
export function initTTS() {
    // 預先載入語音列表（某些瀏覽器需要）
    window.speechSynthesis.getVoices();
}

/**
 * 切換語音朗讀開關
 * @returns {boolean} 當前語音狀態
 */
export function toggleSpeech() {
    isSpeechEnabled = !isSpeechEnabled;

    if (isSpeechEnabled) {
        // 如果當前有正在播放的，繼續；否則不動作，等待下一次對話
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    } else {
        window.speechSynthesis.cancel(); // 立即停止
    }

    return isSpeechEnabled;
}

/**
 * 朗讀文字
 * @param {string} text - 要朗讀的文字
 * @returns {SpeechSynthesisUtterance|null} 語音實例
 */
export function speakText(text) {
    if (!isSpeechEnabled) return null;

    // 停止之前的語音
    window.speechSynthesis.cancel();
    speechCharIndex = 0;

    // 清理文字
    const cleanText = cleanTextForSpeech(text);

    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.lang = 'zh-TW';

    // 調整參數以模擬柔和莊嚴的聲音
    currentUtterance.rate = 0.9;  // 稍快，自然
    currentUtterance.pitch = 1.0; // 正常 pitch，柔和

    // 嘗試尋找柔和的中文男聲
    const voices = window.speechSynthesis.getVoices();
    // 優先找 Microsoft David 或其他男聲
    let selectedVoice = voices.find(v => 
        v.lang.includes('TW') || v.lang.includes('CN')
    );
    
    // 如果有特定男聲名稱，優先使用
    const maleVoiceNames = ['Microsoft David', '男', 'Male'];
    for (const name of maleVoiceNames) {
        const voice = voices.find(v => v.name.includes(name));
        if (voice && (voice.lang.includes('TW') || voice.lang.includes('CN'))) {
            selectedVoice = voice;
            break;
        }
    }
    
    if (selectedVoice) {
        currentUtterance.voice = selectedVoice;
    }

    // 追蹤朗讀進度
    speechCharIndex = 0;
    currentUtterance.onboundary = function(event) {
        if (event.name === 'word' || event.name === 'sentence') {
            speechCharIndex = event.charIndex;
        }
    };

    window.speechSynthesis.speak(currentUtterance);
    
    return currentUtterance;
}

/**
 * 取得當前朗讀到的字符位置
 * @returns {number}
 */
export function getSpeechCharIndex() {
    return speechCharIndex;
}

/**
 * 停止語音播放
 */
export function stopSpeech() {
    window.speechSynthesis.cancel();
    speechCharIndex = 0;
}

/**
 * 取得當前語音狀態
 * @returns {boolean}
 */
export function isSpeechActive() {
    return isSpeechEnabled;
}
