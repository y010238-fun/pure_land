import { useState } from 'react';
import { TourRegion } from '../../types';
import { TOUR_REGIONS } from '../../utils/constants';
import TourMenu from '../UI/TourMenu';
import TourPreview from '../UI/TourPreview';
import TourDetailView from '../UI/TourDetailView';
import { FallingPetals } from '../Effects/FallingPetals';

interface TourSceneProps {
    onBack?: () => void;
    initialRegion?: TourRegion;
}

type TourViewMode = 'menu' | 'detail';

export const TourScene = ({ onBack, initialRegion }: TourSceneProps) => {
    const [viewMode, setViewMode] = useState<TourViewMode>('menu');
    const [selectedRegion, setSelectedRegion] = useState<TourRegion>(
        initialRegion || TOUR_REGIONS[0]
    );
    const [hoveredRegion, setHoveredRegion] = useState<TourRegion | null>(null);

    // 預覽區顯示的區域（懸停優先，否則顯示選中區域）
    const previewRegion = hoveredRegion || selectedRegion;

    // 進入詳細導覽頁面
    const handleEnterRegion = (region: TourRegion) => {
        setSelectedRegion(region);
        setViewMode('detail');
    };

    // 返回導覽選單
    const handleBackToMenu = () => {
        setViewMode('menu');
    };

    // 切換到下一個區域
    const handleNextRegion = () => {
        const currentIndex = TOUR_REGIONS.findIndex(r => r.id === selectedRegion.id);
        const nextIndex = (currentIndex + 1) % TOUR_REGIONS.length;
        setSelectedRegion(TOUR_REGIONS[nextIndex]);
    };

    // 切換到上一個區域
    const handlePrevRegion = () => {
        const currentIndex = TOUR_REGIONS.findIndex(r => r.id === selectedRegion.id);
        const prevIndex = (currentIndex - 1 + TOUR_REGIONS.length) % TOUR_REGIONS.length;
        setSelectedRegion(TOUR_REGIONS[prevIndex]);
    };

    const currentIndex = TOUR_REGIONS.findIndex(r => r.id === selectedRegion.id);
    const hasNext = currentIndex < TOUR_REGIONS.length - 1;
    const hasPrev = currentIndex > 0;

    return (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden">
            {/* 花瓣飄落效果 */}
            <FallingPetals />

            {/* 選單模式 */}
            {viewMode === 'menu' && (
                <div className="h-full flex flex-col p-6">
                    {/* 返回按鈕 */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="fixed top-6 left-6 z-50 px-4 py-2 
                                       bg-white/10 backdrop-blur-md text-white rounded-full
                                       border border-white/20 hover:bg-white/20 
                                       transition-all duration-300 flex items-center gap-2"
                        >
                            <span className="text-lg">←</span>
                            <span>返回選單</span>
                        </button>
                    )}

                    {/* 標題 */}
                    <div className="text-center mb-6 pt-2">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 mb-2"
                            style={{
                                textShadow: '0 0 30px rgba(255, 200, 100, 0.3)',
                            }}>
                            🏠 極樂世界帝寶級賞屋
                        </h1>
                        <p className="text-white/60 text-sm">
                            九大頂級設施 · 永久免費入住
                        </p>
                    </div>

                    {/* 上方：預覽區 */}
                    <div className="flex-1 mb-6 min-h-[300px]">
                        <TourPreview region={previewRegion} />
                    </div>

                    {/* 下方：區域選擇卡片 */}
                    <div className="flex-shrink-0 pb-4">
                        <TourMenu
                            regions={TOUR_REGIONS}
                            selectedRegion={selectedRegion}
                            onSelectRegion={setSelectedRegion}
                            onEnterRegion={handleEnterRegion}
                            onHoverRegion={setHoveredRegion}
                        />
                    </div>

                    {/* 進入導覽按鈕 */}
                    <div className="text-center mt-4">
                        <button
                            onClick={() => handleEnterRegion(selectedRegion)}
                            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 mx-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            進入此區域導覽
                        </button>
                    </div>
                </div>
            )}

            {/* 詳細導覽模式 */}
            {viewMode === 'detail' && (
                <TourDetailView
                    region={selectedRegion}
                    onBack={handleBackToMenu}
                    onNext={hasNext ? handleNextRegion : undefined}
                    onPrev={hasPrev ? handlePrevRegion : undefined}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                />
            )}
        </div>
    );
};
