import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChaosParticlesProps {
    meritCount: number;
}

// ============ 階段 1-2：混沌星塵 + 螺旋聚合 (0-99) ============
export const ChaosParticles = ({ meritCount }: ChaosParticlesProps) => {
    const particlesRef = useRef<THREE.Points>(null!);
    const count = 300;

    // 螺旋進度：50-99 時從 0 → 1
    const spiralProgress = useMemo(() => {
        if (meritCount < 50) return 0;
        return Math.min((meritCount - 50) / 50, 1);
    }, [meritCount]);

    // 初始隨機位置
    const initialPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2 + Math.random() * 3;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    // 粒子角度偏移（用於螺旋）
    const angleOffsets = useMemo(() => {
        const offsets = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            offsets[i] = Math.random() * Math.PI * 2;
        }
        return offsets;
    }, []);

    useFrame(({ clock }) => {
        if (!particlesRef.current) return;
        const positionsAttr = particlesRef.current.geometry.attributes.position;
        const time = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const originalX = initialPositions[idx];
            const originalY = initialPositions[idx + 1];
            const originalZ = initialPositions[idx + 2];

            // 原始距離
            const originalR = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);

            if (spiralProgress > 0) {
                // 螺旋聚合模式
                const angle = angleOffsets[i] + time * 0.5 + spiralProgress * 2;
                const targetR = originalR * (1 - spiralProgress * 0.8); // 向心收縮

                const x = Math.cos(angle) * targetR * (1 - spiralProgress * 0.3);
                const y = originalY * (1 - spiralProgress * 0.5) + Math.sin(time * 2 + i) * 0.1;
                const z = Math.sin(angle) * targetR * (1 - spiralProgress * 0.3);

                positionsAttr.setXYZ(i, x, y, z);
            } else {
                // 混沌漂浮模式
                const x = originalX + Math.sin(time + i * 0.1) * 0.2;
                const y = originalY + Math.cos(time * 0.7 + i * 0.2) * 0.3;
                const z = originalZ + Math.sin(time * 0.5 + i * 0.3) * 0.2;
                positionsAttr.setXYZ(i, x, y, z);
            }
        }
        positionsAttr.needsUpdate = true;

        // 整體緩慢旋轉
        particlesRef.current.rotation.y = time * 0.1;
    });

    // 顏色隨進度變化
    const color = spiralProgress > 0.5 ? '#ff8fab' : '#ffb3c6';

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[initialPositions.slice(), 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.06 + spiralProgress * 0.04}
                color={color}
                transparent
                opacity={0.6 + spiralProgress * 0.3}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};
