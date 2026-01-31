import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createPetalGeometry } from '../../utils/geometry';
import { PetalShaderMaterial } from './shaders/petalShader';

interface BloomingLotusProps {
    meritCount: number;
}

// ============ 第三階段：綻放 (500-999) ============
export const BloomingLotus = ({ meritCount }: BloomingLotusProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const shaderRef = useRef<THREE.ShaderMaterial>(null!);
    const bloomProgress = (meritCount - 500) / 500;
    const petalGeom = useMemo(() => createPetalGeometry(), []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
            const scale = 1.5 + bloomProgress * 0.5;
            groupRef.current.scale.setScalar(scale);
        }
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    // 🌺 優化的花瓣層配置 - 降低 baseAngle 讓花瓣向外展開
    const layers = [
        { count: 6, color: '#C24A8F', scale: 0.35, baseAngle: 0.1, heightOffset: 0.0 },
        { count: 8, color: '#D1568F', scale: 0.38, baseAngle: 0.08, heightOffset: 0.02 },
        { count: 10, color: '#DC6294', scale: 0.42, baseAngle: 0.06, heightOffset: 0.04 },
        { count: 12, color: '#E66E99', scale: 0.46, baseAngle: 0.05, heightOffset: 0.06 },
        { count: 14, color: '#F07A9E', scale: 0.50, baseAngle: 0.04, heightOffset: 0.08 },
        { count: 16, color: '#F486A3', scale: 0.54, baseAngle: 0.03, heightOffset: 0.10 },
        { count: 18, color: '#F692A8', scale: 0.58, baseAngle: 0.02, heightOffset: 0.12 },
        { count: 20, color: '#F89EAD', scale: 0.62, baseAngle: 0.01, heightOffset: 0.14 },
        { count: 22, color: '#FAAAB2', scale: 0.66, baseAngle: 0.0, heightOffset: 0.16 },
        { count: 24, color: '#FCB6B7', scale: 0.70, baseAngle: 0.0, heightOffset: 0.18 },
        { count: 26, color: '#FEC2BC', scale: 0.74, baseAngle: 0.0, heightOffset: 0.20 },
        { count: 28, color: '#FFCEC1', scale: 0.78, baseAngle: 0.0, heightOffset: 0.22 },
    ];

    return (
        <group ref={groupRef}>
            {/* 金色花心 - 微弱光芒 */}
            <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* 花心微弱粒子 */}
            <Sparkles
                count={10}
                scale={[0.2, 0.1, 0.2]}
                size={1}
                speed={0.15}
                color="#FFD700"
                opacity={0.15}
            />

            {/* 12 層花瓣 - 旋轉調整讓花瓣向外展開 */}
            {layers.map((layer, layerIdx) =>
                Array.from({ length: layer.count }).map((_, i) => {
                    const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.15;
                    const openAngle = layer.baseAngle + bloomProgress * 0.3;

                    return (
                        <mesh
                            key={`${layerIdx}-${i}`}
                            geometry={petalGeom}
                            position={[
                                Math.sin(angle) * (0.12 + layerIdx * 0.05),
                                0.1 + layer.heightOffset,
                                Math.cos(angle) * (0.12 + layerIdx * 0.05)
                            ]}
                            rotation={[openAngle, -angle + Math.PI, 0]}
                            scale={[layer.scale * 0.5, layer.scale * 0.7, layer.scale * 0.2]}
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
        </group>
    );
};
