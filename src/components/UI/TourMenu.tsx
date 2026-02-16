import { useRef, useState, useEffect } from 'react';
import { TourRegion } from '../../types';

interface TourMenuProps {
    regions: TourRegion[];
    selectedRegion: TourRegion;
    onSelectRegion: (region: TourRegion) => void;
    onEnterRegion: (region: TourRegion) => void;
    onHoverRegion?: (region: TourRegion | null) => void; // 新增：懸停回調
}

const TourMenu: React.FC<TourMenuProps> = ({
    regions,
    selectedRegion,
    onSelectRegion,
    onEnterRegion,
    onHoverRegion,
}) => {
    const [hoveredRegion, setHoveredRegion] = useState<TourRegion | null>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    // 處理懸停狀態變化，通知父組件
    useEffect(() => {
        if (onHoverRegion) {
            onHoverRegion(hoveredRegion);
        }
    }, [hoveredRegion, onHoverRegion]);

    // 處理影片預覽播放
    useEffect(() => {
        const currentRegion = hoveredRegion || selectedRegion;
        
        // 暫停所有影片
        Object.values(videoRefs.current).forEach((video) => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // 播放當前選中的影片
        const currentVideo = videoRefs.current[currentRegion.id];
        if (currentVideo) {
            currentVideo.play().catch(() => {
                // 影片載入失敗時靜默處理
            });
        }
    }, [hoveredRegion, selectedRegion]);

    return (
        <div className="flex-1 flex flex-col">
            {/* 區域選擇卡片網格 */}
            <div className="grid grid-cols-5 gap-3">
                {regions.map((region, index) => {
                    const isHovered = hoveredRegion?.id === region.id;
                    const isSelected = selectedRegion.id === region.id;
                    
                    return (
                        <div
                            key={region.id}
                            className={`
                                relative overflow-hidden rounded-xl cursor-pointer
                                transition-all duration-300 ease-out
                                ${isSelected && !hoveredRegion ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : ''}
                                ${isHovered ? 'ring-2 ring-yellow-400 shadow-xl scale-105' : 'scale-100'}
                            `}
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards',
                            }}
                            onMouseEnter={() => setHoveredRegion(region)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            onClick={() => {
                                onSelectRegion(region);
                                onEnterRegion(region);
                            }}
                        >
                            {/* 影片背景 */}
                            <div className="absolute inset-0">
                                <video
                                    ref={(el) => { videoRefs.current[region.id] = el; }}
                                    src={region.videoUrl}
                                    className="w-full h-full object-cover"
                                    loop
                                    muted
                                    playsInline
                                />
                                {/* 漸層遮罩 */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                                    transition-opacity duration-300
                                    ${isHovered ? 'opacity-70' : 'opacity-90'}
                                `} />
                            </div>

                            {/* 卡片內容 */}
                            <div className="relative p-4 h-full flex flex-col justify-end min-h-[120px]">
                                {/* 區域標題 */}
                                <h3 className={`
                                    text-lg font-bold text-white mb-1
                                    transition-transform duration-300
                                    ${isHovered ? 'translate-y-0' : 'translate-y-0'}
                                `}>
                                    {region.title}
                                </h3>
                                
                                {/* 經典出處 */}
                                <p className={`
                                    text-xs text-yellow-300/80
                                    transition-all duration-300
                                    ${isHovered ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'}
                                `}>
                                    {region.source}
                                </p>

                                {/* 進入按鈕 (懸停顯示) */}
                                <div className={`
                                    absolute inset-0 flex items-center justify-center
                                    transition-opacity duration-300
                                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                                `}>
                                    <div className="bg-yellow-500/90 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-yellow-400 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        進入導覽
                                    </div>
                                </div>
                            </div>

                            {/* 選中標記 */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TourMenu;
