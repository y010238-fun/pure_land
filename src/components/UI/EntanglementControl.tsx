import React, { useEffect, useState } from 'react';
import { Fingerprint, ArrowRight } from 'lucide-react';

interface Props {
    strength: number;
    onInteractStart: () => void;
    onInteractEnd: () => void;
}

export const EntanglementControl = ({ strength, onInteractStart, onInteractEnd }: Props) => {
    const [text, setText] = useState("距離：十萬億佛土");

    useEffect(() => {
        if (strength > 0.8) setText("阿彌陀佛，去此不遠");
        else if (strength > 0.3) setText("量子糾纏中...");
        else setText("距離：十萬億佛土");
    }, [strength]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="mt-48 pointer-events-auto flex flex-col items-center gap-4">

                {/* Status Text with Glitch Effect placeholder */}
                <h2 className={`text-xl font-serif tracking-widest transition-colors duration-500 ${strength > 0.8 ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    {text}
                </h2>

                <p className="text-xs text-gray-500 font-mono">
                    {strength > 0 ? `QUANTUM SYNC: ${(strength * 100).toFixed(1)}%` : "WAITING FOR SIGNAL"}
                </p>

                {/* Interaction Button */}
                <button
                    onMouseDown={onInteractStart}
                    onMouseUp={onInteractEnd}
                    onMouseLeave={onInteractEnd}
                    onTouchStart={onInteractStart}
                    onTouchEnd={onInteractEnd}
                    className="relative group w-24 h-24 flex items-center justify-center"
                >
                    {/* Progress Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="46"
                            fill="none"
                            stroke={strength > 0.8 ? "#fbbf24" : "#22d3ee"}
                            strokeWidth="2"
                            strokeDasharray="289" // 2 * PI * 46
                            strokeDashoffset={289 * (1 - strength)}
                            className="transition-all duration-75 ease-linear"
                        />
                    </svg>

                    {/* Button Content */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${strength > 0.8 ? 'bg-yellow-500 shadow-[0_0_30px_#fbbf24]' : 'bg-gray-900 border border-gray-700'}`}>
                        <Fingerprint className={`w-8 h-8 transition-colors ${strength > 0.8 ? 'text-white' : 'text-gray-500 group-hover:text-cyan-400'}`} />
                    </div>

                    {/* Pulse Effect hint */}
                    {strength === 0 && (
                        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping pointer-events-none" />
                    )}
                </button>

                <p className="text-gray-600 text-xs animate-pulse">
                    長按以摺疊時空
                </p>
            </div>
        </div>
    );
};
