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

// 導覽區域資料 - 根據淨土三經內容
export const TOUR_REGIONS: TourRegion[] = [
    {
        id: 'seven_jewel_pool',
        title: '七寶池',
        videoUrl: '/videos/tour/seven_jewel_pool.mp4',
        thumbnailUrl: '/images/tour/seven_jewel_pool.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土有七寶池，八功德水充滿其中，池底純以金沙布地。四邊階道，金、銀、琉璃、玻璃合成。上有樓閣，亦以金、銀、琉璃、玻璃、硨磲、赤珠、瑪瑙而嚴飾之。池中蓮華，大如車輪，青色青光、黃色黃光、赤色赤光、白色白光，微妙香潔。」',
        explanation: '極樂世界有七種珍寶砌成的池塘，池中充滿具備八種功德的水（澄清、清涼、甘美、輕美、輕軟、潤澤、安和、除饑渴、長養諸根）。池底鋪著純淨的金沙，四邊的階梯道路由金、銀、琉璃、玻璃四種珍寶合成。池上有樓閣，以七種珍寶裝飾。池中的蓮花大如車輪，有青、黃、赤、白四色，各放光芒，微妙香潔。',
    },
    {
        id: 'golden_ground',
        title: '黃金地',
        videoUrl: '/videos/tour/golden_ground.mp4',
        thumbnailUrl: '/images/tour/golden_ground.jpg',
        source: '佛說阿彌陀經',
        scripture: '「舍利弗，彼佛國土，微風吹動諸寶行樹，及寶羅網，出微妙音，譬如百千種樂同時俱作。聞是音者，皆自然生念佛、念法、念僧之心。舍利弗，其佛國土成就如是功德莊嚴。」「彼佛國土，無有眾苦，但受諸樂，故名極樂。又舍利弗，彼佛國土，常作天樂，黃金為地，晝夜六時，天雨曼陀羅華。」',
        explanation: '極樂世界的地面以黃金鋪成，光芒四射，晶瑩剔透。空中常有天樂演奏，日夜六時都有天女散落曼陀羅花。這裡沒有任何痛苦，只有種種快樂，所以稱為「極樂」。微風吹動寶樹和羅網，發出如百千種樂器同時演奏的美妙音聲，聽到的人自然心生念佛、念法、念僧的善念。',
    },
    {
        id: 'seven_rows_trees',
        title: '七重行樹',
        videoUrl: '/videos/tour/seven_rows_trees.mp4',
        thumbnailUrl: '/images/tour/seven_rows_trees.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞，是故彼國名為極樂。」「彼如來國，多諸寶樹，或以黃金為樹，白銀為葉，花果亦然；或以白銀為銀為樹，黃金為葉，花果亦然；或以琉璃為樹，玻璃為葉，花果亦然...」',
        explanation: '極樂世界有七重排列整齊的寶樹，由金、銀、琉璃、玻璃等珍寶組成。有的樹幹是黃金，樹葉是白銀；有的樹幹是白銀，樹葉是黃金。樹上開花結果，色彩繽紛，光芒耀眼。微風吹過，樹葉發出悅耳的音聲，如同百千種樂器同時演奏，令人心生清淨，自然念佛念法。',
    },
    {
        id: 'seven_rows_railings',
        title: '七重欄楯',
        videoUrl: '/videos/tour/seven_rows_railings.mp4',
        thumbnailUrl: '/images/tour/seven_rows_railings.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞，是故彼國名為極樂。」',
        explanation: '極樂世界的道路和區域邊界，都有七層精美的欄杆環繞。這些欄杆由金、銀、琉璃、玻璃四種珍寶建造，層層疊疊，光芒閃耀。欄楯不僅是美麗的裝飾，更代表著極樂世界的秩序與莊嚴，處處展現著阿彌陀佛的功德成就。',
    },
    {
        id: 'seven_rows_nets',
        title: '七重羅網',
        videoUrl: '/videos/tour/seven_rows_nets.mp4',
        thumbnailUrl: '/images/tour/seven_rows_nets.jpg',
        source: '佛說阿彌陀經',
        scripture: '「又舍利弗，極樂國土，七重欄楯，七重羅網，七重行樹，皆是四寶周匝圍繞。」「微風吹動諸寶行樹，及寶羅網，出微妙音，譬如百千種樂同時俱作。」',
        explanation: '極樂世界的空中懸掛著七層寶網，綴滿各種珍寶，光輝交映，層層疊疊。這些羅網由金、銀、琉璃、玻璃等珍寶編織而成，當微風吹過，寶網與寶樹相互輝映，發出如百千種樂器同時演奏的美妙音聲。這音聲不是普通的音樂，而是能讓人生起念佛、念法、念僧之心的法音。',
    },
    {
        id: 'lecture_hall',
        title: '講堂',
        videoUrl: '/videos/tour/lecture_hall.mp4',
        thumbnailUrl: '/images/tour/lecture_hall.jpg',
        source: '佛說無量壽經',
        scripture: '「無量壽佛，為諸聲聞菩薩人天，頒宣法時，都悉集會七寶講堂，廣宣道教，演暢妙法，莫不歡喜，心解得道。」',
        explanation: '極樂世界有七寶莊嚴的講堂，阿彌陀佛在此為聲聞、菩薩、人天等大眾說法。當佛說法時，所有眾生都聚集在講堂中，聆聽阿彌陀佛宣說妙法。聽法的大眾都心生歡喜，當下開悟得道。這是極樂世界最重要的修行場所，也是眾生得以快速成就的關鍵所在。',
    },
    {
        id: 'palaces',
        title: '樓觀宮殿',
        videoUrl: '/videos/tour/palaces.mp4',
        thumbnailUrl: '/images/tour/palaces.jpg',
        source: '佛說無量壽經',
        scripture: '「講堂精舍，宮殿樓觀，皆以七寶，自然合成。復以真珠明月，摩尼眾寶，以為交絡，覆蓋其上。」「其所居住，宮殿樓閣，稱其形色，高下大小，或一寶二寶，乃至無量眾寶，隨意所欲，應念即至。」',
        explanation: '極樂世界的宮殿樓閣，都以七種珍寶自然合成，上面覆蓋著珍珠、明月珠、摩尼寶珠等眾寶交織成的網絡。菩薩們居住的宮殿，可以隨心所欲地變化形狀、顏色、大小，想要什麼樣的住所，動念即成。這些宮殿不僅是居住之所，更是修行之地，處處都能見佛聞法。',
    },
    {
        id: 'birds_teaching',
        title: '眾鳥說法',
        videoUrl: '/videos/tour/birds_teaching.mp4',
        thumbnailUrl: '/images/tour/birds_teaching.jpg',
        source: '佛說阿彌陀經',
        scripture: '「彼國常有種種奇妙雜色之鳥：白鶴、孔雀、鸚鵡、舍利、迦陵頻伽、共命之鳥。是諸眾諸眾鳥，晝夜六時，出和雅音，其音演暢五根、五力、七菩提分、八聖道分，如是等法。其土眾生聞是音已，皆悉念佛、念法、念僧。」',
        explanation: '極樂世界有各種奇妙美麗的鳥類，如白鶴、孔雀、鸚鵡、舍利、迦陵頻伽（好聲音之鳥）、共命之鳥等。這些鳥日夜發出和諧優雅的音聲，演說五根、五力、七菩提分、八聖道分等佛法。極樂世界的眾生聽到這些法音，自然生起念佛、念法、念僧的心。這些鳥其實是阿彌陀佛變化所作，為了讓法音處處流布。',
    },
    {
        id: 'heavenly_music',
        title: '天樂區',
        videoUrl: '/videos/tour/heavenly_music.mp4',
        thumbnailUrl: '/images/tour/heavenly_music.jpg',
        source: '佛說阿彌陀經',
        scripture: '「彼佛國土，常作天樂，黃金為地，晝夜六時，天雨曼陀羅華。」「彼佛國土，無有眾苦，但受諸樂，故名極樂。」',
        explanation: '極樂世界常有天樂演奏，不用人為，自然發出。日夜六時（古印度將一天分為六個時段），天空中飄落曼陀羅花（美麗的天花）。這裡沒有世間的任何痛苦，只有純粹的快樂。天樂不是普通的音樂，而是能讓人心地清淨、增長道心的妙音。眾生在這樣的環境中修行，自然精進不懈，快速成就。',
    },
];
