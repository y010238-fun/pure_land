import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface FallingPetalsProps {
    visible?: boolean;
}

// 花瓣類別
class Petal {
    p: p5;
    x: number;
    y: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    fallSpeed: number;
    swayOffset: number;
    swaySpeed: number;
    color: p5.Color;

    constructor(p: p5) {
        this.p = p;
        this.x = p.random(p.width);
        this.y = p.random(-200, -50);
        this.size = p.random(4, 12);
        this.rotation = p.random(p.TWO_PI);
        this.rotationSpeed = p.random(-0.03, 0.03);
        this.fallSpeed = p.random(0.5, 1.5);
        this.swayOffset = p.random(1000);
        this.swaySpeed = p.random(0.005, 0.015);

        // 粉色系花瓣顏色
        const colors = [
            p.color(255, 182, 193, 200), // 淺粉
            p.color(255, 105, 180, 200), // 桃紅
            p.color(255, 192, 203, 200), // 粉紅
            p.color(255, 228, 225, 200), // 淡粉
            p.color(255, 240, 245, 200), // 薰衣草粉
        ];
        this.color = p.random(colors);
    }

    update() {
        // 緩慢飄落
        this.y += this.fallSpeed;

        // 左右搖擺
        this.x += this.p.sin(this.p.frameCount * this.swaySpeed + this.swayOffset) * 0.8;

        // 旋轉
        this.rotation += this.rotationSpeed;

        // 重置到頂部
        if (this.y > this.p.height + 50) {
            this.y = this.p.random(-100, -50);
            this.x = this.p.random(this.p.width);
        }
    }

    draw() {
        this.p.push();
        this.p.translate(this.x, this.y);
        this.p.rotate(this.rotation);
        this.p.noStroke();
        this.p.fill(this.color);

        // 繪製花瓣形狀 (改為單片淚滴狀)
        this.p.beginShape();
        for (let i = 0; i < 100; i++) {
            const angle = this.p.map(i, 0, 100, 0, this.p.TWO_PI);
            // 使用單片花瓣的參數方程：x = size * cos(t), y = size * sin(t) * (1 + 0.5 * sin(t))
            const x = this.size * this.p.cos(angle);
            const y = this.size * this.p.sin(angle) * (1 + 0.5 * this.p.sin(angle));
            this.p.vertex(x, y);
        }
        this.p.endShape(this.p.CLOSE);

        this.p.pop();
    }
}

export const FallingPetals = ({ visible = true }: FallingPetalsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    useEffect(() => {
        if (!visible || !containerRef.current) return;

        const sketch = (p: p5) => {
            const petals: Petal[] = [];
            const petalCount = 60; // 花瓣數量

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.style('pointer-events', 'none');

                // 初始化花瓣
                for (let i = 0; i < petalCount; i++) {
                    const petal = new Petal(p);
                    petal.y = p.random(-p.height, p.height); // 隨機分布在畫面中
                    petals.push(petal);
                }
            };

            p.draw = () => {
                p.clear();

                for (const petal of petals) {
                    petal.update();
                    petal.draw();
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        p5InstanceRef.current = new p5(sketch, containerRef.current);

        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
                p5InstanceRef.current = null;
            }
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ isolation: 'isolate' }}
        />
    );
};
