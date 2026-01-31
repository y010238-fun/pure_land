import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, ChromaticAberration, Bloom } from '@react-three/postprocessing';

export const WarpTunnelScene = ({ onComplete }: { onComplete: () => void }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

    // Animation state
    const speed = useRef(0);
    const time = useRef(0);

    useFrame((state, delta) => {
        time.current += delta;

        // Accelerate
        if (time.current < 2) {
            speed.current = THREE.MathUtils.lerp(speed.current, 50, delta * 2);
        }
        // Cruise
        else if (time.current < 4) {
            speed.current = 50;
        }
        // Decelerate & End
        else {
            speed.current = THREE.MathUtils.lerp(speed.current, 0, delta * 5);
            if (speed.current < 0.1 && time.current > 4.5) {
                onComplete();
            }
        }
    });

    return (
        <>
            <color attach="background" args={['#000000']} />

            {/* 1. The Tunnel of Stars */}
            <StarTunnel speed={speed} />

            {/* 2. Central Light (Destination) */}
            <mesh position={[0, 0, -100]}>
                <circleGeometry args={[5, 32]} />
                <meshBasicMaterial color="#fff" toneMapped={false} />
            </mesh>

            {/* 3. Post Processing for Speed Effect */}
            <EffectComposer>
                <Bloom intensity={2} luminanceThreshold={0.5} radius={0.8} />
                <ChromaticAberration
                    offset={new THREE.Vector2(0.005, 0.005)}
                    radialModulation={true}
                    modulationOffset={0.5}
                />
            </EffectComposer>
        </>
    );
};

const StarTunnel = ({ speed }: { speed: React.MutableRefObject<number> }) => {
    const count = 2000;
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 50,
            z: Math.random() * -200, // Deep into screen
            speedOffset: Math.random() * 0.5 + 0.5
        }));
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        const currentSpeed = speed.current;

        particles.forEach((p, i) => {
            // Move particle towards camera (positive Z)
            p.z += currentSpeed * p.speedOffset * delta * 10;

            // Loop back
            if (p.z > 10) {
                p.z = -200;
                p.x = (Math.random() - 0.5) * 50;
                p.y = (Math.random() - 0.5) * 50;
            }

            dummy.position.set(p.x, p.y, p.z);

            // Stretch based on speed (Star Wars effect)
            const stretch = Math.max(1, currentSpeed * 2);
            dummy.scale.set(0.1, 0.1, stretch);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
        </instancedMesh>
    );
};
