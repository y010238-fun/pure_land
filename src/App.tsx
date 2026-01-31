import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Trail, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Fingerprint, Globe, MessageCircle, CreditCard, Activity, Sparkles as SparkleIcon, ArrowRight, Check } from 'lucide-react';
import { QuantumBridgeScene } from './components/QuantumBridge/QuantumBridgeScene';
import { WarpTunnelScene } from './components/Effects/WarpTunnelScene';

// --- 3D 組件: 程式化蓮花 (Procedural Lotus) ---
// 重新設計：分層結構 + 曲線花瓣 + 顏色漸變

// 創建花瓣幾何 - 使用 LatheGeometry 產生自然曲線（更圓潤）
const createPetalGeometry = () => {
  const points = [
    new THREE.Vector2(0, 0),       // 基部
    new THREE.Vector2(0.15, 0.1),  // 下彎曲 - 更寬
    new THREE.Vector2(0.25, 0.35), // 中段膨起 - 更圓
    new THREE.Vector2(0.22, 0.6),  // 上段 - 保持寬度
    new THREE.Vector2(0.12, 0.85), // 接近尖端 - 緩慢收窄
    new THREE.Vector2(0.03, 0.97), // 圓潤尖端
    new THREE.Vector2(0, 1.0),     // 尖端閉合
  ];
  return new THREE.LatheGeometry(points, 16, 0, Math.PI); // 更多分段讓曲線更滑順
};

// 花瓣層級配置 - 調整為更大尺寸和正確的展開角度
const PETAL_LAYERS = [
  { count: 6, baseAngle: 0.3, radius: 0.15, scale: 0.6, yOffset: 0.15, color: '#fff5f7' },   // 內層 - 最淺，幾乎直立
  { count: 10, baseAngle: 0.6, radius: 0.35, scale: 0.8, yOffset: 0.08, color: '#ffd6e0' },  // 中內層
  { count: 14, baseAngle: 0.9, radius: 0.55, scale: 1.0, yOffset: 0, color: '#ffb3c6' },     // 中外層
  { count: 18, baseAngle: 1.2, radius: 0.75, scale: 1.15, yOffset: -0.05, color: '#ff8fab' }, // 外層 - 最深，展開最大
];

// 單片花瓣組件
const Petal = ({
  position,
  rotation,
  scale,
  color,
  geometry
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  geometry: THREE.BufferGeometry;
}) => {
  return (
    <mesh position={position} rotation={rotation} scale={[scale * 1.0, scale * 1.2, scale * 0.15]} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        roughness={0.3}
        metalness={0.1}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};

// 花蕊組件 (金色中心)
const Stamen = () => {
  const stamenRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (stamenRef.current) {
      stamenRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={stamenRef} position={[0, 0.2, 0]}>
      {/* 中心圓球 */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* 小花蕊點 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 0.1;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.1, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ffcc00" emissive="#ff8800" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

// 主蓮花組件
const Lotus = ({ meritCount, isChanting }: { meritCount: number; isChanting: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const petalGeometry = useMemo(() => createPetalGeometry(), []);

  // 計算開放程度 (0-1)，現在調整為 0-1000 逐漸綻放
  const bloomLevel = useMemo(() => Math.min(meritCount / 1000, 1), [meritCount]);

  // 計算額外的成長比率 (功德越高，蓮花越大，但不封頂，使用對數生長)
  const growthScale = useMemo(() => 1 + Math.log10(meritCount / 50 + 1) * 0.5, [meritCount]);

  // 動態呼吸效果
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const breathe = isChanting ? Math.sin(clock.getElapsedTime() * 3) * 0.02 : 0;
      // 組合：基礎 2.5倍 * 生長比率 * 呼吸
      groupRef.current.scale.setScalar(2.5 * growthScale * (1 + breathe));
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // 生成花瓣
  const petals = useMemo(() => {
    const result: React.ReactElement[] = [];
    let petalIndex = 0;

    // 增加第五層：只有功德較高時才顯現
    const layers = [...PETAL_LAYERS];
    if (meritCount > 200) {
      layers.push({
        count: 24,
        baseAngle: 1.45,
        radius: 1.0,
        scale: 1.3,
        yOffset: -0.15,
        color: '#ff758f' // 更深的顏色
      });
    }

    layers.forEach((layer, layerIndex) => {
      // 根據功德與層次決定花瓣數量
      // 讓內層先長出來，外層隨功德增加
      const layerActivation = Math.max(0, Math.min(1, (meritCount - (layerIndex * 50)) / 100));
      const visibleCount = Math.ceil(layer.count * Math.max(0.2, layerActivation));

      for (let i = 0; i < visibleCount; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + layerIndex * 0.15;
        // 綻放角度：隨功德增加而張開
        const openAngle = layer.baseAngle * (0.4 + bloomLevel * 0.6);

        const x = Math.sin(angle) * layer.radius;
        const z = Math.cos(angle) * layer.radius;
        const y = layer.yOffset;

        result.push(
          <Petal
            key={petalIndex++}
            position={[x, y, z]}
            rotation={[openAngle, -angle + Math.PI, 0]}
            scale={layer.scale}
            color={layer.color}
            geometry={petalGeometry}
          />
        );
      }
    });

    return result;
  }, [petalGeometry, bloomLevel, meritCount]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {petals}
      <Stamen />
    </group>
  );
};


// --- 3D 場景: 淨土環境 ---
const PureLandScene = ({ meritCount, isChanting }: { meritCount: number; isChanting: boolean }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* 粒子流特效 (象徵願力/功德) */}
      <Sparkles
        count={meritCount * 2}
        scale={12}
        size={4}
        speed={0.4}
        opacity={0.7}
        color="#fbbf24" // Amber/Gold
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

// 1. 登陸頁面 (The Arrival)
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

// 2. 靈魂 KYC (Soul KYC)
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

// 3. 簽證與發願文生成 (Visa Modal)
const VisaModal = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-fade-in">
    <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg border border-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] p-6 relative overflow-hidden">
      {/* 裝飾性背景紋理 */}
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

// 4. 主介面 (Main Dashboard)
const Dashboard = ({ merit, setMerit, onChant, onToggleChat }: { merit: number; setMerit: (val: number) => void; onChant: () => void; onToggleChat: () => void }) => (
  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
    {/* 頂部導航 */}
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

    {/* 中間功德計數 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
      <div className="text-6xl md:text-8xl font-serif text-white/10 font-bold tracking-tighter">
        {merit}
      </div>
    </div>

    {/* 底部控制區 */}
    <div className="flex justify-between items-end pointer-events-auto w-full md:max-w-4xl mx-auto">
      {/* 左側：AI 聊天入口 */}
      <button
        onClick={onToggleChat}
        className="flex items-center gap-2 bg-gray-900/80 backdrop-blur px-4 py-3 rounded-full border border-gray-700 text-cyan-400 hover:bg-gray-800 transition-colors"
      >
        <MessageCircle size={20} />
        <span className="text-sm hidden md:inline">呼叫諸上善人 (Bodhi AI)</span>
      </button>

      {/* 中央：念佛按鈕 */}
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
        {/* 波紋效果 (裝飾) */}
        <div className="absolute -inset-4 border border-yellow-500/10 rounded-full animate-ping opacity-20" />
      </button>

      {/* 右側：資料 */}
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

// 5. AI 聊天室 (Bodhi AI Overlay)
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

// --- 主應用程序 (App) ---
export default function App() {
  const [viewState, setViewState] = useState('BRIDGE'); // BRIDGE -> KYC -> WARP -> POOL
  const [merit, setMerit] = useState(0);
  const [isChanting, setIsChanting] = useState(false);
  const [showVisa, setShowVisa] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 處理念佛互動
  const handleChant = () => {
    setMerit(prev => prev + 1);
    setIsChanting(true);
    // 短暫震動反饋 (若設備支援)
    if (navigator.vibrate) navigator.vibrate(50);

    // 重置念佛動畫狀態
    setTimeout(() => setIsChanting(false), 150);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans selection:bg-yellow-500/30">

      {/* 3D 場景層: 蓮池 (僅在 POOL 狀態顯示) */}
      {viewState === 'POOL' && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 5, 30]} />
          <Suspense fallback={null}>
            <PureLandScene meritCount={merit} isChanting={isChanting} />
          </Suspense>
        </Canvas>
      )}

      {/* 3. 時光隧道轉場 (WARP 狀態) */}
      {viewState === 'WARP' && (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <WarpTunnelScene onComplete={() => {
            setViewState('POOL');
            setShowVisa(false); // Hide Visa modal if still open
            // Small delay to show Visa animation? No, just transition.
          }} />
        </Canvas>
      )}

      {/* 1. 量子之橋入口 (BRIDGE 狀態) */}
      {viewState === 'BRIDGE' && (
        <QuantumBridgeScene onComplete={() => setViewState('KYC')} />
      )}


      {viewState === 'KYC' && (
        <KYCView onComplete={() => {
          // Keep KYC view state but show Visa modal
          // Logic adjusted: After Visa signed -> WARP
          setShowVisa(true);
        }} />
      )}

      {/* Visa Modal should be visible during KYC when showVisa is true */}
      {viewState === 'KYC' && showVisa && (
        <VisaModal onClose={() => {
          setShowVisa(false);
          setViewState('WARP');
        }} />
      )}

      {viewState === 'POOL' && (
        <>
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