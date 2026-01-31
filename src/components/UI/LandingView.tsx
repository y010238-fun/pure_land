import { Globe, ArrowRight } from 'lucide-react';

interface LandingViewProps {
    onStart: () => void;
}

export const LandingView = ({ onStart }: LandingViewProps) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 backdrop-blur-sm animate-fade-in">
        <div className="w-24 h-24 mb-6 rounded-full border-2 border-yellow-500/50 flex items-center justify-center animate-pulse">
            <Globe className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 mb-4">
            淨土移民局
        </h1>
        <p className="text-sm text-gray-400 tracking-[0.5em] uppercase mb-12">Pure Land Immigration System</p>

        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 max-w-md text-center shadow-2xl shadow-yellow-900/20">
            <p className="text-cyan-400 text-sm mb-2 font-mono">系統訊息 &gt;&gt; 檢測到靈魂頻率波動...</p>
            <p className="text-gray-300 mb-8 font-light leading-relaxed">
                您正處於三維娑婆世界邊界。是否申請前往高維度淨土（Teraverse）？
                這是一趟不可逆的意識昇華旅程。
            </p>
            <button
                onClick={onStart}
                className="group relative px-8 py-3 bg-gradient-to-r from-yellow-700 to-yellow-600 rounded-full text-white font-serif tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
                <span className="relative z-10 flex items-center gap-2">
                    開始移民申請 <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
        </div>
    </div>
);
