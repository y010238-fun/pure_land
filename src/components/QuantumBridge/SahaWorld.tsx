import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const SahaWorld = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const wireframeRef = useRef<THREE.Mesh>(null!);
    const atmosphereRef = useRef<THREE.Mesh>(null!);

    // 程序化地形 Shader - 使用 FBM (Fractal Brownian Motion)
    const terrainShader = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uOceanColor: { value: new THREE.Color('#0a1628') },
            uOceanHighlight: { value: new THREE.Color('#1e3a5f') },
            uLandColor: { value: new THREE.Color('#2d3748') },
            uAtmosphereColor: { value: new THREE.Color('#06b6d4') },
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;

            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uOceanColor;
            uniform vec3 uOceanHighlight;
            uniform vec3 uLandColor;
            uniform vec3 uAtmosphereColor;

            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;

            // 簡化版 2D Noise
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);

                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));

                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            // Fractal Brownian Motion
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;

                for (int i = 0; i < 5; i++) {
                    value += amplitude * noise(p * frequency);
                    p *= 2.0;
                    amplitude *= 0.5;
                }

                return value;
            }

            void main() {
                // 生成程序化地形
                float terrain = fbm(vUv * 8.0);
                float landMask = smoothstep(0.42, 0.52, terrain);

                // 海洋顏色 - 深藍帶微光
                vec3 ocean = uOceanColor;
                vec3 oceanGlow = uOceanHighlight;

                // 海洋動態波動
                float wave = sin(vUv.x * 20.0 + uTime) * 0.02;
                wave += sin(vUv.y * 15.0 + uTime * 0.8) * 0.015;
                ocean = mix(ocean, oceanGlow, max(0.0, wave));

                // 大陸顏色 - 荒涼暗色
                vec3 land = uLandColor;

                // 混合海洋和大陸
                vec3 baseColor = mix(ocean, land, landMask);

                // 大氣層 Fresnel 效應
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.5);

                // 青色大氣光暈（象徵苦海）
                vec3 atmosphere = uAtmosphereColor * fresnel * 0.4;

                // 最終顏色
                vec3 finalColor = baseColor + atmosphere;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    }), []);

    useFrame((state) => {
        if (!meshRef.current || !wireframeRef.current) return;
        const t = state.clock.getElapsedTime();

        // 更新 Shader uniforms
        if (meshRef.current.material instanceof THREE.ShaderMaterial) {
            meshRef.current.material.uniforms.uTime.value = t;
        }

        // 沉重的旋轉（象徵輪迴的滯重）
        const jitter = Math.sin(t * 8) * 0.015;
        meshRef.current.rotation.y += 0.003 + jitter;
        meshRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;

        // 同步線框
        wireframeRef.current.rotation.copy(meshRef.current.rotation);
        wireframeRef.current.scale.setScalar(1.04 + Math.sin(t * 4) * 0.015);

        // 大氣層脈動
        if (atmosphereRef.current) {
            atmosphereRef.current.scale.setScalar(1.06 + Math.sin(t * 2) * 0.01);
        }
    });

    return (
        <group position={position}>
            {/* 1. Core with Procedural Terrain (程序化地形核心) */}
            <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                <shaderMaterial
                    attach="material"
                    {...terrainShader}
                />
            </Sphere>

            {/* 2. Holographic Wireframe Shell (全息線框殼) */}
            <Sphere ref={wireframeRef} args={[1.5, 24, 24]}>
                <meshBasicMaterial
                    color="#06b6d4"
                    wireframe
                    transparent
                    opacity={0.18}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>

            {/* 3. Atmosphere Glow (大氣層光暈) */}
            <Sphere ref={atmosphereRef} args={[1.6, 32, 32]}>
                <meshBasicMaterial
                    color="#06b6d4"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>

            {/* 4. Orbital Rings (軌道環) */}
            <group rotation={[0, 0, Math.PI / 3]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.9, 1.93, 64]} />
                    <meshBasicMaterial
                        color="#06b6d4"
                        transparent
                        opacity={0.15}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2.1, 2.12, 64]} />
                    <meshBasicMaterial
                        color="#06b6d4"
                        transparent
                        opacity={0.1}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>
        </group>
    );
};
