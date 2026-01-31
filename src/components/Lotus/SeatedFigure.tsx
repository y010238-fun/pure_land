import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SeatedFigureProps {
    opacity: number;
}

// ============ 第五階段：化身顯現 (2000+) ============
export const SeatedFigure = ({ opacity }: SeatedFigureProps) => {
    const figureRef = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        if (figureRef.current) {
            figureRef.current.position.y = 1.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
        }
    });

    return (
        <group ref={figureRef} position={[0, 1.5, 0]}>
            {/* 頭部 */}
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={1}
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
                    emissiveIntensity={0.8}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* 光暈 */}
            <mesh position={[0, 0.4, -0.1]}>
                <circleGeometry args={[0.5, 32]} />
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={opacity * 0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 發光 */}
            <pointLight color="#ffd700" intensity={2 * opacity} distance={5} />
        </group>
    );
};
