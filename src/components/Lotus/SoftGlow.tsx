import React, { useEffect, useRef } from 'react';

interface SoftGlowProps {
  visible: boolean;
  intensity?: number;
}

export const SoftGlow: React.FC<SoftGlowProps> = ({ visible, intensity = 0.5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !visible) return;

    const importP5 = async () => {
      const p5 = (await import('p5')).default;

      const sketch = (p: any) => {
        p.setup = () => {
          // 明確使用 2D 模式，避免與 Three.js WebGL 衝突
          const canvas = p.createCanvas(
            containerRef.current!.clientWidth,
            containerRef.current!.clientHeight,
            p.P2D
          );
          canvas.parent(containerRef.current!);
          canvas.style('display', 'block');
          p.noStroke();
        };

        p.draw = () => {
          p.clear();
          const centerX = p.width / 2;
          const centerY = p.height / 3;
          const time = p.millis() * 0.001;
          
          // 呼吸效果
          const breathe = p.map(p.sin(time * 1.5), -1, 1, 0.9, 1.1);
          const currentIntensity = intensity * breathe;

          // 設定混合模式為 ADD，讓光芒自然疊加
          p.blendMode(p.ADD);

          // 多層柔和金色光暈
          const layers = [
            { size: 80, alpha: 20 * currentIntensity, color: [255, 245, 200] },
            { size: 150, alpha: 15 * currentIntensity, color: [255, 220, 150] },
            { size: 220, alpha: 10 * currentIntensity, color: [255, 200, 100] },
            { size: 300, alpha: 5 * currentIntensity, color: [255, 180, 80] },
            { size: 400, alpha: 3 * currentIntensity, color: [255, 160, 60] },
          ];

          layers.forEach((layer) => {
            p.fill(layer.color[0], layer.color[1], layer.color[2], layer.alpha);
            p.ellipse(centerX, centerY, layer.size * breathe);
          });

          // 中心柔和光點
          p.fill(255, 250, 220, 30 * currentIntensity);
          p.ellipse(centerX, centerY, 60 * breathe);

          // 恢復正常混合模式
          p.blendMode(p.BLEND);
        };

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.clientWidth,
              containerRef.current.clientHeight
            );
          }
        };
      };

      // 使用實例模式，避免全局污染
      p5InstanceRef.current = new p5(sketch);
    };

    importP5();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [visible, intensity]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};