import { TourRegion } from '../types';

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

// 導覽區域資料 - 極樂世界帝寶級賞屋風格
export const TOUR_REGIONS: TourRegion[] = [
    {
        id: 'seven_jewel_pool',
        title: '頂級 SPA 水療區',
        videoUrl: '/videos/tour/seven_jewel_pool.mp4',
        thumbnailUrl: '/images/tour/seven_jewel_pool.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土有七寶池，八功德水充滿其中，池底純以金沙布地。四邊階道，金、銀、琉璃、玻璃合成。上有樓閣，亦以金、銀、琉璃、玻璃、硨磲、赤珠、瑪瑙而嚴飾之。池中蓮華，大如車輪，青色青光、黃色黃光、赤色赤光、白色白光，微妙香潔。」',
        explanation: '想像一下，擁有八種神奇功效的活水 SPA，水質清澈見底、恆溫舒適，還能讓身心靈徹底放鬆。池底不是普通磁磚，是純金鋪面！池邊四色蓮花綻放，青黃赤白各有光芒，這就是極樂世界的「無限池畔生活」。',
    },
    {
        id: 'golden_ground',
        title: '純金地坪大廳',
        videoUrl: '/videos/tour/golden_ground.mp4',
        thumbnailUrl: '/images/tour/golden_ground.jpg',
        source: '佛說阿彌陀經',
        scripture: '「舍利弗，彼佛國土，微風吹動諸寶行樹，及寶羅網，出微妙音，譬如百千種樂同時俱作。聞是音者，皆自然生念佛、念法、念僧之心。舍利弗，其佛國土成就如是功德莊嚴。」「彼佛國土，無有眾苦，但受諸樂，故名極樂。又舍利弗，彼佛國土，常作天樂，黃金為地，晝夜六時，天雨曼陀羅華。」',
        explanation: '整個社區地面都是純金鋪設，不是鍍金，是實打實的黃金！走到哪都閃閃發光。24小時全天候天籟音樂播放，還有仙女散花服務。沒有任何煩惱，只有純粹的享受，這才是真正的「豪宅人生」。',
    },
    {
        id: 'seven_rows_trees',
        title: '皇家景觀植栽區',
        videoUrl: '/videos/tour/seven_rows_trees.mp4',
        thumbnailUrl: '/images/tour/seven_rows_trees.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞，是故彼國名為極樂。」「彼如來國，多諸寶樹，或以黃金為樹，白銀為葉，花果亦然；或以白銀為樹，黃金為葉，花果亦然；或以琉璃為樹，玻璃為葉，花果亦然...」',
        explanation: '七層珍寶樹林環繞，金樹銀葉、琉璃樹玻璃葉，每棵樹都價值連城。微風一吹，樹葉發出的聲音就像交響樂團現場演奏。不用買音響設備，天然的法音環繞音效，走進來就自動升級心靈境界。',
    },
    {
        id: 'seven_rows_railings',
        title: '精品等級安全圍籬',
        videoUrl: '/videos/tour/seven_rows_railings.mp4',
        thumbnailUrl: '/images/tour/seven_rows_railings.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞，是故彼國名為極樂。」',
        explanation: '七層金銀琉璃打造的精工欄杆，層層環繞整個社區。不是為了防盜（這裡沒有小偷），而是展現尊榮與秩序。每一根欄杆都是藝術品，寶石鑲嵌、光芒四射，走在這樣的環境裡，處處都是莊嚴與美好。',
    },
    {
        id: 'seven_rows_nets',
        title: '空中寶石天幕',
        videoUrl: '/videos/tour/seven_rows_nets.mp4',
        thumbnailUrl: '/images/tour/seven_rows_nets.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞。」「微風吹動諸寶行樹，及寶羅網，出微妙音，譬如百千種樂同時俱作。」',
        explanation: '空中懸掛七層寶網，綴滿珍珠瑪瑙，就像置身於珠寶展覽館。微風吹過，寶網交織發出天籟之音。這不是普通的裝飾，是會「唱歌」的藝術品！抬頭就是視覺與聽覺的雙重饗宴。',
    },
    {
        id: 'lecture_hall',
        title: 'VIP 大師講座廳',
        videoUrl: '/videos/tour/lecture_hall.mp4',
        thumbnailUrl: '/images/tour/lecture_hall.jpg',
        source: '佛說無量壽經',
        scripture: '「無量壽佛，為諸聲聞菩薩人天，頒宣法時，都悉集會七寶講堂，廣宣道教，演暢妙法，莫不歡喜，心解得道。」',
        explanation: '阿彌陀佛親自主講的修行課程，每天現場開示。座位不用預約，沒有名額限制，來了就能聽。最重要的是——聽完當場開悟！這是極樂世界的「終極進修中心」，成就快速保證班。',
    },
    {
        id: 'palaces',
        title: '訂製化智慧宅邸',
        videoUrl: '/videos/tour/palaces.mp4',
        thumbnailUrl: '/images/tour/palaces.jpg',
        source: '佛說無量壽經',
        scripture: '「講堂精舍，宮殿樓觀，皆以七寶，自然合成。復以真珠明月，摩尼眾寶，以為交絡，覆蓋其上。」「其所居住，宮殿樓閣，稱其形色，高下大小，或一寶二寶，乃至無量眾寶，隨意所欲，應念即至。」',
        explanation: '想要什麼樣的房子？動個念頭就出現！要大要小、要高要低、要什麼顏色、用什麼珍寶建造，全憑您的心意。這是真正的「心想事成」住宅，而且完全不用裝潢費，七寶自然合成，入住即刻享受。',
    },
    {
        id: 'birds_teaching',
        title: '生態法音園區',
        videoUrl: '/videos/tour/birds_teaching.mp4',
        thumbnailUrl: '/images/tour/birds_teaching.jpg',
        source: '佛說阿彌陀經',
        scripture: '「彼國常有種種奇妙雜色之鳥：白鶴、孔雀、鸚鵡、舍利、迦陵頻伽、共命之鳥。是諸眾鳥，晝夜六時，出和雅音，其音演暢五根、五力、七菩提分、八聖道分，如是等法。其土眾生聞是音已，皆悉念佛、念法、念僧。」',
        explanation: '白鶴、孔雀、鸚鵡、迦陵頻伽（天籟之鳥）等各種珍奇鳥類自由飛翔。牠們不是普通寵物，而是會「講課」的善知識！走到哪裡都有鳥兒為您演說佛法，這是最自然的學習環境。',
    },
    {
        id: 'heavenly_music',
        title: '全天候心靈饗宴區',
        videoUrl: '/videos/tour/heavenly_music.mp4',
        thumbnailUrl: '/images/tour/heavenly_music.jpg',
        source: '佛說阿彌陀經',
        scripture: '「彼佛國土，常作天樂，黃金為地，晝夜六時，天雨曼陀羅華。」「彼佛國土，無有眾苦，但受諸樂，故名極樂。」',
        explanation: '24小時不打烊的天界音樂會，全程自動演奏，無需人力。搭配仙女散花服務，曼陀羅花從天飄落。這裡沒有壓力、沒有煩惱，只有純粹的喜悅與清淨，是身心靈的最佳充電站。',
    },
];