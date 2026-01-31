import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const EntanglementParticles = ({ startPos, endPos, strength }: { startPos: THREE.Vector3, endPos: THREE.Vector3, strength: number }) => {
    const count = 200;
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Store initial random offsets for each particle
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            t: Math.random(), // progress 0-1
            speed: 0.2 + Math.random() * 0.5,
            offset: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            )
        }));
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current || strength === 0) {
            if (meshRef.current) meshRef.current.visible = false;
            return;
        }

        meshRef.current.visible = true;

        particles.forEach((particle, i) => {
            // Update progress
            particle.t += particle.speed * delta * (1 + strength * 2);
            if (particle.t > 1) particle.t = 0;

            // Lerp position between worlds
            const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, particle.t);

            // Add "noise" based on distance from center to simulate chaotic quantum foam becoming structured
            const noiseIntensity = (1 - strength) * 2;
            currentPos.add(new THREE.Vector3(
                particle.offset.x * noiseIntensity * Math.sin(particle.t * Math.PI),
                particle.offset.y * noiseIntensity * Math.sin(particle.t * Math.PI),
                particle.offset.z * noiseIntensity * Math.sin(particle.t * Math.PI)
            ));

            dummy.position.copy(currentPos);

            // Scale based on flow
            const s = Math.sin(particle.t * Math.PI) * 0.1;
            dummy.scale.setScalar(s);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={strength > 0.8 ? "#ffd700" : "#60a5fa"} transparent opacity={0.6} />
        </instancedMesh>
    );
};
