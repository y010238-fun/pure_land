import { useRef, useEffect } from 'react';
import { TourRegion } from '../../types';

interface TourPreviewProps {
    region: TourRegion;
}

const TourPreview: React.FC<TourPreviewProps> = ({ region }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // 影片自動播放
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // 影片載入失敗時靜默處理
            });
        }
    }, [region]);

    return (
        <div className="flex gap-6 h-full">
            {/* 左側：影片預覽區 */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/30">
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
                        {region.source}
                    </p>
                </div>

                {/* 播放指示器 */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">預覽播放中</span>
                </div>
            </div>

            {/* 右側：經文說明區 */}
            <div className="w-[380px] flex flex-col bg-gradient-to-b from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 overflow-y-auto">
                {/* 區域標題 */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">🏛️</span>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                            {region.title}
                        </h2>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-yellow-400/50 to-transparent" />
                </div>

                {/* 經典出處 */}
                <div className="mb-4">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full">
                        📜 {region.source}
                    </span>
                </div>

                {/* 經文原文 */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-yellow-400/80 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        經文原文
                    </h4>
                    <div className="bg-black/20 rounded-xl p-4 border border-yellow-400/20">
                        <p className="text-white/90 leading-relaxed text-sm font-medium italic">
                            {region.scripture}
                        </p>
                    </div>
                </div>

                {/* 白話說明 */}
                <div>
                    <h4 className="text-sm font-medium text-emerald-400/80 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        白話說明
                    </h4>
                    <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-400/20">
                        <p className="text-white/80 leading-relaxed text-sm">
                            {region.explanation}
                        </p>
                    </div>
                </div>

                {/* 裝飾性分隔線 */}
                <div className="mt-auto pt-4">
                    <div className="flex items-center justify-center gap-2 text-white/30">
                        <div className="w-8 h-px bg-white/20" />
                        <span className="text-xs">南無阿彌陀佛</span>
                        <div className="w-8 h-px bg-white/20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourPreview;
