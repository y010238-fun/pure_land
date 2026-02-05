/* ===========================
   API 客戶端模組 - apiClient.js
   處理 Gemini API 呼叫
   =========================== */

// 系統 Prompt
const SYSTEM_PROMPT = `
你現在是【阿彌陀佛】（Amitabha Buddha），西方極樂世界的教主。

你的核心特質：
1. **簡潔有力**：回答要簡短有力，**不要過度延伸**。使用者問什麼就答什麼，頂多 2-3 句話回應。像一位慈祥的老爺爺說話一樣，一針見血但溫暖。
2. **親切白話**：請用**現代台灣繁體中文口語**，像一位慈祥的老爺爺、或是一位非常有智慧的心理諮商師，用最平易近人的方式跟使用者聊天。
3. **慈悲溫暖**：你的語氣要充滿包容、溫暖與愛。無論使用者有什麼煩惱，都先同理他的感受，不要急著說教。
4. **自稱**：請自稱「我」即可，不必用「吾」或「本座」，拉近與人的距離。
5. **正向引導**：給予使用者希望和力量。

**重要規則**：
- 使用者打招呼 → 簡單回應招呼即可，不要長篇大論
- 簡短問題 → 給出精準答案，不要延伸
- 複雜問題 → 先給核心答案，再視情況補充

如果使用者問及技術問題，請幽默地帶過，例如：「這些科技就像神通一樣神奇，不過我們今天先聊聊你的心事吧。」
`;

// 對話歷史
let chatHistory = [];

/**
 * 呼叫 Gemini API（帶重試機制）
 * @param {string} prompt - 使用者輸入
 * @param {number} retries - 重試次數
 * @returns {Promise<string>} AI 回應
 */
export async function callGeminiAPI(prompt, retries = 2) {
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        throw new Error('未設定 API Key');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // 建構歷史對話上下文
    const contents = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // 加入最新訊息
    contents.push({
        role: 'user',
        parts: [{ text: prompt }]
    });

    const payload = {
        contents: contents,
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // 429 Rate Limit - 使用指數退避重試
        if (response.status === 429 && retries > 0) {
            const waitTime = Math.pow(2, 3 - retries) * 2000; // 2s, 4s
            console.log(`API 配額限制，等待 ${waitTime/1000} 秒後重試...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return callGeminiAPI(prompt, retries - 1);
        }

        if (!response.ok) {
            throw new Error(`API 錯誤: ${response.status}`);
        }

        const data = await response.json();

        // 安全檢查
        if (!data.candidates || data.candidates.length === 0) {
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                return "（阿彌陀佛微笑不語，此話題或許過於敏感，我們換個話題聊聊吧。）";
            }
            throw new Error("API 未回傳有效內容，請稍後再試。");
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("回應格式異常，無法讀取文字。");
        }

        // 更新歷史紀錄（保持最近 10 則以免 token 過多）
        chatHistory.push({ role: 'user', content: prompt });
        chatHistory.push({ role: 'ai', content: text });
        if (chatHistory.length > 10) {
            chatHistory = chatHistory.slice(-10);
        }

        return text;

    } catch (error) {
        // 重試次數用盡，拋出錯誤
        if (retries <= 0) {
            throw error;
        }
        // 其他錯誤也重試
        console.log(`API 錯誤，等待 2 秒後重試...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return callGeminiAPI(prompt, retries - 1);
    }
}

/**
 * 儲存 API Key
 * @param {string} key - API Key
 */
export function saveApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
}

/**
 * 取得 API Key
 * @returns {string|null}
 */
export function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

/**
 * 清除對話歷史
 */
export function clearChatHistory() {
    chatHistory = [];
}
