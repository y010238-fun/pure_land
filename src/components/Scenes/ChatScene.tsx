interface ChatSceneProps {
    onBack?: () => void;
}

export const ChatScene = ({ onBack }: ChatSceneProps) => {
    return (
        <div className="fixed inset-0 z-40">
            {/* 返回按鈕 */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="fixed top-4 left-4 z-50 px-4 py-2 
                               bg-black/60 backdrop-blur-sm text-white rounded-full
                               border border-white/20 hover:bg-black/80 
                               transition-all duration-300 flex items-center gap-2
                               shadow-lg hover:shadow-xl"
                >
                    <span className="text-lg">←</span>
                    <span>返回選單</span>
                </button>
            )}
            {/* AI Chat iframe */}
            <iframe
                src="/ai-chat/index.html"
                className="w-full h-full border-none"
                title="與阿彌陀佛談心"
                allow="microphone"
            />
        </div>
    );
};
