/**
 * WebGL 可用性檢測工具
 */
export const detectWebGL = (): boolean => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch (e) {
        return false;
    }
};

/**
 * 獲取 WebGL 錯誤資訊
 */
export const getWebGLErrorMessage = (): string => {
    if (!detectWebGL()) {
        return 'WebGL 不可用。請檢查瀏覽器設定或嘗試使用其他瀏覽器。';
    }
    return '';
};
