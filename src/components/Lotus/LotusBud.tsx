import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createPetalGeometry } from '../../utils/geometry';

interface LotusBudProps {
    meritCount: number;
}

// ============ 階段 5：花苞初現 (400-699) ============
export const LotusBud = ({ meritCount }: LotusBudProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const coreRef = useRef<THREE.Mesh>(null!);

    // 進度：400-699 時從 0 → 1
    const progress = useMemo(() => Math.min((meritCount - 400) / 300, 1), [meritCount]);
    const petalGeom = useMemo(() => createPetalGeometry(), []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.2;
            const pulse = 1 + Math.sin(time * 2) * 0.03;
            groupRef.current.scale.setScalar((1.2 + progress * 0.5) * pulse);
        }
        if (coreRef.current) {
            const corePulse = 1 + Math.sin(time * 3) * 0.08;
            coreRef.current.scale.setScalar(0.25 * corePulse);
        }
    });

    // 花瓣層配置（緊閉狀態）
    const layers = [
        { count: 6, color: '#FFB6C1', heightOffset: 0.15, angleOffset: 0, closedness: 0.05 },
        { count: 8, color: '#FFC0CB', heightOffset: 0.25, angleOffset: 0.2, closedness: 0.08 },
    ];

    return (
        <group ref={groupRef}>
            {/* 發光核心 */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={0.5 + progress * 0.3}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* 核心光源 */}
            <pointLight
                position={[0, 0.2, 0]}
                color="#ffd700"
                intensity={1 + progress}
                distance={3}
                decay={2}
            />

            {/* 緊閉的花瓣 */}
            {layers.map((layer, layerIdx) =>
                Array.from({ length: layer.count }).map((_, i) => {
                    const angle = (i / layer.count) * Math.PI * 2 + layer.angleOffset;
                    const radius = 0.2 + layerIdx * 0.08;
                    // 花瓣緊閉，隨進度微微張開
                    const openAngle = layer.closedness + progress * 0.1;

                    return (
                        <mesh
                            key={`${layerIdx}-${i}`}
                            geometry={petalGeom}
                            position={[
                                Math.sin(angle) * radius,
                                layer.heightOffset,
                                Math.cos(angle) * radius
                            ]}
                            rotation={[openAngle, -angle + Math.PI, 0]}
                            scale={[0.18, 0.35, 0.08]}
                        >
                            <meshPhysicalMaterial
                                color={layer.color}
                                roughness={0.3}
                                clearcoat={0.6}
                                transparent
                                opacity={0.9}
                            />
                        </mesh>
                    );
                })
            )}

            {/* 微弱光點 */}
            <Sparkles
                count={10 + Math.floor(progress * 15)}
                scale={[0.6, 0.4, 0.6]}
                size={1}
                speed={0.2}
                color="#ffd700"
                opacity={0.3}
            />
        </group>
    );
};

