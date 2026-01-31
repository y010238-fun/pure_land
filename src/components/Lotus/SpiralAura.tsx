import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// 定義 Spiral Shader Material
const SpiralShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#00ffff'),
        uColorEnd: new THREE.Color('#ff00ff'),
        uIntensity: 0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    uniform float uIntensity;
    varying vec2 vUv;

    #define PI 3.14159265359

    void main() {
      vec2 center = vec2(0.5);
      vec2 pos = vUv - center;
      float r = length(pos) * 2.0; // 0 to 1
      float a = atan(pos.y, pos.x);

      // 螺旋效果
      float spiral = sin(r * 10.0 - a + uTime * 2.0);
      float alpha = smoothstep(0.4, 0.6, spiral);
      
      // 邊緣柔化
      float distMask = 1.0 - smoothstep(0.0, 1.0, r);
      
      // 核心向外漸變
      vec3 color = mix(uColorStart, uColorEnd, r + sin(uTime) * 0.2);
      
      // 添加一些隨機噪聲或星星點點的感覺 (簡單模擬)
      float sparkle = step(0.95, fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453));
      
      // 最終顏色與透明度
      float finalAlpha = (alpha * 0.3 + sparkle * 0.5) * distMask * uIntensity;
      
      gl_FragColor = vec4(color + sparkle, finalAlpha);
    }
  `
);

extend({ SpiralShaderMaterial });

// 讓 TypeScript 知道這個 intrinsic element 存在
declare global {
    namespace JSX {
        interface IntrinsicElements {
            spiralShaderMaterial: any;
        }
    }
}

interface SpiralAuraProps {
    meritCount: number;
}

export const SpiralAura = ({ meritCount }: SpiralAuraProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<any>(null!); // 使用 any 避免 TS 對自定義 shader material 的報錯
    const particlesRef = useRef<THREE.Points>(null!);

    // 計算當前顏色與強度
    const { colorStart, colorEnd, intensity, scale } = useMemo(() => {
        let s = new THREE.Color('#00ffff'); // Cyan
        let e = new THREE.Color('#0000ff'); // Blue
        let i = Math.min(Math.max((meritCount - 100) / 500, 0), 1); // 100聲開始顯現
        let sz = 1 + meritCount / 2000;

        if (meritCount >= 500 && meritCount < 1500) {
            // Pink/Purple phase
            const t = (meritCount - 500) / 1000;
            s.lerp(new THREE.Color('#ff00ff'), t);
            e.lerp(new THREE.Color('#800080'), t);
            i = 1;
        } else if (meritCount >= 1500) {
            // Golden phase
            const t = Math.min((meritCount - 1500) / 1000, 1);
            s.set('#ff00ff').lerp(new THREE.Color('#ffd700'), t);
            e.set('#800080').lerp(new THREE.Color('#ffaa00'), t);
            i = 1 + t * 0.5; // 更亮
        }

        return { colorStart: s, colorEnd: e, intensity: i, scale: sz };
    }, [meritCount]);

    // 粒子系統數據
    const particleCount = 100;
    const particles = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const r = 0.5 + Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            pos[i * 3] = r * Math.cos(theta); // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // y (flat)
            pos[i * 3 + 2] = r * Math.sin(theta); // z

            sizes[i] = Math.random();
            speeds[i] = 0.2 + Math.random() * 0.5;
        }
        return { pos, sizes, speeds };
    }, []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        // 更新 Shader
        if (materialRef.current) {
            materialRef.current.uTime = time;
            materialRef.current.uColorStart = colorStart;
            materialRef.current.uColorEnd = colorEnd;
            materialRef.current.uIntensity = intensity;
        }

        // 更新粒子旋轉
        if (particlesRef.current) {
            particlesRef.current.rotation.y = -time * 0.2; // 反向旋轉增添層次

            // 粒子呼吸效果
            // 這裡可以做更複雜的粒子更新，如果需要的話
        }

        // 整體縮放
        if (meshRef.current) {
            // 緩慢旋轉整個光暈
            meshRef.current.rotation.z = time * 0.1;
            meshRef.current.scale.setScalar(scale);
        }
    });

    if (intensity <= 0) return null;

    return (
        <group position={[0, -0.2, 0]}>
            {/* 螺旋光暈 */}
            <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3, 3]} />
                {/* @ts-ignore */}
                <spiralShaderMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* 底部旋轉粒子 */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
                    <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color={colorStart}
                    transparent
                    opacity={intensity * 0.5}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};
