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
    const figureRef = useRef<THREE.Group>(null!);
    const haloRef = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (figureRef.current) {
            figureRef.current.position.y = 1.5 + Math.sin(time * 0.5) * 0.05;
        }
        // 圓滿狀態的背光旋轉
        if (haloRef.current && isEnlightened) {
            haloRef.current.rotation.z = time * 0.2;
        }
    });

    // 圓滿狀態增強效果
    const glowIntensity = isEnlightened ? 1.5 : 1;
    const haloScale = isEnlightened ? 0.8 : 0.5;
    const lightIntensity = isEnlightened ? 5 : 2;

    return (
        <group ref={figureRef} position={[0, 1.5, 0]}>
            {/* 頭部 */}
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 身體 (盤坐姿態) */}
            <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.3, 0.5, 8]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={glowIntensity * 0.8}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 背光圓輪 */}
            <mesh ref={haloRef} position={[0, 0.4, -0.15]}>
                <circleGeometry args={[haloScale, 64]} />
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={opacity * (isEnlightened ? 0.5 : 0.3)}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 圓滿狀態：外圈光環 */}
            {isEnlightened && (
                <mesh position={[0, 0.4, -0.2]}>
                    <ringGeometry args={[0.7, 0.9, 64]} />
                    <meshBasicMaterial
                        color="#ffd700"
                        transparent
                        opacity={opacity * 0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* 圓滿狀態：光芒粒子 */}
            {isEnlightened && (
                <Sparkles
                    count={50}
                    scale={[1.5, 1.5, 1.5]}
                    size={3}
                    speed={0.3}
                    color="#ffd700"
                    opacity={0.6}
                />
            )}

            {/* 發光 */}
            <pointLight color="#ffd700" intensity={lightIntensity * opacity} distance={6} />
        </group>
    );
};

