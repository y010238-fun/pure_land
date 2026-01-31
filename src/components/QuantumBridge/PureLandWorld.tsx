import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const PureLandWorld = ({ position, connectionStrength }: { position: [number, number, number], connectionStrength: number }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Smooth, divine rotation
        meshRef.current.rotation.y = t * 0.1;
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.PI / 2;
            ringRef.current.rotation.z = -t * 0.05;
            ringRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        }

        // Pulse based on connection
        const scale = 1 + connectionStrength * 0.1;
        meshRef.current.scale.setScalar(scale);

        // Internal glow pulse
        if (glowRef.current) {
            glowRef.current.scale.setScalar(0.6 + Math.sin(t * 2) * 0.05);
            glowRef.current.rotation.y = -t * 0.2;
        }
    });

    return (
        <group position={position}>
            {/* 1. Crystal Shell (琉璃外殼) */}
            <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                {/* Using MeshTransmissionMaterial for glass/crystal effect */}
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    thickness={0.5}
                    roughness={0}
                    chromaticAberration={0.2} // Rainbow effect
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#fbbf24" // Gold tint
                    color="#fbbf24"
                />
            </Sphere>

            {/* 2. Internal Divine Light (內在發光核心) */}
            <Sphere ref={glowRef} args={[0.8, 32, 32]}>
                <meshBasicMaterial color="#fffbeb" toneMapped={false} />
            </Sphere>

            {/* 3. Golden Halo Ring (光環) */}
            <mesh ref={ringRef}>
                <torusGeometry args={[2.2, 0.02, 16, 100]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* 4. Radiant Particles (佛光粒子) */}
            <Sparkles
                count={80}
                scale={5}
                size={6}
                speed={0.4}
                color="#fbbf24"
                opacity={0.8}
                noise={0.2}
            />

            {/* 5. Outer Glow (Atmosphere) */}
            <Sphere args={[1.6, 32, 32]}>
                <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.15 + connectionStrength * 0.2}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </Sphere>
        </group>
    );
};
