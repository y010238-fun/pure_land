import { useRef, useEffect, useState } from 'react';
import { TourRegion } from '../../types';

interface TourPreviewProps {
    region: TourRegion;
}

const TourPreview: React.FC<TourPreviewProps> = ({ region }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // 打字機效果
    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        
        const text = region.explanation;
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(typeInterval);
            }
        }, 40); // 每 40ms 打一個字

        return () => clearInterval(typeInterval);
    }, [region]);

    // 影片自動播放
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // 影片載入失敗時靜默處理
            });
        }
    }, [region]);

    return (
        <div className="flex gap-4 h-full">
            {/* 左側：影片預覽區 */}
            <div className="w-[55%] relative rounded-2xl overflow-hidden bg-black/30 flex-shrink-0">
                <video
                    ref={videoRef}
                    src={region.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    autoPlay
                />
                
                {/* 影片上的標題疊加 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-1">
                        {region.title}
                    </h3>
                    <p className="text-sm text-yellow-300/90">
                        📜 {region.source}
                    </p>
                </div>

                {/* 播放指示器 */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">預覽播放中</span>
                </div>
            </div>

            {/* 右側：打字機賞屋亮點介紹 */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-900/30 to-indigo-900/30 rounded-2xl p-5 overflow-hidden">
                {/* 區域標題 */}
                <div className="mb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🏠</span>
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                            {region.title}
                        </h2>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-yellow-400/50 to-transparent" />
                </div>

                {/* 賞屋亮點標籤 */}
                <div className="mb-3 flex-shrink-0">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-sm px-3 py-1 rounded-full font-medium">
                        ✨ 賞屋亮點介紹
                    </span>
                </div>

                {/* 打字機文字區域 */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="bg-black/20 rounded-xl p-4 border border-yellow-400/20">
                        <p className="text-white/90 leading-relaxed text-base whitespace-pre-wrap">
                            {displayedText}
                            {/* 打字游標 */}
                            {isTyping && (
                                <span className="inline-block w-0.5 h-4 bg-yellow-400 ml-0.5 animate-blink" />
                            )}
                        </p>
                    </div>
                </div>

                {/* 經文原文（摺疊顯示） */}
                <div className="mt-3 pt-3 border-t border-white/10 flex-shrink-0">
                    <details className="group">
                        <summary className="cursor-pointer text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            查看經文原文
                        </summary>
                        <div className="mt-2 bg-black/20 rounded-lg p-2 text-white/60 text-xs leading-relaxed italic max-h-24 overflow-y-auto">
                            {region.scripture}
                        </div>
                    </details>
                </div>

                {/* 裝飾性分隔線 */}
                <div className="mt-2 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 text-white/30">
                        <div className="w-6 h-px bg-white/20" />
                        <span className="text-xs">南無阿彌陀佛</span>
                        <div className="w-6 h-px bg-white/20" />
                    </div>
                </div>
            </div>

            {/* 打字游標動畫樣式 */}
            <style>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 0.8s infinite;
                }
            `}</style>
        </div>
    );
};

export default TourPreview;
