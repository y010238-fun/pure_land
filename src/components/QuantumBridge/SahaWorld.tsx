import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const SahaWorld = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const wireframeRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!meshRef.current || !wireframeRef.current) return;
        const t = state.clock.getElapsedTime();

        // Jittery rotation
        const jitter = Math.sin(t * 10) * 0.02;
        meshRef.current.rotation.y += 0.005 + jitter;
        meshRef.current.rotation.z = Math.sin(t * 2) * 0.05;

        // Sync wireframe
        wireframeRef.current.rotation.copy(meshRef.current.rotation);
        wireframeRef.current.scale.setScalar(1.05 + Math.sin(t * 5) * 0.02); // Pulse wireframe
    });

    return (
        <group position={position}>
            {/* Core: Dark but visible inner sphere */}
            <Sphere ref={meshRef} args={[1.5, 32, 32]}>
                <meshStandardMaterial
                    color="#1e293b"
                    emissive="#0f172a"
                    emissiveIntensity={0.5}
                    roughness={0.7}
                    metalness={0.8}
                />
            </Sphere>

            {/* Shell: Holographic Wireframe */}
            <Sphere ref={wireframeRef} args={[1.5, 16, 16]}>
                <meshBasicMaterial
                    color="#06b6d4" // Cyan
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            {/* Glitch/Noise Atmosphere - Using lines */}
            <group rotation={[0, 0, Math.PI / 4]}>
                <primitive object={new THREE.AxesHelper(0.1)} />
                {/* Decoration rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.8, 1.85, 64]} />
                    <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </group>
    );
};
