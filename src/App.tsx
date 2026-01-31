import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

// 模組化匯入
import { QuantumBridgeScene } from './components/QuantumBridge/QuantumBridgeScene';
import { WarpTunnelScene } from './components/Effects/WarpTunnelScene';
import { SoftGlow } from './components/Lotus/SoftGlow';
import { PureLandScene } from './components/Scenes/PureLandScene';
import { LandingView, KYCView, VisaModal, Dashboard, AIChatOverlay } from './components/UI';

// 主應用程序
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