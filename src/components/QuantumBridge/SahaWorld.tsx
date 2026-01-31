import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const SahaWorld = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        // Jittery rotation for "instability"
        meshRef.current.rotation.y += 0.005 + Math.sin(t * 10) * 0.002;
        meshRef.current.rotation.z = Math.sin(t * 2) * 0.05;
    });

    return (
        <Sphere ref={meshRef} args={[1.5, 64, 64]} position={position}>
            <MeshDistortMaterial
                color="#1a3b5c" // Desaturated blue
                attach="material"
                distort={0.4} // High distortion for "noise"
                speed={2}
                roughness={0.7}
                metalness={0.1}
            />
            {/* Wireframe overlay for "Digital/Glitch" feel */}
            <lineSegments>
                <edgesGeometry args={[new THREE.SphereGeometry(1.5, 16, 16)]} />
                <lineBasicMaterial color="#4a6b8c" transparent opacity={0.1} />
            </lineSegments>
        </Sphere>
    );
};
