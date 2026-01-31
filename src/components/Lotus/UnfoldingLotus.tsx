import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createPetalGeometry } from '../../utils/geometry';
import { PetalShaderMaterial } from './shaders/petalShader';

interface UnfoldingLotusProps {
    meritCount: number;
}

// ============ 階段 6：花瓣舒展 (700-999) ============
export const UnfoldingLotus = ({ meritCount }: UnfoldingLotusProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const shaderRef = useRef<THREE.ShaderMaterial>(null!);

    // 舒展進度：700-999 時從 0 → 1
    const unfoldProgress = useMemo(() => Math.min((meritCount - 700) / 300, 1), [meritCount]);
    const petalGeom = useMemo(() => createPetalGeometry(), []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.1;
            const pulse = 1 + Math.sin(time * 1.5) * 0.02;
            groupRef.current.scale.setScalar((1.8 + unfoldProgress * 0.5) * pulse);
        }
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = time;
            shaderRef.current.uniforms.uGlowIntensity.value = 0.3 + unfoldProgress * 0.4;
        }
    });

    // 6-8 層花瓣，隨進度展開
    const layers = [
        { count: 6, color: '#C24A8F', scale: 0.30, baseAngle: 0.1, heightOffset: 0.0 },
        { count: 8, color: '#D1568F', scale: 0.32, baseAngle: 0.12, heightOffset: 0.03 },
        { count: 10, color: '#DC6294', scale: 0.35, baseAngle: 0.14, heightOffset: 0.06 },
        { count: 12, color: '#E66E99', scale: 0.38, baseAngle: 0.16, heightOffset: 0.09 },
        { count: 14, color: '#F07A9E', scale: 0.41, baseAngle: 0.18, heightOffset: 0.12 },
        { count: 16, color: '#F486A3', scale: 0.44, baseAngle: 0.20, heightOffset: 0.15 },
    ];

    return (
        <group ref={groupRef}>
            {/* 金色發光核心 */}
            <pointLight
                position={[0, 0.3, 0]}
                color="#FFD700"
                intensity={1 + unfoldProgress * 2}
                distance={4}
                decay={2}
            />
            <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={0.4 + unfoldProgress * 0.4}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* 花瓣層 - 漸進展開 */}
            {layers.map((layer, layerIdx) =>
                Array.from({ length: layer.count }).map((_, i) => {
                    const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.12;
                    // 展開角度隨進度增加
                    const openAngle = layer.baseAngle + unfoldProgress * 0.25;
                    const radius = 0.12 + layerIdx * 0.05;

                    return (
                        <mesh
                            key={`${layerIdx}-${i}`}
                            geometry={petalGeom}
                            position={[
                                Math.sin(angle) * radius,
                                0.1 + layer.heightOffset,
                                Math.cos(angle) * radius
                            ]}
                            rotation={[openAngle, -angle + Math.PI, 0]}
                            scale={[layer.scale * 0.5, layer.scale * 0.65, layer.scale * 0.18]}
                        >
                            <shaderMaterial
                                ref={shaderRef}
                                attach="material"
                                args={[PetalShaderMaterial]}
                                uniforms-uColorInner-value={new THREE.Color(layer.color)}
                                uniforms-uColorOuter-value={new THREE.Color('#FFB6D9')}
                            />
                        </mesh>
                    );
                })
            )}

            {/* 光點粒子 */}
            <Sparkles
                count={15 + Math.floor(unfoldProgress * 20)}
                scale={[1, 0.5, 1]}
                size={1.5}
                speed={0.2}
                color="#ffd700"
                opacity={0.3 + unfoldProgress * 0.3}
            />

            {/* 底部光環 */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.8, 64]} />
                <meshBasicMaterial
                    color="#FFB6D9"
                    transparent
                    opacity={0.1 + unfoldProgress * 0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};
