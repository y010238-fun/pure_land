import { getStage } from '../../types';
import { ChaosParticles } from './ChaosParticles';
import { LotusSeed } from './LotusSeed';
import { LotusBud } from './LotusBud';
import { UnfoldingLotus } from './UnfoldingLotus';
import { BloomingLotus } from './BloomingLotus';
import { RadiantLotus } from './RadiantLotus';
import { SeatedFigure } from './SeatedFigure';
import { SpiralAura } from './SpiralAura';

interface LotusProps {
    meritCount: number;
    isChanting: boolean;
}

// ============ 主蓮花組件 (整合所有 10 階段) ============
export const Lotus = ({ meritCount, isChanting }: LotusProps) => {
    const stage = getStage(meritCount);

    // 化身透明度：2000-2500 漸入，2500+ 完全顯現
    const avatarOpacity = stage === 'avatar'
        ? Math.min((meritCount - 2000) / 500, 1)
        : stage === 'pureland' ? 1 : 0;

    return (
        <group position={[0, -2, 0]}>
            {/* 底部動態螺旋光暈 - 從階段 2 開始顯現 */}
            {meritCount >= 50 && <SpiralAura meritCount={meritCount} />}

            {/* 階段 1-2：混沌星塵 + 螺旋聚合 */}
            {(stage === 'chaos' || stage === 'spiral') && (
                <ChaosParticles meritCount={meritCount} />
            )}

            {/* 階段 3-4：蓮種凝聚 + 種子覺醒 */}
            {(stage === 'seed' || stage === 'awakening') && (
                <LotusSeed meritCount={meritCount} />
            )}

            {/* 階段 5：花苞初現 */}
            {stage === 'bud' && <LotusBud meritCount={meritCount} />}

            {/* 階段 6：花瓣舒展 */}
            {stage === 'unfold' && <UnfoldingLotus meritCount={meritCount} />}

            {/* 階段 7：蓮華盛開 */}
            {stage === 'bloom' && <BloomingLotus meritCount={meritCount} />}

            {/* 階段 8：放光莊嚴 */}
            {stage === 'radiant' && (
                <RadiantLotus meritCount={meritCount} isChanting={isChanting} />
            )}

            {/* 階段 9：化身顯現 */}
            {stage === 'avatar' && (
                <>
                    <RadiantLotus meritCount={meritCount} isChanting={isChanting} />
                    <SeatedFigure opacity={avatarOpacity} meritCount={meritCount} />
                </>
            )}

            {/* 階段 10：圓滿淨土 */}
            {stage === 'pureland' && (
                <>
                    <RadiantLotus meritCount={meritCount} isChanting={isChanting} />
                    <SeatedFigure opacity={1} isEnlightened={true} meritCount={meritCount} />
                </>
            )}
        </group>
    );
};
