import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const PureLandWorld = ({ position, connectionStrength }: { position: [number, number, number], connectionStrength: number }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        // Smooth, slow rotation
        meshRef.current.rotation.y -= 0.002;

        // Scale pulse based on connection
        const scale = 1 + connectionStrength * 0.1 + Math.sin(t) * 0.02;
        meshRef.current.scale.setScalar(scale);
    });

    return (
        <group position={position}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                <MeshWobbleMaterial
                    color="#fbbf24" // Gold
                    emissive="#d97706"
                    emissiveIntensity={0.5 + connectionStrength}
                    factor={0.1} // Gentle wobble
                    speed={0.5}
                    roughness={0.1}
                    metalness={1}
                />
            </Sphere>

            {/* Halo / Aura */}
            <Sphere args={[1.8, 32, 32]}>
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.1 + connectionStrength * 0.2} side={THREE.BackSide} />
            </Sphere>

            {/* Radiant Particles around the planet */}
            <Sparkles
                count={50}
                scale={4}
                size={4}
                speed={0.2}
                color="#fbbf24"
                opacity={0.5}
            />
        </group>
    );
};
