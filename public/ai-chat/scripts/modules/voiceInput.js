/* ===========================
   語音輸入模組 - voiceInput.js
   Speech-to-Text 語音辨識功能
   =========================== */

import { stopSpeech } from './tts.js';

let recognition = null;
let isRecording = false;

/**
 * 初始化語音輸入
 */
export function initVoiceInput() {
    // 檢查瀏覽器支援度
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.style.display = 'none';
        console.log("瀏覽器不支援語音辨識");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'cmn-Hant-TW';

    // 開始錄音
    recognition.onstart = function () {
        isRecording = true;
        // 停止 AI 正在說話的聲音，避免干擾錄音
        stopSpeech();

        const micBtn = document.getElementById('mic-btn');
        micBtn.classList.add('recording-active');
        document.getElementById('user-input').placeholder = "正在聆聽中...";
    };

    // 結束錄音
    recognition.onend = function () {
        isRecording = false;
        const micBtn = document.getElementById('mic-btn');
        micBtn.classList.remove('recording-active');
        document.getElementById('user-input').placeholder = "輸入文字或點擊麥克風說話...";
    };

    // 接收語音辨識結果
    recognition.onresult = function (event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const inputField = document.getElementById('user-input');
        if (finalTranscript) {
            inputField.value = finalTranscript;
        } else if (interimTranscript) {
            inputField.value = interimTranscript;
        }
    };

    // 錯誤處理
    recognition.onerror = function (event) {
        console.error("語音辨識錯誤:", event.error);
        isRecording = false;
        const micBtn = document.getElementById('mic-btn');
        micBtn.classList.remove('recording-active');

        if (event.error === 'not-allowed') {
            alert("請允許麥克風權限以使用語音輸入。");
        }
    };
}

/**
 * 切換語音輸入（開始/停止錄音）
 */
export function toggleVoiceInput() {
    if (!recognition) return;

    if (isRecording) {
        recognition.stop();
    } else {
        document.getElementById('user-input').value = '';
        recognition.start();
    }
}

/**
 * 取得錄音狀態
 * @returns {boolean}
 */
export function isRecordingActive() {
    return isRecording;
}
