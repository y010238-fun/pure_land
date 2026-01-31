import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import p5 from 'p5';

/**
 * 使用 p5.js 生成動態的化身貼圖
 * 結合 p5 的平面繪圖靈活性與 Three.js 的 3D 場景
 */
export const useAvatarP5Texture = (isEnlightened: boolean) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        canvasRef.current = canvas;
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        let p5Instance: p5;

        const sketch = (p: p5) => {
            let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

            p.setup = () => {
                p.createCanvas(512, 512);
                p.background(0, 0); // 透明背景
                p.noStroke();
            };

            p.draw = () => {
                p.clear(0, 0, 0, 0); // 每一幀清空背景

                const time = p.millis() * 0.001;
                const centerX = p.width / 2;
                const centerY = p.height / 2 + 50; // 人像位置稍微往下偏

                // --- 繪製背部光環 (Mandala Halo) ---
                p.push();
                p.translate(centerX, centerY - 150); // 對準頭部位置
                p.rotate(time * 0.2);

                const haloR = isEnlightened ? 120 : 80;
                const petals = isEnlightened ? 32 : 16;

                (p.drawingContext as any).shadowBlur = 20;
                (p.drawingContext as any).shadowColor = 'rgba(255, 215, 0, 0.8)';

                for (let i = 0; i < petals; i++) {
                    p.rotate(p.TWO_PI / petals);
                    p.fill(255, 215, 0, 150);
                    p.triangle(-5, 40, 5, 40, 0, 40 + haloR);
                }
                p.pop();

                // --- 繪製坐姿人形輪廓 (Silhouette) ---
                // 我們用簡單的曲線組合出「盤坐」的意象，並用粒子充填
                p.push();
                p.translate(centerX, centerY);

                // 身體粒子 (模擬發光體)
                if (p.frameCount % 2 === 0) {
                    particles.push({
                        x: 0,
                        y: -100, // 從心輪或頭部附近產生
                        vx: (p.random() - 0.5) * 2,
                        vy: (p.random() - 0.5) * 2,
                        life: 255
                    });
                }

                // 繪製人形剪影填充粒子
                for (let i = particles.length - 1; i >= 0; i--) {
                    const pt = particles[i];
                    pt.x += pt.vx;
                    pt.y += pt.vy;
                    pt.life -= 4;

                    // 限制粒子在盤坐人形範圍內 (簡單的幾何包諾)
                    // 這邊使用簡單的比例：頭部圓形、身體三角形、下部寬橢圓
                    let inFigure = false;
                    const dy = pt.y + 150; // offset 向上
                    // 頭
                    if (p.dist(pt.x, pt.y + 150, 0, 0) < 40) inFigure = true;
                    // 軀幹
                    else if (pt.y > -110 && pt.y < 20 && Math.abs(pt.x) < (pt.y + 110) * 0.8 + 20) inFigure = true;
                    // 雙腿盤坐
                    else if (pt.y >= 20 && pt.y < 100 && Math.abs(pt.x) < 200 - (pt.y - 20) * 0.5) inFigure = true;

                    if (inFigure || p.random() > 0.8) {
                        p.fill(255, 255, 200, pt.life);
                        p.ellipse(pt.x, pt.y, 3, 3);
                    }

                    if (pt.life <= 0) particles.splice(i, 1);
                }

                // --- 核心輪廓 (Soft Glow Body) ---
                (p.drawingContext as any).shadowBlur = 35;
                (p.drawingContext as any).shadowColor = 'rgba(255, 255, 255, 0.5)';
                p.fill(255, 255, 255, 40);

                // 頭
                p.ellipse(0, -150, 60, 75);
                // 頸
                p.rect(-10, -120, 20, 20);
                // 軀幹
                p.beginShape();
                p.vertex(-40, -100);
                p.vertex(40, -100);
                p.vertex(60, 20);
                p.vertex(-60, 20);
                p.endShape(p.CLOSE);
                // 盤坐雙腿
                p.ellipse(0, 50, 250, 100);

                p.pop();

                // 標記貼圖需要更新
                texture.needsUpdate = true;
            };
        };

        p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        };
    }, [texture, isEnlightened]);

    return texture;
};
