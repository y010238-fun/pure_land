import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface LotusSeedProps {
    meritCount: number;
}

// ============ 階段 3-4：蓮種凝聚 + 種子覺醒 (100-399) ============
export const LotusSeed = ({ meritCount }: LotusSeedProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const coreRef = useRef<THREE.Mesh>(null!);
    const shellParticlesRef = useRef<THREE.Points>(null!);

    // 覺醒進度：200-399 時從 0 → 1
    const awakeningProgress = useMemo(() => {
        if (meritCount < 200) return 0;
        return Math.min((meritCount - 200) / 200, 1);
    }, [meritCount]);

    // 凝聚進度：100-199 時從 0 → 1
    const condensingProgress = useMemo(() => {
        if (meritCount < 100) return 0;
        if (meritCount >= 200) return 1;
        return (meritCount - 100) / 100;
    }, [meritCount]);

    // 外殼粒子
    const shellCount = 100;
    const shellPositions = useMemo(() => {
        const pos = new Float32Array(shellCount * 3);
        for (let i = 0; i < shellCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.4 + Math.random() * 0.2;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.3;
        }

        // 核心脈動
        if (coreRef.current) {
            const pulse = 1 + Math.sin(time * 3) * 0.1 * (0.5 + awakeningProgress * 0.5);
            const baseScale = 0.15 + condensingProgress * 0.1 + awakeningProgress * 0.05;
            coreRef.current.scale.setScalar(baseScale * pulse);
        }

        // 外殼粒子旋轉
        if (shellParticlesRef.current) {
            shellParticlesRef.current.rotation.y = -time * 0.5;
            shellParticlesRef.current.rotation.x = time * 0.2;
        }
    });

    // 核心發光強度
    const glowIntensity = 0.3 + condensingProgress * 0.3 + awakeningProgress * 0.5;
    const coreColor = awakeningProgress > 0.5 ? '#ffd700' : '#ffffff';

    return (
        <group ref={groupRef}>
            {/* 核心發光球體 */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={coreColor}
                    emissive={coreColor}
                    emissiveIntensity={glowIntensity}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* 核心光源 */}
            <pointLight
                position={[0, 0, 0]}
                color={coreColor}
                intensity={glowIntensity * 2}
                distance={3}
                decay={2}
            />

            {/* 外殼粒子 */}
            <points ref={shellParticlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[shellPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    color="#ffb3c6"
                    transparent
                    opacity={0.5 + awakeningProgress * 0.3}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* 覺醒階段額外光點 */}
            {awakeningProgress > 0 && (
                <Sparkles
                    count={20 + Math.floor(awakeningProgress * 30)}
                    scale={[0.8, 0.8, 0.8]}
                    size={1.5}
                    speed={0.3}
                    color="#ffd700"
                    opacity={awakeningProgress * 0.6}
                />
            )}
        </group>
    );
};
