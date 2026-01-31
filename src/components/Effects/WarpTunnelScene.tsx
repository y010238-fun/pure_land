import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, ChromaticAberration, Bloom } from '@react-three/postprocessing';

export const WarpTunnelScene = ({ onComplete }: { onComplete: () => void }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
    const destinationRef = useRef<THREE.Mesh>(null!);

    // Animation state
    const speed = useRef(0);
    const time = useRef(0);

    useFrame((state, delta) => {
        time.current += delta;

        // Phase 1: 慢速啟動 (0-1秒) - 速度 0 → 15
        if (time.current < 1) {
            speed.current = THREE.MathUtils.lerp(speed.current, 15, delta * 3);
        }
        // Phase 2: 逐漸加速 (1-2.5秒) - 速度 15 → 60
        else if (time.current < 2.5) {
            speed.current = THREE.MathUtils.lerp(speed.current, 60, delta * 2);
        }
        // Phase 3: 極速衝刺 (2.5-3.5秒) - 速度 60 → 100
        else if (time.current < 3.5) {
            speed.current = THREE.MathUtils.lerp(speed.current, 100, delta * 2.5);
        }
        // Phase 4: 快速減速 (3.5-4秒) - 速度 100 → 30
        else if (time.current < 4) {
            speed.current = THREE.MathUtils.lerp(speed.current, 30, delta * 4);
        }
        // Phase 5: 緩慢滑行至停止 (4-4.5秒) - 速度 30 → 0
        else {
            speed.current = THREE.MathUtils.lerp(speed.current, 0, delta * 3);
            if (speed.current < 0.1 && time.current > 4.5) {
                onComplete();
            }
        }

        // 控制發光星球顯示時機 - 前 3.5 秒隱藏，之後漸入
        if (destinationRef.current && destinationRef.current.material instanceof THREE.MeshBasicMaterial) {
            if (time.current < 3.5) {
                destinationRef.current.material.opacity = 0;
            } else if (time.current < 4) {
                // 3.5-4 秒：透明度 0 → 1 漸入
                const fadeProgress = (time.current - 3.5) / 0.5;
                destinationRef.current.material.opacity = THREE.MathUtils.lerp(0, 1, fadeProgress);
            } else {
                destinationRef.current.material.opacity = 1;
            }
        }
    });

    return (
        <>
            <color attach="background" args={['#000000']} />

            {/* 1. The Tunnel of Stars */}
            <StarTunnel speed={speed} />

            {/* 2. Central Light (Destination) - 最後才顯現 */}
            <mesh ref={destinationRef} position={[0, 0, -100]}>
                <circleGeometry args={[5, 32]} />
                <meshBasicMaterial color="#fff" toneMapped={false} transparent opacity={0} />
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
