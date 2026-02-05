import { useState, useEffect } from 'react';

interface TypewriterPoemProps {
    poem: string;
    delay?: number;
}

export const TypewriterPoem = ({ poem, delay = 150 }: TypewriterPoemProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < poem.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + poem[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, poem]);

    // 將詩句按標點符號分割成行
    const lines = poem.split(/[，；]/);
    const displayedLines = displayedText.split(/[，；]/);

    return (
        <div className="flex gap-6 items-center">
            {lines.map((_, lineIndex) => (
                <div
                    key={lineIndex}
                    className="poem-line"
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright'
                    }}
                >
                    {displayedLines[lineIndex]?.split('').map((char, charIndex) => (
                        <span
                            key={charIndex}
                            className="inline-block font-serif text-4xl md:text-5xl font-bold
                                       bg-gradient-to-b from-[#FFF9E6] via-[#FFD700] to-[#DAA520]
                                       bg-clip-text text-transparent
                                       animate-glow-breath"
                            style={{
                                animationDelay: `${(lineIndex * 4 + charIndex) * 0.1}s`
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            ))}

            <style>{`
                @keyframes glow-breath {
                    0%, 100% {
                        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
                        opacity: 0.85;
                    }
                    50% {
                        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
                        opacity: 1;
                    }
                }
                
                .animate-glow-breath {
                    animation: glow-breath 4s ease-in-out infinite;
                }
                
                .poem-line {
                    letter-spacing: 0.5em;
                }
            `}</style>
        </div>
    );
};
