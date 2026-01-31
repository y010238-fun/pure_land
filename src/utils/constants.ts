// 蓮花階段閾值
export const LOTUS_STAGE_THRESHOLDS = {
    SEED: 0,
    BUD: 100,
    BLOOM: 500,
    RADIANT: 1000,
    AVATAR: 2000,
} as const;

// 花瓣顏色配置
export const PETAL_COLORS = {
    inner: '#C24A8F',
    outer: '#FFB6D9',
    layers: [
        '#C24A8F', '#D1568F', '#DC6294', '#E66E99',
        '#F07A9E', '#F486A3', '#F692A8', '#F89EAD',
        '#FAAAB2', '#FCB6B7', '#FEC2BC', '#FFCEC1',
        '#FFDAD6', '#FFE6DB',
    ],
} as const;

// 金色光芒配置
export const GOLDEN_GLOW = {
    color: '#FFD700',
    emissive: '#FFD700',
    intensity: 0.15,
} as const;
