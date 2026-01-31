import { getStage } from '../../types';
import { SeedParticles } from './SeedParticles';
import { LotusBud } from './LotusBud';
import { BloomingLotus } from './BloomingLotus';
import { RadiantLotus } from './RadiantLotus';
import { SeatedFigure } from './SeatedFigure';
import { SpiralAura } from './SpiralAura';

interface LotusProps {
    meritCount: number;
    isChanting: boolean;
}

// ============ 主蓮花組件 (整合所有階段) ============
export const Lotus = ({ meritCount, isChanting }: LotusProps) => {
    const stage = getStage(meritCount);
    const avatarOpacity = stage === 'avatar' ? Math.min((meritCount - 2000) / 500, 1) : 0;

    return (
        <group position={[0, 0, 0]}>
            {/* 底部動態螺旋光暈 - 貫穿所有階段 (根據 merit 顯現) */}
            <SpiralAura meritCount={meritCount} />

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
