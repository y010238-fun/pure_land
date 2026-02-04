import { useEffect, useRef, useState } from 'react';

interface ParadiseVideoPlayerProps {
  onComplete: () => void;
}

export const ParadiseVideoPlayer = ({ onComplete }: ParadiseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 允許在播放 3 秒後跳過
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => clearTimeout(skipTimer);
  }, []);

  const handleVideoEnd = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    if (canSkip) {
      handleVideoEnd();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 影片播放器 */}
      <video
        ref={videoRef}
        src="/videos/西方極樂世界.mp4"
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      />

      {/* 跳過按鈕 */}
      {canSkip && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 
                     backdrop-blur-md rounded-full text-white font-medium
                     transition-all duration-300 hover:scale-105
                     border border-white/30 shadow-lg"
        >
          跳過 →
        </button>
      )}

      {/* 載入提示 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        正在進入西方極樂世界...
      </div>
    </div>
  );
};
