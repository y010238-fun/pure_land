import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SeedParticlesProps {
    meritCount: number;
}

// ============ 第一階段：種子粒子 (0-99) ============
export const SeedParticles = ({ meritCount }: SeedParticlesProps) => {
    const particlesRef = useRef<THREE.Points>(null!);
    const count = 200;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2 + Math.random() * 3;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        if (!particlesRef.current) return;
        const positionsAttr = particlesRef.current.geometry.attributes.position;
        const progress = meritCount / 100;
        const time = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const originalX = positions[idx];
            const originalY = positions[idx + 1];
            const originalZ = positions[idx + 2];

            const targetX = originalX * (1 - progress * 0.8);
            const targetY = originalY * (1 - progress * 0.8) + Math.sin(time + i) * 0.1;
            const targetZ = originalZ * (1 - progress * 0.8);

            positionsAttr.setXYZ(i, targetX, targetY, targetZ);
        }
        positionsAttr.needsUpdate = true;
        particlesRef.current.rotation.y = time * 0.2;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#ffb3c6"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
};
