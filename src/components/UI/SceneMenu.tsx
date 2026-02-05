import { useState } from 'react';
import { Sparkles, MapPin, Trophy, MessageCircleHeart } from 'lucide-react';
import { FallingPetals } from '../Effects/FallingPetals';

interface SceneMenuProps {
    onSelectScene: (scene: 'POOL' | 'TOUR' | 'LEADERBOARD' | 'CHAT') => void;
}

const menuItems = [
    {
        id: 'POOL' as const,
        icon: Sparkles,
        title: '個人蓮池',
        description: '進入您的專屬修行空間',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'TOUR' as const,
        icon: MapPin,
        title: '西方極樂世界導覽',
        description: '探索極樂世界的各個殊勝區域',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        id: 'LEADERBOARD' as const,
        icon: Trophy,
        title: '功德排行榜',
        description: '查看修行者的功德成就',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        id: 'CHAT' as const,
        icon: MessageCircleHeart,
        title: '與阿彌陀佛談心',
        description: '開啟心靈對話，獲得智慧指引',
        gradient: 'from-rose-500 to-red-500',
    },
];

export const SceneMenu = ({ onSelectScene }: SceneMenuProps) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-8">
            {/* 背景圖片 */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/西方極樂世界圖.jpeg')" }}
            />
            {/* 暗色遮罩增加可讀性 */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 花瓣飄落動畫 */}
            <FallingPetals visible={true} />

            {/* 主要內容 */}
            <div className="relative max-w-6xl w-full">
                {/* 標題 */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif tracking-[0.2em] 
                               bg-[length:200%_auto] bg-gradient-to-r from-[#B8860B] via-[#FFFACD] to-[#B8860B] 
                               bg-clip-text text-transparent
                               filter drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]
                               animate-title-combined select-none">
                        西方極樂世界
                    </h1>
                    <p className="text-xl text-white/70">
                        請選擇您想前往的殊勝之處
                    </p>
                </div>

                {/* 選單網格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isHovered = hoveredId === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelectScene(item.id)}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm
                           border border-white/10 hover:border-white/30
                           transition-all duration-500 hover:scale-105
                           hover:shadow-2xl hover:shadow-white/20"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                {/* 漸層背景 */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} 
                                opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* 內容 */}
                                <div className="relative flex items-start gap-6">
                                    {/* 圖示 */}
                                    <div className={`p-4 rounded-xl bg-gradient-to-br ${item.gradient}
                                  transform transition-transform duration-500
                                  ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}`}>
                                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>

                                    {/* 文字 */}
                                    <div className="flex-1 text-left">
                                        <h3 className="text-2xl font-semibold text-white mb-2 
                                   group-hover:text-transparent group-hover:bg-clip-text 
                                   group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70
                                   transition-all duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* 箭頭 */}
                                    <div className={`text-white/40 group-hover:text-white transition-all duration-300
                                  ${isHovered ? 'translate-x-2' : 'translate-x-0'}`}>
                                        →
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes title-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(255, 215, 0, 0.7));
          }
        }

        .animate-title-combined {
          animation: shimmer 8s linear infinite, title-glow 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
      `}</style>
        </div>
    );
};
