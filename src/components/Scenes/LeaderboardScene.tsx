interface LeaderboardSceneProps {
    onBack?: () => void;
}

export const LeaderboardScene = ({ onBack }: LeaderboardSceneProps) => {
    return (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-amber-900 via-orange-900 to-black 
                    flex items-center justify-center">
            {onBack && (
                <button
                    onClick={onBack}
                    className="fixed top-8 left-8 z-50 px-4 py-2 
                               bg-white/10 backdrop-blur-md text-white rounded-full
                               border border-white/20 hover:bg-white/20 
                               transition-all duration-300 flex items-center gap-2"
                >
                    <span className="text-lg">←</span>
                    <span>返回選單</span>
                </button>
            )}
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    功德排行榜
                </h1>
                <p className="text-xl text-white/70 mb-8">
                    此功能開發中...
                </p>
                <div className="text-6xl animate-bounce">🏆</div>
            </div>
        </div>
    );
};
