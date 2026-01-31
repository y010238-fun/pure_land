import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const PureLandWorld = ({ position, connectionStrength }: { position: [number, number, number], connectionStrength: number }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);
    const accretionRef = useRef<THREE.Mesh>(null!);

    // 多元色彩核心 Shader
    const liquidGoldShader = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
        },
        vertexShader: `
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPos;

            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                // 液態波動位移 - 減小波動讓球體更圓
                float displacement = sin(position.y * 2.5 + uTime * 0.6) * 0.02;
                displacement += cos(position.x * 2.0 + uTime * 0.5) * 0.015;
                displacement += sin(position.z * 1.8 + uTime * 0.4) * 0.01;

                vec3 newPos = position + normal * displacement;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPos;

            // HSV 轉 RGB
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                // Fresnel 效應
                vec3 viewDir = normalize(cameraPosition - vWorldPos);
                float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.5);

                // 垂直位置因子（從底部到頂部）
                float verticalFactor = (vPosition.y + 0.5) * 0.9;
                verticalFactor = clamp(verticalFactor, 0.0, 1.0);

                // 動態色彩流動
                float colorFlow = uTime * 0.15;

                // 多層次色彩漸變：深紫 → 深紅 → 橙 → 金 → 黃 → 綠松石 → 白
                vec3 color;
                if (verticalFactor < 0.167) {
                    // 深紫色區域
                    float t = verticalFactor / 0.167;
                    color = mix(vec3(0.4, 0.0, 0.5), vec3(0.6, 0.05, 0.1), t);
                } else if (verticalFactor < 0.333) {
                    // 深紅色區域
                    float t = (verticalFactor - 0.167) / 0.167;
                    color = mix(vec3(0.6, 0.05, 0.1), vec3(0.8, 0.2, 0.0), t);
                } else if (verticalFactor < 0.5) {
                    // 橙色區域
                    float t = (verticalFactor - 0.333) / 0.167;
                    color = mix(vec3(0.8, 0.2, 0.0), vec3(0.9, 0.7, 0.1), t);
                } else if (verticalFactor < 0.667) {
                    // 金色區域
                    float t = (verticalFactor - 0.5) / 0.167;
                    color = mix(vec3(0.9, 0.7, 0.1), vec3(1.0, 0.9, 0.4), t);
                } else if (verticalFactor < 0.833) {
                    // 黃色到綠松石區域
                    float t = (verticalFactor - 0.667) / 0.167;
                    color = mix(vec3(1.0, 0.9, 0.4), vec3(0.2, 0.9, 0.8), t);
                } else {
                    // 綠松石到白色區域
                    float t = (verticalFactor - 0.833) / 0.167;
                    color = mix(vec3(0.2, 0.9, 0.8), vec3(1.0, 0.98, 0.95), t);
                }

                // 添加多層次色相偏移動畫
                float hueShift1 = sin(colorFlow + vPosition.x * 0.3) * 0.08;
                float hueShift2 = cos(colorFlow * 0.7 + vPosition.z * 0.4) * 0.05;
                vec3 hsvColor1 = vec3(hueShift1, 0.8, 1.0);
                vec3 hsvColor2 = vec3(hueShift2, 0.6, 0.9);
                color = mix(color, hsv2rgb(hsvColor1), 0.2);
                color = mix(color, hsv2rgb(hsvColor2), 0.1);

                // 添加徑向色彩變化（從中心向外）
                float radialDist = length(vUv - 0.5);
                vec3 radialColor = vec3(0.95, 0.3, 0.5) * (1.0 - radialDist);
                color = mix(color, radialColor, 0.15);

                // 邊緣發光（金黃色）
                vec3 glow = vec3(1.0, 0.85, 0.4) * fresnel * 1.8;

                vec3 finalColor = color + glow;

                gl_FragColor = vec4(finalColor, 0.93 + fresnel * 0.07);
            }
        `
    }), []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // 更新 Shader uniforms
        if (meshRef.current.material instanceof THREE.ShaderMaterial) {
            meshRef.current.material.uniforms.uTime.value = t;
        }

        // Smooth, divine rotation
        meshRef.current.rotation.y = t * 0.1;
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.PI / 2;
            ringRef.current.rotation.z = -t * 0.05;
            ringRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        }

        // Accretion disk rotation
        if (accretionRef.current) {
            accretionRef.current.rotation.z = t * 0.15;
        }

        // Pulse based on connection
        const scale = 1 + connectionStrength * 0.12;
        meshRef.current.scale.setScalar(scale);

        // Internal glow pulse
        if (glowRef.current) {
            glowRef.current.scale.setScalar(0.6 + Math.sin(t * 2) * 0.05);
            glowRef.current.rotation.y = -t * 0.2;
        }
    });

    return (
        <group position={position}>
            {/* 6. Accretion Disk (吸積盤) */}
            <mesh ref={accretionRef}>
                <ringGeometry args={[2.0, 3.2, 64]} />
                <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.08 + connectionStrength * 0.15}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 1. Liquid Gold Core (液態金色核心) */}
            <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                <shaderMaterial
                    attach="material"
                    {...liquidGoldShader}
                    transparent
                />
            </Sphere>

            {/* 2. Crystal Shell Overlay (琉璃外殼覆蓋層) */}
            <Sphere args={[1.5, 64, 64]}>
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    thickness={0.4}
                    roughness={0.1}
                    chromaticAberration={0.15}
                    anisotropy={0.1}
                    distortion={0.08}
                    distortionScale={0.25}
                    temporalDistortion={0.4}
                    clearcoat={1}
                    attenuationDistance={0.6}
                    attenuationColor="#fbbf24"
                    color="#fbbf24"
                    transparent
                    opacity={0.2}
                />
            </Sphere>

            {/* 3. Internal Divine Light (內在發光核心) */}
            <Sphere ref={glowRef} args={[0.8, 32, 32]}>
                <meshBasicMaterial color="#fffbeb" toneMapped={false} />
            </Sphere>

            {/* 3.5 Outer Golden Halo (外圍金黃光暈 - 第一層) */}
            <Sphere args={[1.9, 32, 32]}>
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>

            {/* 4. Golden Halo Ring (光環) */}
            <mesh ref={ringRef}>
                <torusGeometry args={[2.2, 0.02, 16, 100]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={2.2}
                    toneMapped={false}
                />
            </mesh>

            {/* 5. Radiant Particles (佛光粒子) */}
            <Sparkles
                count={100}
                scale={5}
                size={6}
                speed={0.4}
                color="#fbbf24"
                opacity={0.8}
                noise={0.2}
            />

            {/* 7. Outer Glow (最外層金黃光暈) */}
            <Sphere args={[2.2, 32, 32]}>
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={0.25 + connectionStrength * 0.25}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
};
