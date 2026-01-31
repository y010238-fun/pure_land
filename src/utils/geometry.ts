import * as THREE from 'three';

// 🌸 優化的花瓣幾何生成 - 增加展開角度和自然捲曲
export const createPetalGeometry = (): THREE.LatheGeometry => {
    const points: THREE.Vector2[] = [];
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

// 黃金角斐波那契排列算法
export const calculatePetalPosition = (
    index: number,
    totalPetals: number,
    growthProgress: number
) => {
    const goldenAngle = 137.508 * (Math.PI / 180);
    const angle = index * goldenAngle;
    const radius = 0.15 * Math.sqrt(index) * growthProgress;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = index * 0.008;

    return { x, y, z, angle };
};
