# 淨土 AI - 阿彌陀佛智慧對話系統

一個結合 3D 視覺效果、語音輸入、語音合成的 AI 對話系統，基於 Google Gemini API。

## 功能特色

- ✨ **沉浸式 3D 場景** - 使用 Three.js 渲染佛像與粒子效果
- 🎤 **語音輸入** - 支援語音轉文字（Web Speech API）
- 🔊 **語音朗讀** - AI 回應自動朗讀，文字與聲音同步
- 💬 **智慧對話** - 基於 Gemini 2.5 Flash，提供溫暖的對話體驗
- 🎨 **現代設計** - 玻璃擬態、呼吸燈、打字機效果
- 📱 **響應式設計** - 支援桌面與行動裝置

## 技術架構

本專案採用**模組化前端架構**（方案 B），無需後端伺服器。

### 目錄結構

```
AI chat/
├── index.html              # 主頁面
├── styles/                 # 樣式文件
│   ├── main.css           # 主要樣式
│   ├── chat.css           # 聊天區域樣式
│   └── animations.css     # 動畫效果
├── scripts/               # JavaScript 模組
│   ├── main.js           # 主入口文件
│   └── modules/
│       ├── apiClient.js  # API 客戶端
│       ├── chatUI.js     # 聊天介面
│       ├── scene3d.js    # 3D 場景
│       ├── voiceInput.js # 語音輸入
│       ├── tts.js        # 語音合成
│       └── utils.js      # 工具函數
└── assets/               # 資源文件
    └── images/
```

### 技術棧

- **核心**: HTML5, CSS3, JavaScript (ES6 Modules)
- **框架**: Tailwind CSS
- **3D 渲染**: Three.js (r128)
- **Markdown 解析**: Marked.js
- **圖示**: Lucide Icons
- **AI API**: Google Gemini 2.5 Flash

## 快速開始

### 1. 取得 API Key

前往 [Google AI Studio](https://aistudio.google.com/api-keys) 免費申請 Gemini API Key。

### 2. 開啟應用

**選項 A：直接開啟 HTML**
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**選項 B：使用本地伺服器**（推薦）
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (需安裝 http-server)
npx http-server -p 8000
```

然後開啟瀏覽器訪問 `http://localhost:8000`

### 3. 設定 API Key

首次開啟時會自動彈出設定視窗，貼上您的 Gemini API Key 即可開始使用。

## 使用指南

### 文字對話
直接在輸入框輸入文字，按 Enter 或點擊發送按鈕。

### 語音輸入
1. 點擊麥克風圖示（🎤）開始錄音
2. 對著麥克風說話
3. 再次點擊停止錄音
4. 語音會自動轉為文字填入輸入框

### 語音朗讀
1. 點擊喇叭圖示（🔊）開啟語音朗讀
2. AI 回應時會自動朗讀
3. 文字顯示速度會與語音同步

### 上傳佛像
點擊「上傳佛像」按鈕，選擇圖片文件，即可在 3D 場景中顯示。

## 瀏覽器支援

- ✅ Chrome / Edge (推薦)
- ✅ Firefox
- ✅ Safari (語音功能可能受限)

**注意**: 語音輸入需要 HTTPS 或 localhost 環境。

## 開發說明

### 模組說明

- **apiClient.js**: 處理與 Gemini API 的通訊，管理對話歷史
- **chatUI.js**: 訊息渲染、打字機效果、Markdown 解析
- **scene3d.js**: Three.js 場景初始化、佛像渲染、粒子系統
- **voiceInput.js**: Web Speech API 語音辨識
- **tts.js**: 語音合成（Text-to-Speech）
- **utils.js**: 共用工具函數

### 自訂修改

所有樣式變數位於 `styles/main.css`，可輕鬆調整色彩、字體等。

## 授權

本專案僅供學習與個人使用。

## 問題回報

如遇到問題，請檢查：
1. API Key 是否正確設定
2. 瀏覽器 Console 是否有錯誤訊息
3. 網路連線是否正常
4. 瀏覽器是否支援所需功能

---

**祝您使用愉快！阿彌陀佛 🙏**
