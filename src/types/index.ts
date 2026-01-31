// 蓮花進化階段類型
export type LotusStage = 'seed' | 'bud' | 'bloom' | 'radiant' | 'avatar';

// 應用程式視圖狀態
export type ViewState = 'BRIDGE' | 'KYC' | 'WARP' | 'POOL';

// 階段判定函式
export const getStage = (merit: number): LotusStage => {
    if (merit < 100) return 'seed';
    if (merit < 500) return 'bud';
    if (merit < 1000) return 'bloom';
    if (merit < 2000) return 'radiant';
    return 'avatar';
};
