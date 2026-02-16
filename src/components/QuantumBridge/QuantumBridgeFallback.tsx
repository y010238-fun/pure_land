import { useState, useEffect } from 'react';
import './QuantumBridgeFallback.css';

interface QuantumBridgeFallbackProps {
    onComplete: () => void;
}

/**
 * 量子橋接場景的 CSS 降級版本
 * 當 WebGL 不可用時使用此版本
 */
export const QuantumBridgeFallback = ({ onComplete }: QuantumBridgeFallbackProps) => {
    const [strength, setStrength] = useState(0);
    const [isPressing, setIsPressing] = useState(false);
    const [isResonating, setIsResonating] = useState(false);

    // 長按增加能量
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPressing) {
            interval = setInterval(() => {
                setStrength(prev => {
                    const newValue = prev + 0.005;
                    if (newValue >= 1) {
                        clearInterval(interval);
                        return 1;
                    }
                    return newValue;
                });
            }, 16);
        } else {
            // 能量衰減
            interval = setInterval(() => {
                setStrength(prev => Math.max(0, prev - 0.01));
            }, 16);
        }
        return () => clearInterval(interval);
    }, [isPressing]);

    // 當能量達到 100% 時啟動共振
    useEffect(() => {
        if (strength >= 1 && !isResonating) {
            setIsResonating(true);
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    }, [strength, isResonating, onComplete]);

    return (
        <div className="quantum-bridge-fallback">
            {/* 星空背景 */}
            <div className="stars-background">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.8 + 0.2,
                        }}
                    />
                ))}
            </div>

            {/* 娑婆世界 (左側星球) */}
            <div
                className="world saha-world"
                style={{
                    transform: `translateX(${strength * 200}px) scale(${1 + strength * 0.2})`,
                }}
            >
                <div className="planet saha-planet">
                    <div className="planet-surface" />
                    <div className="planet-glow saha-glow" />
                </div>
                <div className="world-label">娑婆世界</div>
            </div>

            {/* 極樂世界 (右側星球) */}
            <div
                className="world pure-land-world"
                style={{
                    transform: `translateX(${-strength * 200}px) scale(${1 + strength * 0.2})`,
                }}
            >
                <div className="planet pure-land-planet">
                    <div className="planet-surface" />
                    <div className="planet-glow pure-land-glow" />
                </div>
                <div className="world-label">極樂世界</div>
            </div>

            {/* 量子糾纏粒子 */}
            {strength > 0 && (
                <div className="entanglement-particles">
                    {Array.from({ length: Math.floor(strength * 20) }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                opacity: strength,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* 共振效果 */}
            {isResonating && (
                <div className="resonance-effect">
                    <div className="resonance-wave" />
                    <div className="resonance-wave" style={{ animationDelay: '0.3s' }} />
                    <div className="resonance-wave" style={{ animationDelay: '0.6s' }} />
                </div>
            )}

            {/* UI 控制面板 */}
            <div className="control-panel">
                <div className="title-section">
                    <h1 className="main-title">從是西方,過十萬億佛土,有世界名曰極樂</h1>
                    <p className="distance-text">距離:十萬億佛土</p>
                </div>

                <div className="status-section">
                    <div className="status-label">
                        {strength < 1 ? 'WAITING FOR SIGNAL' : 'RESONATING...'}
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-label">時空摺疊進度</div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${strength * 100}%` }}
                        />
                    </div>
                    <div className="progress-percentage">{Math.floor(strength * 100)}%</div>
                </div>

                <button
                    className="fold-button"
                    onMouseDown={() => setIsPressing(true)}
                    onMouseUp={() => setIsPressing(false)}
                    onMouseLeave={() => setIsPressing(false)}
                    onTouchStart={() => setIsPressing(true)}
                    onTouchEnd={() => setIsPressing(false)}
                    disabled={isResonating}
                >
                    <span className="button-text">長按以摺疊時空</span>
                    <div className="button-glow" />
                </button>

                <div className="instruction-text">
                    長按按鈕以產生量子糾纏,摺疊時空距離
                </div>
            </div>

            {/* WebGL 不可用提示 */}
            <div className="webgl-warning">
                <span className="warning-icon">⚠️</span>
                <span>WebGL 不可用,使用簡化版本</span>
            </div>
        </div>
    );
};
