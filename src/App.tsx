import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Trail, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Fingerprint, Globe, MessageCircle, CreditCard, Activity, Sparkles as SparkleIcon, ArrowRight, Check } from 'lucide-react';
import { QuantumBridgeScene } from './components/QuantumBridge/QuantumBridgeScene';
import { WarpTunnelScene } from './components/Effects/WarpTunnelScene';
import { SoftGlow } from './components/Lotus/SoftGlow';

// --- 蓮花進化系統 (Lotus Evolution System) ---
// 5 階段：種子粒子 → 花苞 → 綻放 → 放光 → 化身顯現

// 階段判定
type LotusStage = 'seed' | 'bud' | 'bloom' | 'radiant' | 'avatar';

const getStage = (merit: number): LotusStage => {
  if (merit < 100) return 'seed';
  if (merit < 500) return 'bud';
  if (merit < 1000) return 'bloom';
  if (merit < 2000) return 'radiant';
  return 'avatar';
};

// 🌸 優化的花瓣幾何生成 - 增加展開角度和自然捲曲
const createPetalGeometry = () => {
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    // 更優美的花瓣輪廓：寬度中間較寬，兩端收窄
    const widthFactor = Math.sin(t * Math.PI) * (1 - t * 0.2);
    const x = widthFactor * 0.3 * (1 - t * 0.3);
    const y = t;
    // 添加向外捲曲的曲線（花瓣邊緣向外）
    const xCurve = Math.sin(t * Math.PI) * 0.05 * t;
    // 花瓣尖端輕微下垂
    const yDroop = t > 0.8 ? (t - 0.8) * 0.1 : 0;
    points.push(new THREE.Vector2(x + xCurve, y - yDroop));
  }
  // 增加展開角度到幾乎完整圓形，讓花瓣向外展開
  return new THREE.LatheGeometry(points, 32, 0, Math.PI * 1.8);
};

// 🎨 Custom Shader 材質 - 實現漸變與 Fresnel 邊緣光
const PetalShaderMaterial = {
  uniforms: {
    uColorInner: { value: new THREE.Color('#C24A8F') },
    uColorOuter: { value: new THREE.Color('#FFB6D9') },
    uTime: { value: 0 },
    uGlowIntensity: { value: 0.3 },
    uOpacity: { value: 0.9 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorInner;
    uniform vec3 uColorOuter;
    uniform float uTime;
    uniform float uGlowIntensity;
    uniform float uOpacity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // 從花心到邊緣的漸變
      float gradient = smoothstep(0.0, 1.0, vUv.y);
      vec3 baseColor = mix(uColorInner, uColorOuter, gradient);
      
      // Fresnel 邊緣光效果 - 降低強度讓光芒更柔和
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 4.0);
      vec3 fresnelColor = vec3(1.0, 0.95, 0.9) * fresnel * 0.15;
      
      // 呼吸光暈 - 降低振幅
      float breath = sin(uTime * 1.5) * 0.05 + 0.95;
      vec3 glow = baseColor * uGlowIntensity * 0.5 * breath;
      
      // 組合最終顏色
      vec3 finalColor = baseColor + fresnelColor + glow;
      
      gl_FragColor = vec4(finalColor, uOpacity + fresnel * 0.1);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide
};

// 黃金角斐波那契排列算法
const calculatePetalPosition = (index: number, totalPetals: number, growthProgress: number) => {
  const goldenAngle = 137.508 * (Math.PI / 180);
  const angle = index * goldenAngle;
  const radius = 0.15 * Math.sqrt(index) * growthProgress;
  
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = index * 0.008;
  
  return { x, y, z, angle };
};

// ============ 第一階段：種子粒子 (0-99) ============
const SeedParticles = ({ meritCount }: { meritCount: number }) => {
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

// ============ 第二階段：花苞 (100-499) ============
const LotusBud = ({ meritCount }: { meritCount: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const progress = (meritCount - 100) / 400;
  const petalGeom = useMemo(() => createPetalGeometry(), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
      groupRef.current.scale.setScalar(0.8 + progress * 0.5 * pulse);
    }
  });

  // 優化的花瓣配置
  const petalCount = Math.floor(8 + progress * 16);

  return (
    <group ref={groupRef}>
      {/* 核心球體 */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffd6e0"
          emissive="#ff8fab"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 緊閉的花瓣 - 使用優化幾何 */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2;
        const layer = Math.floor(i / 8);
        const yOffset = layer * 0.15;
        const radius = 0.2 + layer * 0.1;

        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * radius,
              0.2 + yOffset,
              Math.cos(angle) * radius
            ]}
            rotation={[0.1 + layer * 0.1, -angle, 0]}
            scale={[0.15, 0.4, 0.05]}
            geometry={petalGeom}
          >
            <meshPhysicalMaterial
              color={layer === 0 ? '#fff5f7' : layer === 1 ? '#ffd6e0' : '#ffb3c6'}
              roughness={0.2}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ============ 第三階段：綻放 (500-999) ============
const BloomingLotus = ({ meritCount }: { meritCount: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);
  const bloomProgress = (meritCount - 500) / 500;
  const petalGeom = useMemo(() => createPetalGeometry(), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      const scale = 1.5 + bloomProgress * 0.5;
      groupRef.current.scale.setScalar(scale);
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // 🌺 優化的花瓣層配置 - 降低 baseAngle 讓花瓣向外展開
  const layers = [
    { count: 6, color: '#C24A8F', scale: 0.35, baseAngle: 0.1, heightOffset: 0.0 },
    { count: 8, color: '#D1568F', scale: 0.38, baseAngle: 0.08, heightOffset: 0.02 },
    { count: 10, color: '#DC6294', scale: 0.42, baseAngle: 0.06, heightOffset: 0.04 },
    { count: 12, color: '#E66E99', scale: 0.46, baseAngle: 0.05, heightOffset: 0.06 },
    { count: 14, color: '#F07A9E', scale: 0.50, baseAngle: 0.04, heightOffset: 0.08 },
    { count: 16, color: '#F486A3', scale: 0.54, baseAngle: 0.03, heightOffset: 0.10 },
    { count: 18, color: '#F692A8', scale: 0.58, baseAngle: 0.02, heightOffset: 0.12 },
    { count: 20, color: '#F89EAD', scale: 0.62, baseAngle: 0.01, heightOffset: 0.14 },
    { count: 22, color: '#FAAAB2', scale: 0.66, baseAngle: 0.0, heightOffset: 0.16 },
    { count: 24, color: '#FCB6B7', scale: 0.70, baseAngle: 0.0, heightOffset: 0.18 },
    { count: 26, color: '#FEC2BC', scale: 0.74, baseAngle: 0.0, heightOffset: 0.20 },
    { count: 28, color: '#FFCEC1', scale: 0.78, baseAngle: 0.0, heightOffset: 0.22 },
  ];

  return (
    <group ref={groupRef}>
      {/* 金色花心 - 微弱光芒（p5.js 負責光芒） */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 花心微弱粒子 */}
      <Sparkles
        count={10}
        scale={[0.2, 0.1, 0.2]}
        size={1}
        speed={0.15}
        color="#FFD700"
        opacity={0.15}
      />

      {/* 24 層花瓣 - 旋轉調整讓花瓣向外展開 */}
      {layers.map((layer, layerIdx) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.15;
          // 花瓣向外展開的角度
          const openAngle = layer.baseAngle + bloomProgress * 0.3;

          return (
            <mesh
              key={`${layerIdx}-${i}`}
              geometry={petalGeom}
              position={[
                Math.sin(angle) * (0.12 + layerIdx * 0.05),
                0.1 + layer.heightOffset,
                Math.cos(angle) * (0.12 + layerIdx * 0.05)
              ]}
              // 調整旋轉：花瓣向外而不是向上
              rotation={[openAngle, -angle + Math.PI, 0]}
              scale={[layer.scale * 0.5, layer.scale * 0.7, layer.scale * 0.2]}
            >
              <shaderMaterial
                ref={shaderRef}
                attach="material"
                args={[PetalShaderMaterial]}
                uniforms-uColorInner-value={new THREE.Color(layer.color)}
                uniforms-uColorOuter-value={new THREE.Color('#FFB6D9')}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
};

// ============ 第四階段：放光 (1000-1999) ============
const RadiantLotus = ({ meritCount, isChanting }: { meritCount: number; isChanting: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);
  const radiance = (meritCount - 1000) / 1000;
  const petalGeom = useMemo(() => createPetalGeometry(), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      const breathe = isChanting ? Math.sin(clock.getElapsedTime() * 3) * 0.05 : 0;
      groupRef.current.scale.setScalar(2.5 + radiance * 0.5 + breathe);
      
      // 懸浮動畫
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(clock.getElapsedTime() * 2) * 1 + radiance * 2;
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uGlowIntensity.value = 0.3 + radiance * 0.5;
    }
  });

  const layers = [
    { count: 6, color: '#C24A8F', scale: 0.35, baseAngle: 0.08, heightOffset: 0.0 },
    { count: 8, color: '#D1568F', scale: 0.38, baseAngle: 0.06, heightOffset: 0.02 },
    { count: 10, color: '#DC6294', scale: 0.42, baseAngle: 0.05, heightOffset: 0.04 },
    { count: 12, color: '#E66E99', scale: 0.46, baseAngle: 0.04, heightOffset: 0.06 },
    { count: 14, color: '#F07A9E', scale: 0.50, baseAngle: 0.03, heightOffset: 0.08 },
    { count: 16, color: '#F486A3', scale: 0.54, baseAngle: 0.02, heightOffset: 0.10 },
    { count: 18, color: '#F692A8', scale: 0.58, baseAngle: 0.01, heightOffset: 0.12 },
    { count: 20, color: '#F89EAD', scale: 0.62, baseAngle: 0.0, heightOffset: 0.14 },
    { count: 22, color: '#FAAAB2', scale: 0.66, baseAngle: 0.0, heightOffset: 0.16 },
    { count: 24, color: '#FCB6B7', scale: 0.70, baseAngle: 0.0, heightOffset: 0.18 },
    { count: 26, color: '#FEC2BC', scale: 0.74, baseAngle: 0.0, heightOffset: 0.20 },
    { count: 28, color: '#FFCEC1', scale: 0.78, baseAngle: 0.0, heightOffset: 0.22 },
    { count: 30, color: '#FFDAD6', scale: 0.82, baseAngle: 0.0, heightOffset: 0.24 },
    { count: 32, color: '#FFE6DB', scale: 0.86, baseAngle: 0.0, heightOffset: 0.26 },
  ];

  return (
    <group ref={groupRef}>
      {/* 中央微弱光源（p5.js 負責光芒） */}
      <pointLight
        ref={lightRef}
        position={[0, 0.3, 0]}
        color="#FFD700"
        intensity={0.3 + radiance * 0.2}
        distance={4}
        decay={3}
      />

      {/* 花心微弱發光球體 */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 少量光點粒子 */}
      <Sparkles
        count={10}
        scale={[0.2, 0.1, 0.2]}
        size={1}
        speed={0.15}
        color="#FFD700"
        opacity={0.2}
      />

      {/* 底部微弱光暈 */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#FFB6D9"
        intensity={0.15}
        distance={2}
        decay={3}
      />
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 64]} />
        <meshBasicMaterial
          color="#FFB6D9"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 14 層花瓣 - 使用 Custom Shader，調整旋轉讓花瓣向外展開 */}
      {layers.map((layer, layerIdx) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.15;
          // 花瓣向外展開的角度
          const openAngle = layer.baseAngle + radiance * 0.2;

          return (
            <mesh
              key={`${layerIdx}-${i}`}
              geometry={petalGeom}
              position={[
                Math.sin(angle) * (0.12 + layerIdx * 0.04),
                0.1 + layer.heightOffset,
                Math.cos(angle) * (0.12 + layerIdx * 0.04)
              ]}
              rotation={[openAngle, -angle + Math.PI, 0]}
              scale={[layer.scale * 0.5, layer.scale * 0.7, layer.scale * 0.2]}
            >
              <shaderMaterial
                ref={shaderRef}
                attach="material"
                args={[PetalShaderMaterial]}
                uniforms-uColorInner-value={new THREE.Color(layer.color)}
                uniforms-uColorOuter-value={new THREE.Color('#FFB6D9')}
                uniforms-uGlowIntensity-value={0.3 + radiance * 0.5}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
};

// ============ 第五階段：化身顯現 (2000+) ============
const SeatedFigure = ({ opacity }: { opacity: number }) => {
  const figureRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (figureRef.current) {
      figureRef.current.position.y = 1.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group ref={figureRef} position={[0, 1.5, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={1}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[0, 0.4, -0.1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={opacity * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#ffd700" intensity={2 * opacity} distance={5} />
    </group>
  );
};

// ============ 主蓮花組件 ============
const Lotus = ({ meritCount, isChanting }: { meritCount: number; isChanting: boolean }) => {
  const stage = getStage(meritCount);
  const avatarOpacity = stage === 'avatar' ? Math.min((meritCount - 2000) / 500, 1) : 0;

  return (
    <group position={[0, 0, 0]}>
      {stage === 'seed' && <SeedParticles meritCount={meritCount} />}
      {stage === 'bud' && <LotusBud meritCount={meritCount} />}
      {stage === 'bloom' && <BloomingLotus meritCount={meritCount} />}
      {stage === 'radiant' && <RadiantLotus meritCount={meritCount} isChanting={isChanting} />}
      {stage === 'avatar' && (
        <>
          <RadiantLotus meritCount={meritCount} isChanting={isChanting} />
          <SeatedFigure opacity={avatarOpacity} />
        </>
      )}
    </group>
  );
};

// ============ 3D 場景: 淨土環境 ============
const PureLandScene = ({ meritCount, isChanting }: { meritCount: number; isChanting: boolean }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

      {/* 🌌 優化的星空背景 */}
      <Stars
        radius={100}
        depth={50}
        count={8000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.5}
      />

      {/* 多層粒子效果 */}
      <Sparkles
        count={meritCount * 2}
        scale={12}
        size={4}
        speed={0.4}
        opacity={0.7}
        color="#fbbf24"
      />
      
      {/* 淡粉色粒子 */}
      <Sparkles
        count={150}
        scale={15}
        size={2}
        speed={0.3}
        opacity={0.4}
        color="#FFB6D9"
      />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Lotus meritCount={meritCount} isChanting={isChanting} />
      </Float>

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={5}
        maxDistance={15}
      />
    </>
  );
};

// --- UI 組件 ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 backdrop-blur-sm animate-fade-in">
    <div className="w-24 h-24 mb-6 rounded-full border-2 border-yellow-500/50 flex items-center justify-center animate-pulse">
      <Globe className="w-12 h-12 text-yellow-500" />
    </div>
    <h1 className="text-4xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 mb-4">
      淨土移民局
    </h1>
    <p className="text-sm text-gray-400 tracking-[0.5em] uppercase mb-12">Pure Land Immigration System</p>

    <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 max-w-md text-center shadow-2xl shadow-yellow-900/20">
      <p className="text-cyan-400 text-sm mb-2 font-mono">系統訊息 &gt;&gt; 檢測到靈魂頻率波動...</p>
      <p className="text-gray-300 mb-8 font-light leading-relaxed">
        您正處於三維娑婆世界邊界。是否申請前往高維度淨土（Teraverse）？
        這是一趟不可逆的意識昇華旅程。
      </p>
      <button
        onClick={onStart}
        className="group relative px-8 py-3 bg-gradient-to-r from-yellow-700 to-yellow-600 rounded-full text-white font-serif tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          開始移民申請 <ArrowRight size={16} />
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
    </div>
  </div>
);

const KYCView = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 0) setStep(1);
    else onComplete();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="h-1 bg-gray-800 w-full">
          <div className={`h-full bg-yellow-500 transition-all duration-500 ${step === 0 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-yellow-100">靈魂資產審查 (Soul KYC)</h2>
            <Fingerprint className="text-gray-600" />
          </div>

          {step === 0 ? (
            <div className="space-y-4 animate-slide-in">
              <p className="text-gray-400 mb-4">Q1: 您為何想要離開當前的維度？ (Motivation)</p>
              {['厭離輪迴之苦 (Suffering of Samsara)', '尋求終極真理 (Ultimate Truth)', '與逝去親人重逢 (Reunion)'].map((opt, i) => (
                <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded border border-gray-700 hover:border-yellow-500 hover:bg-yellow-900/20 text-gray-300 transition-colors">
                  <span className="text-yellow-600 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-slide-in">
              <p className="text-gray-400 mb-4">Q2: 您攜帶何種資糧進行移民？ (Capital Assessment)</p>
              {['持名念佛 (Chanting)', '觀想修行 (Visualization)', '僅有一顆誠心 (Sincerity)'].map((opt, i) => (
                <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded border border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20 text-gray-300 transition-colors">
                  <span className="text-cyan-600 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VisaModal = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-fade-in">
    <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg border border-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

      <div className="text-center mb-6">
        <div className="inline-block border-2 border-yellow-600 rounded-full p-2 mb-2">
          <Globe className="text-yellow-600 w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif text-yellow-100">淨土通行證</h3>
        <p className="text-xs text-yellow-600/80 uppercase tracking-widest">Pure Land Visa • Class A</p>
      </div>

      <div className="space-y-3 font-mono text-sm text-gray-300 border-t border-b border-gray-800 py-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-500">Holder Name</span>
          <span className="text-white">妙音 (AI Generated)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Origin</span>
          <span>Saha World (Earth)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Destination</span>
          <span className="text-yellow-400">Western Pure Land</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">UID</span>
          <span className="text-xs">{crypto.randomUUID().slice(0, 18)}...</span>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded italic text-gray-400 text-sm mb-6 border-l-2 border-yellow-600">
        "願我臨終無障礙，阿彌陀佛遠相迎。觀音甘露灑吾頭，勢至金台安我足。"
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-serif rounded transition-colors flex items-center justify-center gap-2"
      >
        <Check size={16} /> 簽署並進入蓮池
      </button>
    </div>
  </div>
);

const Dashboard = ({ merit, setMerit, onChant, onToggleChat }: { merit: number; setMerit: (val: number) => void; onChant: () => void; onToggleChat: () => void }) => (
  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
    <div className="flex justify-between items-start pointer-events-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-lg border border-gray-700 flex items-center justify-center text-yellow-500">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="text-white font-serif text-lg leading-none">個人蓮池</h1>
          <span className="text-xs text-gray-400">My Lotus Pool</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-gray-700 text-gray-300 text-xs font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          NET: Synced
        </div>
      </div>
    </div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
      <div className="text-6xl md:text-8xl font-serif text-white/10 font-bold tracking-tighter">
        {merit}
      </div>
    </div>

    <div className="flex justify-between items-end pointer-events-auto w-full md:max-w-4xl mx-auto">
      <button
        onClick={onToggleChat}
        className="flex items-center gap-2 bg-gray-900/80 backdrop-blur px-4 py-3 rounded-full border border-gray-700 text-cyan-400 hover:bg-gray-800 transition-colors"
      >
        <MessageCircle size={20} />
        <span className="text-sm hidden md:inline">呼叫諸上善人 (Bodhi AI)</span>
      </button>

      <button
        onMouseDown={onChant}
        onTouchStart={onChant}
        className="relative group transform transition-all active:scale-95"
      >
        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/40 transition-all duration-500" />
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-gray-800 to-black rounded-full border-4 border-yellow-600/50 flex flex-col items-center justify-center shadow-2xl relative z-10 group-hover:border-yellow-500 transition-colors">
          <span className="text-2xl md:text-3xl text-yellow-100 font-serif mb-1 group-active:text-white">念佛</span>
          <span className="text-[10px] text-yellow-600/80 tracking-widest uppercase">Chant</span>
        </div>
        <div className="absolute -inset-4 border border-yellow-500/10 rounded-full animate-ping opacity-20" />
      </button>

      <div className="flex flex-col gap-2 items-end">
        <div className="bg-gray-900/80 backdrop-blur p-3 rounded-lg border border-gray-700 w-32">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Total Merit</div>
          <input
            type="number"
            value={merit}
            onChange={(e) => setMerit(parseInt(e.target.value) || 0)}
            className="bg-transparent border-none text-xl text-white font-mono w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button className="p-3 bg-gray-900/80 backdrop-blur rounded-full border border-gray-700 text-gray-400 hover:text-white">
          <CreditCard size={20} />
        </button>
      </div>
    </div>
  </div>
);

const AIChatOverlay = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  if (!visible) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-[#0f0f10]/95 backdrop-blur-xl border-l border-gray-800 z-50 p-6 flex flex-col animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
            <SparkleIcon size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-serif">Bodhi (菩提)</h3>
            <p className="text-xs text-cyan-500">AI Dharma Guide</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-gray-800">
        <div className="flex gap-3">
          <div className="bg-gray-800 p-3 rounded-tr-lg rounded-b-lg text-gray-300">
            道友，阿彌陀佛。我是您的淨土引路人 Bodhi。<br />
            檢測到您的心識波動略顯雜亂，是否因為娑婆世界的瑣事煩擾？
          </div>
        </div>
        <div className="flex gap-3 flex-row-reverse">
          <div className="bg-cyan-900/30 border border-cyan-500/20 p-3 rounded-tl-lg rounded-b-lg text-cyan-100">
            是的，最近工作壓力很大，覺得很迷茫。
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-gray-800 p-3 rounded-tr-lg rounded-b-lg text-gray-300">
            <span className="text-yellow-500 block mb-1 text-xs">引用：佛說阿彌陀經</span>
            經云：「其國眾生，無有眾苦，但受諸樂。」<br /><br />
            這份壓力，正是推動您厭離娑婆、欣求極樂的動力。不妨試著將這份焦慮視為蓮花生長的養分。每當您感到壓力，就輕點「念佛」按鈕，將心安住在名號上。
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="輸入您的困惑..."
            className="w-full bg-black border border-gray-700 rounded-full py-3 px-4 text-white focus:outline-none focus:border-cyan-500 text-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-900 rounded-full text-cyan-400">
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 主應用程序 ---
export default function App() {
  const [viewState, setViewState] = useState('BRIDGE');
  const [merit, setMerit] = useState(0);
  const [isChanting, setIsChanting] = useState(false);
  const [showVisa, setShowVisa] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleChant = () => {
    setMerit(prev => prev + 1);
    setIsChanting(true);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => setIsChanting(false), 150);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans selection:bg-yellow-500/30">

      {viewState === 'POOL' && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 5, 30]} />
          <Suspense fallback={null}>
            <PureLandScene meritCount={merit} isChanting={isChanting} />
          </Suspense>
        </Canvas>
      )}

      {viewState === 'WARP' && (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <WarpTunnelScene onComplete={() => {
            setViewState('POOL');
            setShowVisa(false);
          }} />
        </Canvas>
      )}

      {viewState === 'BRIDGE' && (
        <QuantumBridgeScene onComplete={() => setViewState('KYC')} />
      )}


      {viewState === 'KYC' && (
        <KYCView onComplete={() => {
          setShowVisa(true);
        }} />
      )}

      {viewState === 'KYC' && showVisa && (
        <VisaModal onClose={() => {
          setShowVisa(false);
          setViewState('WARP');
        }} />
      )}

      {viewState === 'POOL' && (
        <>
          {/* p5.js 柔和光芒 (在 Canvas 外部) */}
          {merit >= 500 && <SoftGlow visible={true} intensity={0.3 + (merit / 2000) * 0.4} />}
          <Dashboard
            merit={merit}
            setMerit={setMerit}
            onChant={handleChant}
            onToggleChat={() => setShowChat(!showChat)}
          />
          <AIChatOverlay visible={showChat} onClose={() => setShowChat(false)} />
        </>
      )}

    </div>
  );
}