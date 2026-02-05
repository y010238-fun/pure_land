import React, { useEffect, useState } from 'react';
import { Fingerprint, ArrowRight } from 'lucide-react';

interface Props {
    strength: number;
    onInteractStart: () => void;
    onInteractEnd: () => void;
}

export const EntanglementControl = ({ strength, onInteractStart, onInteractEnd }: Props) => {
    const [text, setText] = useState("距離：十萬億佛土");
    const fullScripture = "從是西方，過十萬億佛土，有世界名曰極樂";
    const [displayedScripture, setDisplayedScripture] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplayedScripture(""); // Reset
        const timer = setInterval(() => {
            setDisplayedScripture(fullScripture.slice(0, i + 1));
            i++;
            if (i >= fullScripture.length) clearInterval(timer);
        }, 120);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (strength > 0.8) setText("阿彌陀佛，去此不遠");
        else if (strength > 0.3) setText("量子糾纏中...");
        else setText("距離：十萬億佛土");
    }, [strength]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="mt-48 pointer-events-auto flex flex-col items-center gap-6">

                {/* 頂部經文 - 打字機模式 */}
                <div className="text-center min-h-[2.5rem] flex items-center justify-center">
                    <h1 className="text-base md:text-lg font-serif text-transparent bg-clip-text 
                                 bg-gradient-to-r from-[#FFF9E6] via-[#FFD700] to-[#FFF9E6] 
                                 tracking-[0.25em] font-bold drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]
                                 animate-shine select-none whitespace-nowrap">
                        {displayedScripture}
                    </h1>
                </div>

                {/* Status Text with Glitch Effect placeholder */}
                <h2 className={`text-lg font-serif tracking-widest transition-colors duration-500 ${strength > 0.8 ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    {text}
                </h2>

                <p className="text-xs text-gray-500 font-mono mt-4">
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

            <style>{`
                @keyframes shine {
                    0% { background-position: -200% center; filter: drop-shadow(0 0 10px rgba(255,215,0,0.3)); }
                    50% { filter: drop-shadow(0 0 20px rgba(255,215,0,0.6)); }
                    100% { background-position: 200% center; filter: drop-shadow(0 0 10px rgba(255,215,0,0.3)); }
                }
                .animate-shine {
                    background-size: 200% auto;
                    animation: shine 8s linear infinite;
                }
            `}</style>
        </div>
    );
};
