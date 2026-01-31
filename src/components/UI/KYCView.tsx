import { useState } from 'react';
import { Fingerprint } from 'lucide-react';

interface KYCViewProps {
    onComplete: () => void;
}

export const KYCView = ({ onComplete }: KYCViewProps) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step === 0) setStep(1);
        else onComplete();
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-4">
            <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="h-1 bg-gray-800 w-full">
                    <div className={`h-full bg-yellow-500 transition-all duration-500 ${step === 0 ? 'w-1/2' : 'w-full'}`} />
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-yellow-100">靈魂資產審查 (Soul KYC)</h2>
                        <Fingerprint className="text-gray-600" />
                    </div>

                    {step === 0 ? (
                        <div className="space-y-4 animate-slide-in">
                            <p className="text-gray-400 mb-4">Q1: 您為何想要離開當前的維度？ (Motivation)</p>
                            {['厭離輪迴之苦 (Suffering of Samsara)', '尋求終極真理 (Ultimate Truth)', '與逝去親人重逢 (Reunion)'].map((opt, i) => (
                                <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded border border-gray-700 hover:border-yellow-500 hover:bg-yellow-900/20 text-gray-300 transition-colors">
                                    <span className="text-yellow-600 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-in">
                            <p className="text-gray-400 mb-4">Q2: 您攜帶何種資糧進行移民？ (Capital Assessment)</p>
                            {['持名念佛 (Chanting)', '觀想修行 (Visualization)', '僅有一顆誠心 (Sincerity)'].map((opt, i) => (
                                <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded border border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20 text-gray-300 transition-colors">
                                    <span className="text-cyan-600 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
