import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SahaWorld } from './SahaWorld';
import { PureLandWorld } from './PureLandWorld';
import { EntanglementParticles } from './EntanglementParticles';
import { EntanglementControl } from '../UI/EntanglementControl';

export const QuantumBridgeScene = ({ onComplete }: { onComplete: () => void }) => {
    const [strength, setStrength] = useState(0);
    const [isPressing, setIsPressing] = useState(false);

    // Audio placeholders
    const audioContextRef = useRef<AudioContext | null>(null);

    // Interaction Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPressing) {
            interval = setInterval(() => {
                setStrength(prev => {
                    const newValue = prev + 0.005;
                    if (newValue >= 1) {
                        clearInterval(interval);
                        return 1;
                    }
                    return newValue;
                });
            }, 16);
        } else {
            // Decay
            interval = setInterval(() => {
                setStrength(prev => Math.max(0, prev - 0.01));
            }, 16);
        }
        return () => clearInterval(interval);
    }, [isPressing]);

    // 當 strength 達到 1 時調用 onComplete (避免在 setState 期間調用)
    useEffect(() => {
        if (strength >= 1) {
            onComplete();
        }
    }, [strength, onComplete]);


    return (
        <div className="relative w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <color attach="background" args={['#000000']} />

                {/* The Void */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={strength * 5} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
                <pointLight position={[-10, 5, 0]} intensity={2} color="#00ffff" />

                {/* Scene Content */}
                <BridgeContent strength={strength} />

            </Canvas>

            {/* UI Overlay */}
            <EntanglementControl
                strength={strength}
                onInteractStart={() => setIsPressing(true)}
                onInteractEnd={() => setIsPressing(false)}
            />
        </div>
    );
};

const BridgeContent = ({ strength }: { strength: number }) => {
    const groupRef = useRef<THREE.Group>(null!);

    // Positions
    const sahaPos = new THREE.Vector3(-6, 0, 0);
    const purePos = new THREE.Vector3(6, 0, 0);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Space Folding Effect: Move planets closer as strength increases
        // At strength 1, they should be nearly overlapping or camera zooms in
        const lerpFactor = THREE.MathUtils.smoothstep(strength, 0, 1);

        // Dynamic FOV or Camera Zoom could also assume this effect, 
        // but moving meshes is simpler for now.
        const currentSahaX = THREE.MathUtils.lerp(-6, -2, lerpFactor);
        const currentPureX = THREE.MathUtils.lerp(6, 2, lerpFactor);

        // We can't easily update props of children directly here without context or ref forwarding,
        // so we might need wrapper groups or pass refs. 
        // For simplicity, let's just animate the Group scale or rotation for now, 
        // OR better, move the camera.

        const camera = state.camera;
        camera.position.z = THREE.MathUtils.lerp(15, 6, lerpFactor);

        // Shake effect when close to folding
        if (strength > 0.8) {
            camera.position.x = (Math.random() - 0.5) * 0.1;
            camera.position.y = (Math.random() - 0.5) * 0.1;
        } else {
            camera.position.x = 0;
            camera.position.y = 0;
        }
    });

    return (
        <group ref={groupRef}>
            <SahaWorld position={[-6, 0, 0]} />
            <PureLandWorld position={[6, 0, 0]} connectionStrength={strength} />
            <EntanglementParticles startPos={sahaPos} endPos={purePos} strength={strength} />
        </group>
    );
};
