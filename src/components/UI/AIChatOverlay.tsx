import { Sparkles as SparkleIcon, ArrowRight } from 'lucide-react';

interface AIChatOverlayProps {
    visible: boolean;
    onClose: () => void;
}

export const AIChatOverlay = ({ visible, onClose }: AIChatOverlayProps) => {
    if (!visible) return null;

    return (
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-[#0f0f10]/95 backdrop-blur-xl border-l border-gray-800 z-50 p-6 flex flex-col animate-slide-in-right">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                        <SparkleIcon size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-serif">Bodhi (菩提)</h3>
                        <p className="text-xs text-cyan-500">AI Dharma Guide</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-gray-800">
                <div className="flex gap-3">
                    <div className="bg-gray-800 p-3 rounded-tr-lg rounded-b-lg text-gray-300">
                        道友，阿彌陀佛。我是您的淨土引路人 Bodhi。<br />
                        檢測到您的心識波動略顯雜亂，是否因為娑婆世界的瑣事煩擾？
                    </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 p-3 rounded-tl-lg rounded-b-lg text-cyan-100">
                        是的，最近工作壓力很大，覺得很迷茫。
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-gray-800 p-3 rounded-tr-lg rounded-b-lg text-gray-300">
                        <span className="text-yellow-500 block mb-1 text-xs">引用：佛說阿彌陀經</span>
                        經云：「其國眾生，無有眾苦，但受諸樂。」<br /><br />
                        這份壓力，正是推動您厭離娑婆、欣求極樂的動力。不妨試著將這份焦慮視為蓮花生長的養分。每當您感到壓力，就輕點「念佛」按鈕，將心安住在名號上。
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="輸入您的困惑..."
                        className="w-full bg-black border border-gray-700 rounded-full py-3 px-4 text-white focus:outline-none focus:border-cyan-500 text-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-900 rounded-full text-cyan-400">
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
