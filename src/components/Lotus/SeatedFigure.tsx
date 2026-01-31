import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface SeatedFigureProps {
    opacity: number;
    isEnlightened?: boolean;
}

// ============ 階段 9-10：化身顯現 + 圓滿淨土 (2000+) ============
export const SeatedFigure = ({ opacity, isEnlightened = false }: SeatedFigureProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const haloRef = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (groupRef.current) {
            // 輕微懸浮律動
            groupRef.current.position.y = 1.8 + Math.sin(time * 0.5) * 0.08;
        }
        // 背光旋轉
        if (haloRef.current) {
            haloRef.current.rotation.z = time * 0.15;
        }
    });

    // 圓滿狀態增強效果
    const glowIntensity = isEnlightened ? 2 : 1;
    const figureScale = isEnlightened ? 1.2 : 1;

    return (
        <group ref={groupRef} position={[0, 1.8, 0]} scale={[figureScale, figureScale, figureScale]}>

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
                intensity={3 * opacity * glowIntensity}
                distance={5}
                decay={2}
            />

            {/* 神聖光芒粒子 */}
            <Sparkles
                count={isEnlightened ? 80 : 40}
                scale={[1.5, 2, 1.5]}
                size={isEnlightened ? 4 : 2}
                speed={0.3}
                color="#ffd700"
                opacity={opacity * 0.6}
            />
        </group>
    );
};
