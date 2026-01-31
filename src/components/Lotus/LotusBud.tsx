import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createPetalGeometry } from '../../utils/geometry';

interface LotusBudProps {
    meritCount: number;
}

// ============ 第二階段：花苞 (100-499) ============
export const LotusBud = ({ meritCount }: LotusBudProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const progress = (meritCount - 100) / 400;
    const petalGeom = useMemo(() => createPetalGeometry(), []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
            const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
            groupRef.current.scale.setScalar(0.8 + progress * 0.5 * pulse);
        }
    });

    // 優化的花瓣配置
    const petalCount = Math.floor(8 + progress * 16);

    return (
        <group ref={groupRef}>
            {/* 核心球體 */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd6e0"
                    emissive="#ff8fab"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* 緊閉的花瓣 - 使用優化幾何 */}
            {Array.from({ length: petalCount }).map((_, i) => {
                const angle = (i / petalCount) * Math.PI * 2;
                const layer = Math.floor(i / 8);
                const yOffset = layer * 0.15;
                const radius = 0.2 + layer * 0.1;

                return (
                    <mesh
                        key={i}
                        position={[
                            Math.sin(angle) * radius,
                            0.2 + yOffset,
                            Math.cos(angle) * radius
                        ]}
                        rotation={[0.1 + layer * 0.1, -angle, 0]}
                        scale={[0.15, 0.4, 0.05]}
                        geometry={petalGeom}
                    >
                        <meshPhysicalMaterial
                            color={layer === 0 ? '#fff5f7' : layer === 1 ? '#ffd6e0' : '#ffb3c6'}
                            roughness={0.2}
                            clearcoat={0.8}
                            clearcoatRoughness={0.1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};
