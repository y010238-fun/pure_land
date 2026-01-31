import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface SeatedFigureProps {
    opacity: number;
    isEnlightened?: boolean;
    meritCount?: number;
}

// ============ 階段 9-10：化身顯現 + 圓滿淨土 (2000+) ============
export const SeatedFigure = ({ opacity, isEnlightened = false, meritCount = 2000 }: SeatedFigureProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const haloRef = useRef<THREE.Mesh>(null!);

    // 計算動態縮放：2000-3000 merit 從 1x 變 3x (達到 1:3 比例)
    // 3000 以上維持 3 倍大小
    const growthProgress = Math.min(Math.max((meritCount - 2000) / 1000, 0), 1);
    const dynamicScale = 1 + growthProgress * 2; // 1 -> 3

    // 基礎高度調整
    // 當放大時，為了不讓腿部陷入蓮花，需要往上移動中心點
    // 原始各部位中心約在 0，腿部在 -0.15
    // 原始 Group Y = 1.8
    // 我們希望 "底部" 固定在某個高度 (假設是 1.65, 即 1.8 - 0.15)
    // Y_new - 0.15 * scale = 1.65 => Y_new = 1.65 + 0.15 * scale
    // 加上原本的懸浮效果
    const baseY = 1.65 + 0.15 * dynamicScale;

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (groupRef.current) {
            // 輕微懸浮律動 (幅度隨體型變大而微調)
            groupRef.current.position.y = baseY + Math.sin(time * 0.5) * (0.08 * dynamicScale);
        }
        // 背光旋轉
        if (haloRef.current) {
            haloRef.current.rotation.z = time * 0.15;
        }
    });

    // 圓滿狀態發光增強
    const glowIntensity = isEnlightened ? 2 : 1;

    return (
        <group
            ref={groupRef}
            position={[0, baseY, 0]}
            scale={[dynamicScale, dynamicScale, dynamicScale]}
        >

            {/* ===== 背光光環 (Mandala Halo) ===== */}
            <mesh ref={haloRef} position={[0, 0.3, -0.3]}>
                <ringGeometry args={[0.5, 0.9, 64]} />
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={opacity * 0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 外圈光環 */}
            {isEnlightened && (
                <mesh position={[0, 0.3, -0.35]}>
                    <ringGeometry args={[0.85, 1.1, 64]} />
                    <meshBasicMaterial
                        color="#ffd700"
                        transparent
                        opacity={opacity * 0.25}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* ===== 人形身體 ===== */}

            {/* 頭部 */}
            <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 頸部 */}
            <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.05, 0.07, 0.1, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity * 0.8}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 上身 (軀幹) */}
            <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.12, 0.2, 0.4, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity * 0.7}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 盤坐雙腿 (扁橢圓) */}
            <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.25, 0.08, 16, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity * 0.6}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 雙手 (結印) */}
            <mesh position={[0, 0.0, 0.12]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity * 0.8}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* ===== 發光效果 ===== */}
            <pointLight
                color="#ffd700"
                intensity={3 * opacity * glowIntensity * dynamicScale}
                distance={5 * dynamicScale}
                decay={2}
            />

            {/* 神聖光芒粒子 */}
            <Sparkles
                count={isEnlightened ? 80 : 40}
                scale={[1.5 * dynamicScale, 2 * dynamicScale, 1.5 * dynamicScale]}
                size={isEnlightened ? 4 : 2}
                speed={0.3}
                color="#ffd700"
                opacity={opacity * 0.6}
            />
        </group>
    );
};
