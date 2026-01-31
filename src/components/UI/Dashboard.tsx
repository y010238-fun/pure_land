import { MessageCircle, CreditCard, Activity } from 'lucide-react';

interface DashboardProps {
    merit: number;
    setMerit: (val: number) => void;
    onChant: () => void;
    onToggleChat: () => void;
}

export const Dashboard = ({ merit, setMerit, onChant, onToggleChat }: DashboardProps) => (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        <div className="flex justify-between items-start pointer-events-auto">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-lg border border-gray-700 flex items-center justify-center text-yellow-500">
                    <Activity size={20} />
                </div>
                <div>
                    <h1 className="text-white font-serif text-lg leading-none">個人蓮池</h1>
                    <span className="text-xs text-gray-400">My Lotus Pool</span>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-gray-700 text-gray-300 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    NET: Synced
                </div>
            </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
            <div className="text-6xl md:text-8xl font-serif text-white/10 font-bold tracking-tighter">
                {merit}
            </div>
        </div>

        <div className="flex justify-between items-end pointer-events-auto w-full md:max-w-4xl mx-auto">
            <button
                onClick={onToggleChat}
                className="flex items-center gap-2 bg-gray-900/80 backdrop-blur px-4 py-3 rounded-full border border-gray-700 text-cyan-400 hover:bg-gray-800 transition-colors"
            >
                <MessageCircle size={20} />
                <span className="text-sm hidden md:inline">呼叫諸上善人 (Bodhi AI)</span>
            </button>

            <button
                onMouseDown={onChant}
                onTouchStart={onChant}
                className="relative group transform transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/40 transition-all duration-500" />
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-gray-800 to-black rounded-full border-4 border-yellow-600/50 flex flex-col items-center justify-center shadow-2xl relative z-10 group-hover:border-yellow-500 transition-colors">
                    <span className="text-2xl md:text-3xl text-yellow-100 font-serif mb-1 group-active:text-white">念佛</span>
                    <span className="text-[10px] text-yellow-600/80 tracking-widest uppercase">Chant</span>
                </div>
                <div className="absolute -inset-4 border border-yellow-500/10 rounded-full animate-ping opacity-20" />
            </button>

            <div className="flex flex-col gap-2 items-end">
                <div className="bg-gray-900/80 backdrop-blur p-3 rounded-lg border border-gray-700 w-32">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">Total Merit</div>
                    <input
                        type="number"
                        value={merit}
                        onChange={(e) => setMerit(parseInt(e.target.value) || 0)}
                        className="bg-transparent border-none text-xl text-white font-mono w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                <button className="p-3 bg-gray-900/80 backdrop-blur rounded-full border border-gray-700 text-gray-400 hover:text-white">
                    <CreditCard size={20} />
                </button>
            </div>
        </div>
    </div>
);
