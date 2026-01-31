import { Stars, Sparkles, Float, OrbitControls } from '@react-three/drei';
import { Lotus } from '../Lotus';

interface PureLandSceneProps {
    meritCount: number;
    isChanting: boolean;
}

// ============ 3D 場景: 淨土環境 ============
export const PureLandScene = ({ meritCount, isChanting }: PureLandSceneProps) => {
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
