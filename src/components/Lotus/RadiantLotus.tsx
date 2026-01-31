import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createPetalGeometry } from '../../utils/geometry';
import { PetalShaderMaterial } from './shaders/petalShader';

interface RadiantLotusProps {
    meritCount: number;
    isChanting: boolean;
}

// ============ 第四階段：放光 (1000-1999) ============
export const RadiantLotus = ({ meritCount, isChanting }: RadiantLotusProps) => {
    const groupRef = useRef<THREE.Group>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);
    const shaderRef = useRef<THREE.ShaderMaterial>(null!);
    const radiance = (meritCount - 1000) / 1000;
    const petalGeom = useMemo(() => createPetalGeometry(), []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
            const breathe = isChanting ? Math.sin(clock.getElapsedTime() * 3) * 0.05 : 0;
            groupRef.current.scale.setScalar(2.5 + radiance * 0.5 + breathe);

            // 懸浮動畫
            groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
        }
        if (lightRef.current) {
            lightRef.current.intensity = 3 + Math.sin(clock.getElapsedTime() * 2) * 1 + radiance * 2;
        }
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
            shaderRef.current.uniforms.uGlowIntensity.value = 0.3 + radiance * 0.5;
        }
    });

    const layers = [
        { count: 6, color: '#C24A8F', scale: 0.35, baseAngle: 0.08, heightOffset: 0.0 },
        { count: 8, color: '#D1568F', scale: 0.38, baseAngle: 0.06, heightOffset: 0.02 },
        { count: 10, color: '#DC6294', scale: 0.42, baseAngle: 0.05, heightOffset: 0.04 },
        { count: 12, color: '#E66E99', scale: 0.46, baseAngle: 0.04, heightOffset: 0.06 },
        { count: 14, color: '#F07A9E', scale: 0.50, baseAngle: 0.03, heightOffset: 0.08 },
        { count: 16, color: '#F486A3', scale: 0.54, baseAngle: 0.02, heightOffset: 0.10 },
        { count: 18, color: '#F692A8', scale: 0.58, baseAngle: 0.01, heightOffset: 0.12 },
        { count: 20, color: '#F89EAD', scale: 0.62, baseAngle: 0.0, heightOffset: 0.14 },
        { count: 22, color: '#FAAAB2', scale: 0.66, baseAngle: 0.0, heightOffset: 0.16 },
        { count: 24, color: '#FCB6B7', scale: 0.70, baseAngle: 0.0, heightOffset: 0.18 },
        { count: 26, color: '#FEC2BC', scale: 0.74, baseAngle: 0.0, heightOffset: 0.20 },
        { count: 28, color: '#FFCEC1', scale: 0.78, baseAngle: 0.0, heightOffset: 0.22 },
        { count: 30, color: '#FFDAD6', scale: 0.82, baseAngle: 0.0, heightOffset: 0.24 },
        { count: 32, color: '#FFE6DB', scale: 0.86, baseAngle: 0.0, heightOffset: 0.26 },
    ];

    return (
        <group ref={groupRef}>
            {/* 中央微弱光源 */}
            <pointLight
                ref={lightRef}
                position={[0, 0.3, 0]}
                color="#FFD700"
                intensity={0.3 + radiance * 0.2}
                distance={4}
                decay={3}
            />

            {/* 花心微弱發光球體 */}
            <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={0.15}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* 少量光點粒子 */}
            <Sparkles
                count={10}
                scale={[0.2, 0.1, 0.2]}
                size={1}
                speed={0.15}
                color="#FFD700"
                opacity={0.2}
            />

            {/* 底部微弱光暈 */}
            <pointLight
                position={[0, -0.5, 0]}
                color="#FFB6D9"
                intensity={0.15}
                distance={2}
                decay={3}
            />
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.8, 64]} />
                <meshBasicMaterial
                    color="#FFB6D9"
                    transparent
                    opacity={0.08}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 14 層花瓣 - 使用 Custom Shader */}
            {layers.map((layer, layerIdx) =>
                Array.from({ length: layer.count }).map((_, i) => {
                    const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.15;
                    const openAngle = layer.baseAngle + radiance * 0.2;

                    return (
                        <mesh
                            key={`${layerIdx}-${i}`}
                            geometry={petalGeom}
                            position={[
                                Math.sin(angle) * (0.12 + layerIdx * 0.04),
                                0.1 + layer.heightOffset,
                                Math.cos(angle) * (0.12 + layerIdx * 0.04)
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
                                uniforms-uGlowIntensity-value={0.3 + radiance * 0.5}
                            />
                        </mesh>
                    );
                })
            )}
        </group>
    );
};
