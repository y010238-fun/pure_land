import { Globe, Check } from 'lucide-react';

interface VisaModalProps {
    onClose: () => void;
}

export const VisaModal = ({ onClose }: VisaModalProps) => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-fade-in">
        <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg border border-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="text-center mb-6">
                <div className="inline-block border-2 border-yellow-600 rounded-full p-2 mb-2">
                    <Globe className="text-yellow-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-yellow-100">淨土通行證</h3>
                <p className="text-xs text-yellow-600/80 uppercase tracking-widest">Pure Land Visa • Class A</p>
            </div>

            <div className="space-y-3 font-mono text-sm text-gray-300 border-t border-b border-gray-800 py-4 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-500">Holder Name</span>
                    <span className="text-white">妙音 (AI Generated)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Origin</span>
                    <span>Saha World (Earth)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Destination</span>
                    <span className="text-yellow-400">Western Pure Land</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">UID</span>
                    <span className="text-xs">{crypto.randomUUID().slice(0, 18)}...</span>
                </div>
            </div>

            <div className="bg-gray-900 p-4 rounded italic text-gray-400 text-sm mb-6 border-l-2 border-yellow-600">
                "願我臨終無障礙，阿彌陀佛遠相迎。觀音甘露灑吾頭，勢至金台安我足。"
            </div>

            <button
                onClick={onClose}
                className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-serif rounded transition-colors flex items-center justify-center gap-2"
            >
                <Check size={16} /> 簽署並進入蓮池
            </button>
        </div>
    </div>
);
