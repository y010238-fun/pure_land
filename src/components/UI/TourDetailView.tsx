import { useRef, useEffect, useState } from 'react';
import { TourRegion } from '../../types';

interface TourDetailViewProps {
    region: TourRegion;
    onBack: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

const TourDetailView: React.FC<TourDetailViewProps> = ({
    region,
    onBack,
    onNext,
    onPrev,
    hasNext = false,
    hasPrev = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);

    // 影片自動播放
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                setIsPlaying(false);
            });
        }
    }, [region]);

    // 切換播放狀態
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div 
            className="relative w-full h-full flex flex-col"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* 背景影片 - 全螢幕 */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    src={region.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    autoPlay
                    onClick={togglePlay}
                />
                {/* 漸層遮罩 - 底部 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
            </div>

            {/* 返回按鈕 */}
            <div className={`
                absolute top-6 left-6 z-20
                transition-opacity duration-300
                ${showControls ? 'opacity-100' : 'opacity-0'}
            `}>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/60 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    返回導覽選單
                </button>
            </div>

            {/* 左右切換按鈕 */}
            {hasPrev && (
                <button
                    onClick={onPrev}
                    className={`
                        absolute left-6 top-1/2 -translate-y-1/2 z-20
                        w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full
                        flex items-center justify-center
                        hover:bg-black/60 transition-all
                        ${showControls ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
            
            {hasNext && (
                <button
                    onClick={onNext}
                    className={`
                        absolute right-6 top-1/2 -translate-y-1/2 z-20
                        w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full
                        flex items-center justify-center
                        hover:bg-black/60 transition-all
                        ${showControls ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* 底部內容區 */}
            <div className={`
                absolute bottom-0 left-0 right-0 z-10
                transition-transform duration-500
                ${showControls ? 'translate-y-0' : 'translate-y-full'}
            `}>
                <div className="max-w-4xl mx-auto p-8">
                    {/* 區域標題 */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 mb-2">
                            {region.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-yellow-400/80">
                            <span className="text-sm">📜 {region.source}</span>
                        </div>
                    </div>

                    {/* 經文原文 */}
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 mb-4 border border-yellow-400/20">
                        <h3 className="text-xs font-medium text-yellow-400/60 uppercase tracking-wider mb-3">
                            經文原文
                        </h3>
                        <p className="text-white/90 text-lg leading-relaxed text-center font-medium">
                            {region.scripture}
                        </p>
                    </div>

                    {/* 白話說明 */}
                    <div className="bg-emerald-900/20 backdrop-blur-md rounded-2xl p-6 border border-emerald-400/20">
                        <h3 className="text-xs font-medium text-emerald-400/60 uppercase tracking-wider mb-3">
                            白話說明
                        </h3>
                        <p className="text-white/80 leading-relaxed text-center">
                            {region.explanation}
                        </p>
                    </div>

                    {/* 播放控制 */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* 裝飾 */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-white/20">
                        <div className="w-12 h-px bg-white/20" />
                        <span className="text-xs">南無阿彌陀佛</span>
                        <div className="w-12 h-px bg-white/20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailView;
