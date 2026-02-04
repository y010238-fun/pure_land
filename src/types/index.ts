// 蓮花進化階段類型 (10 階段)
export type LotusStage =
    | 'chaos'      // 0-49: 混沌星塵
    | 'spiral'     // 50-99: 螺旋聚合
    | 'seed'       // 100-199: 蓮種凝聚
    | 'awakening'  // 200-399: 種子覺醒
    | 'bud'        // 400-699: 花苞初現
    | 'unfold'     // 700-999: 花瓣舒展
    | 'bloom'      // 1000-1499: 蓮華盛開
    | 'radiant'    // 1500-1999: 放光莊嚴
    | 'avatar'     // 2000-2499: 化身顯現
    | 'pureland';  // 2500+: 圓滿淨土

// 應用程式視圖狀態
export type ViewState = 'BRIDGE' | 'KYC' | 'WARP' | 'PARADISE_VIDEO' | 'SCENE_MENU' | 'POOL' | 'TOUR' | 'LEADERBOARD' | 'CHAT';

// 階段判定函式
export const getStage = (merit: number): LotusStage => {
    if (merit < 50) return 'chaos';
    if (merit < 100) return 'spiral';
    if (merit < 200) return 'seed';
    if (merit < 400) return 'awakening';
    if (merit < 700) return 'bud';
    if (merit < 1000) return 'unfold';
    if (merit < 1500) return 'bloom';
    if (merit < 2000) return 'radiant';
    if (merit < 2500) return 'avatar';
    return 'pureland';
};
