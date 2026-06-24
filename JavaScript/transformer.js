/**
 * 变压器设计计算平台 - JavaScript 业务逻辑 V2.1
 * 对应 index/TransformerCalculation.html
 * 
 * 支持拓扑: 正激、反激、推挽、半桥、全桥、LLC半桥、移相全桥、升压(Boost)、降压(Buck)
 * 功能: 动态原理图、匝数计算、气隙设计、线径选择、磁芯规格数据导入、多股膜包线计算
 */

// ==================== 磁芯数据库 ====================
const CORE_DATA = {
    EE25:  { Ae: 0.49,  Le: 5.9,  Ve: 2.9,  Aw: 0.62,  name: 'EE25' },
    EE30:  { Ae: 0.92,  Le: 7.1,  Ve: 6.5,  Aw: 1.27,  name: 'EE30' },
    EE35:  { Ae: 1.19,  Le: 8.4,  Ve: 10.0, Aw: 1.74,  name: 'EE35' },
    EE40:  { Ae: 1.54,  Le: 9.8,  Ve: 15.1, Aw: 2.36,  name: 'EE40' },
    EE50:  { Ae: 3.02,  Le: 12.2, Ve: 36.8, Aw: 4.21,  name: 'EE50' },
    PQ35_35: { Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, name: 'PQ35/35' },
    PQ40_40: { Ae: 2.30, Le: 10.0, Ve: 23.0, Aw: 2.65, name: 'PQ40/40' }
};

// ==================== JIS 5 标准线径表 ====================
// JIS C 3102 漆包线标准 (JIS5 系列)
// 导体直径(裸线), 最大外径(含漆膜), 截面积, 20°C电阻 Ω/m
const JIS5_WIRE_TABLE = [
    { awg: '50', d_nom: 0.010, d_max: 0.014, area: 0.0000785, res: 219.5 },
    { awg: '48', d_nom: 0.012, d_max: 0.016, area: 0.000113, res: 152.5 },
    { awg: '46', d_nom: 0.016, d_max: 0.021, area: 0.000201, res: 85.8 },
    { awg: '44', d_nom: 0.020, d_max: 0.026, area: 0.000314, res: 54.8 },
    { awg: '42', d_nom: 0.025, d_max: 0.032, area: 0.000491, res: 35.1 },
    { awg: '40', d_nom: 0.032, d_max: 0.039, area: 0.000804, res: 21.4 },
    { awg: '38', d_nom: 0.040, d_max: 0.048, area: 0.001257, res: 13.7 },
    { awg: '36', d_nom: 0.050, d_max: 0.059, area: 0.001963, res: 8.79 },
    { awg: '35', d_nom: 0.055, d_max: 0.064, area: 0.002375, res: 7.26 },
    { awg: '34', d_nom: 0.060, d_max: 0.069, area: 0.002827, res: 6.10 },
    { awg: '33', d_nom: 0.065, d_max: 0.075, area: 0.003318, res: 5.20 },
    { awg: '32', d_nom: 0.070, d_max: 0.081, area: 0.003848, res: 4.48 },
    { awg: '31', d_nom: 0.080, d_max: 0.092, area: 0.005027, res: 3.43 },
    { awg: '30', d_nom: 0.090, d_max: 0.103, area: 0.006362, res: 2.71 },
    { awg: '29', d_nom: 0.100, d_max: 0.114, area: 0.007854, res: 2.19 },
    { awg: '28', d_nom: 0.112, d_max: 0.127, area: 0.009852, res: 1.75 },
    { awg: '27', d_nom: 0.125, d_max: 0.141, area: 0.01227, res: 1.40 },
    { awg: '26', d_nom: 0.140, d_max: 0.157, area: 0.01539, res: 1.12 },
    { awg: '25', d_nom: 0.160, d_max: 0.178, area: 0.02011, res: 0.857 },
    { awg: '24', d_nom: 0.180, d_max: 0.199, area: 0.02545, res: 0.677 },
    { awg: '23', d_nom: 0.200, d_max: 0.221, area: 0.03142, res: 0.549 },
    { awg: '22', d_nom: 0.224, d_max: 0.246, area: 0.03939, res: 0.438 },
    { awg: '21', d_nom: 0.250, d_max: 0.273, area: 0.04909, res: 0.351 },
    { awg: '20', d_nom: 0.280, d_max: 0.304, area: 0.06158, res: 0.280 },
    { awg: '19', d_nom: 0.315, d_max: 0.341, area: 0.07793, res: 0.221 },
    { awg: '18', d_nom: 0.355, d_max: 0.382, area: 0.09898, res: 0.174 },
    { awg: '17', d_nom: 0.400, d_max: 0.428, area: 0.1257, res: 0.137 },
    { awg: '16', d_nom: 0.450, d_max: 0.480, area: 0.1590, res: 0.108 },
    { awg: '15', d_nom: 0.500, d_max: 0.531, area: 0.1964, res: 0.0878 },
    { awg: '14', d_nom: 0.560, d_max: 0.593, area: 0.2463, res: 0.0700 },
    { awg: '13', d_nom: 0.630, d_max: 0.665, area: 0.3117, res: 0.0553 },
    { awg: '12', d_nom: 0.710, d_max: 0.747, area: 0.3959, res: 0.0435 },
    { awg: '11', d_nom: 0.800, d_max: 0.839, area: 0.5027, res: 0.0343 },
    { awg: '10', d_nom: 0.900, d_max: 0.941, area: 0.6362, res: 0.0271 },
    { awg: '9', d_nom: 1.000, d_max: 1.043, area: 0.7854, res: 0.0219 },
    { awg: '8', d_nom: 1.120, d_max: 1.166, area: 0.9852, res: 0.0175 },
    { awg: '7', d_nom: 1.250, d_max: 1.298, area: 1.227, res: 0.0140 },
    { awg: '6', d_nom: 1.400, d_max: 1.450, area: 1.539, res: 0.0112 },
    { awg: '5', d_nom: 1.600, d_max: 1.653, area: 2.011, res: 0.00857 },
    { awg: '4', d_nom: 1.800, d_max: 1.855, area: 2.545, res: 0.00677 },
    { awg: '3', d_nom: 2.000, d_max: 2.058, area: 3.142, res: 0.00549 },
    { awg: '2', d_nom: 2.240, d_max: 2.302, area: 3.941, res: 0.00438 },
    { awg: '1', d_nom: 2.500, d_max: 2.564, area: 4.909, res: 0.00351 },
    { awg: '0', d_nom: 2.800, d_max: 2.867, area: 6.158, res: 0.00280 }
];

// 多股膜包线填充系数
const LITZ_FILL_FACTOR = {
    '1':  0.785, // 1股
    '3':  0.632, // 3股
    '5':  0.585, // 5股
    '7':  0.570, // 7股
    '10': 0.562, // 10股
    '15': 0.555, // 15股
    '20': 0.550, // 20股
    '30': 0.545, // 30股
    '50': 0.540, // 50股
    '100': 0.535 // 100股
};

function getLitzFillFactor(strands) {
    const keys = Object.keys(LITZ_FILL_FACTOR).map(Number).sort((a,b)=>a-b);
    let result = LITZ_FILL_FACTOR['1'];
    for (let i = 0; i < keys.length; i++) {
        if (strands <= keys[i]) {
            result = LITZ_FILL_FACTOR[String(keys[i])];
            break;
        }
    }
    if (strands > keys[keys.length-1]) result = LITZ_FILL_FACTOR['100'];
    return result;
}

// ==================== 拓扑参数配置 ====================
const TOPO_CONFIG = {
    forward: {
        name: '正激变压器', icon: '➡️', dutyMax: 0.45, Vdc: 1.0, Vsec: 1.0, 
        IpriType: 'avg', IsecType: 'avg', hasClamp: true,
        title: '正激变压器原理图 (Forward Converter)',
        desc: '开关管导通时能量传递到副边，关断时通过钳位电路磁复位',
        notes: 'Dmax<0.5，需磁复位绕组或RCD钳位' },
    flyback: {
        name: '反激变压器', icon: '🔄', dutyMax: 0.5, Vdc: 1.0, Vsec: 1.0,
        IpriType: 'avg', IsecType: 'peak', hasClamp: false,
        title: '反激变压器原理图 (Flyback Converter)',
        desc: '开关管导通时储能，关断时释放能量到副边',
        notes: '带气隙的耦合电感，Dmax<0.5' },
    pushpull: {
        name: '推挽变压器', icon: '↔️', dutyMax: 0.45, Vdc: 1.0, Vsec: 2.0,
        IpriType: 'avg', IsecType: 'avg', hasClamp: false,
        title: '推挽变压器原理图 (Push-Pull Converter)',
        desc: '两个开关管交替导通，中心抽头副边',
        notes: '开关管电压应力2Vin，需防偏磁' },
    halfbridge: {
        name: '半桥变压器', icon: '🌉', dutyMax: 0.45, Vdc: 0.5, Vsec: 1.0,
        IpriType: 'avg', IsecType: 'avg', hasClamp: false,
        title: '半桥变压器原理图 (Half-Bridge Converter)',
        desc: '两个开关管互补导通，输入电压为母线一半',
        notes: '开关管电压应力低，抗不平衡能力强' },
    fullbridge: {
        name: '全桥变压器', icon: '🌁', dutyMax: 0.45, Vdc: 1.0, Vsec: 1.0,
        IpriType: 'avg', IsecType: 'avg', hasClamp: false,
        title: '全桥变压器原理图 (Full-Bridge Converter)',
        desc: '四个开关管组成桥臂，变压器利用率高',
        notes: '适合大功率，需四路隔离驱动' },
    llc: {
        name: 'LLC半桥变压器', icon: '🎯', dutyMax: 0.5, Vdc: 0.5, Vsec: 1.0,
        IpriType: 'rms', IsecType: 'rms', hasClamp: false,
        title: 'LLC半桥谐振变压器 (LLC Half-Bridge)',
        desc: '利用谐振实现软开关，高效率',
        notes: '含Lr谐振电感，增益曲线需覆盖输入范围' },
    phasefull: {
        name: '移相全桥变压器', icon: '📐', dutyMax: 0.8, Vdc: 1.0, Vsec: 1.0,
        IpriType: 'rms', IsecType: 'avg', hasClamp: true,
        title: '移相全桥变压器 (Phase-Shifted Full-Bridge)',
        desc: '通过移相控制实现ZVS软开关',
        notes: '需考虑占空比丢失，滞后桥臂ZVS较难' },
    boost: {
        name: '升压电感 (Boost)', icon: '⬆️', dutyMax: 0.85, Vdc: 1.0, Vsec: 1.0,
        IpriType: 'avg', IsecType: 'avg', hasClamp: false,
        title: '升压变换器 (Boost Converter)',
        desc: '开关管导通时电感储能，关断时释放到输出，Vout>Vin',
        notes: 'PFC电路最常用拓扑，电感需开气隙' },
    buck: {
        name: '降压电感 (Buck)', icon: '⬇️', dutyMax: 0.85, Vdc: 1.0, Vsec: 1.0,
        IpriType: 'avg', IsecType: 'avg', hasClamp: false,
        title: '降压变换器 (Buck Converter)',
        desc: '开关管导通时向输出提供能量，关断时通过续流二极管续流',
        notes: '最基础的DC-DC降压拓扑，无需变压器隔离' }
};

// ==================== 动态 SVG 原理图生成器 ====================
const SCHEMATIC_COLORS = {
    wire: '#1a2c3e', vin: '#3b82f6', switch: '#f59e0b', diode: '#3b82f6',
    core: '#1e4a76', cap: '#f59e0b', load: '#10b981', inductor: '#8b5cf6',
    resistor: '#ef4444', resonant: '#ec4899'
};

function makeSchematic(topo, params) {
    const animStyle = params.animated !== false ? `<style>
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes flow { 0%{stroke-dashoffset:40} 100%{stroke-dashoffset:0} }
        .c-on { animation:pulse 2s ease-in-out infinite; }
        .c-off { animation:pulse 2s ease-in-out infinite; animation-delay:1s; }
        .flow { stroke-dasharray:8,4; animation:flow 1s linear infinite; }
    </style>` : '';
    if (topo === 'boost') return makeBoostSchematic(animStyle);
    if (topo === 'buck') return makeBuckSchematic(animStyle);
    return makeIsolatedSchematic(topo, animStyle);
}

function makeBoostSchematic(animStyle) {
    return `<svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">${animStyle}
        <text x="300" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">升压变换器 (Boost Converter) — Vout > Vin</text>
        <rect x="30" y="110" width="45" height="35" rx="5" fill="#eef3fc" stroke="${SCHEMATIC_COLORS.vin}" stroke-width="2"/>
        <text x="52" y="132" text-anchor="middle" font-size="10" font-weight="700" fill="#1e4a76">Vin</text>
        <g transform="translate(100,95)">
            <rect x="0" y="0" width="50" height="65" rx="5" fill="white" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="12" x2="43" y2="12" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="26" x2="43" y2="26" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="40" x2="43" y2="40" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="54" x2="43" y2="54" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <text x="25" y="40" text-anchor="middle" font-size="9" font-weight="700" fill="#4b556b">L</text>
        </g>
        <circle cx="175" cy="127" r="3" fill="#1a2c3e"/>
        <rect x="150" y="148" width="40" height="28" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.switch}" stroke-width="2"/>
        <text x="170" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e" class="c-on">Q</text>
        <line x1="175" y1="127" x2="175" y2="148" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="155" y1="176" x2="195" y2="176" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="1.5"/>
        <text x="175" y="190" text-anchor="middle" font-size="7" fill="#6b7a95">GND</text>
        <rect x="195" y="105" width="40" height="28" rx="4" fill="#dbeafe" stroke="${SCHEMATIC_COLORS.diode}" stroke-width="2"/>
        <text x="215" y="123" text-anchor="middle" font-size="9" font-weight="700" fill="#1e40af" class="c-off">D</text>
        <line x1="175" y1="127" x2="195" y2="119" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <rect x="265" y="110" width="35" height="26" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.cap}" stroke-width="2"/>
        <text x="282" y="128" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">Co</text>
        <line x1="235" y1="119" x2="265" y2="123" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="300" y1="123" x2="330" y2="123" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <rect x="330" y="108" width="45" height="28" rx="4" fill="#d1fae5" stroke="${SCHEMATIC_COLORS.load}" stroke-width="2"/>
        <text x="352" y="127" text-anchor="middle" font-size="9" font-weight="700" fill="#065f46">Load</text>
        <line x1="75" y1="127" x2="100" y2="127" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <text x="160" y="220" text-anchor="middle" font-size="9" fill="#6b7a95">Vout = Vin / (1-D) ，D 越大 Vout 越高</text>
    </svg>`;
}

function makeBuckSchematic(animStyle) {
    return `<svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">${animStyle}
        <text x="300" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">降压变换器 (Buck Converter) — Vout < Vin</text>
        <rect x="30" y="110" width="45" height="35" rx="5" fill="#eef3fc" stroke="${SCHEMATIC_COLORS.vin}" stroke-width="2"/>
        <text x="52" y="132" text-anchor="middle" font-size="10" font-weight="700" fill="#1e4a76">Vin</text>
        <rect x="100" y="105" width="40" height="28" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.switch}" stroke-width="2"/>
        <text x="120" y="123" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e" class="c-on">Q</text>
        <line x1="75" y1="127" x2="100" y2="119" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <circle cx="165" cy="119" r="3" fill="#1a2c3e"/>
        <line x1="140" y1="119" x2="165" y2="119" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <rect x="140" y="148" width="40" height="28" rx="4" fill="#dbeafe" stroke="${SCHEMATIC_COLORS.diode}" stroke-width="2"/>
        <text x="160" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="#1e40af" class="c-off">Df</text>
        <line x1="165" y1="119" x2="165" y2="148" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="145" y1="176" x2="185" y2="176" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="1.5"/>
        <text x="165" y="190" text-anchor="middle" font-size="7" fill="#6b7a95">GND</text>
        <g transform="translate(190,90)">
            <rect x="0" y="0" width="50" height="60" rx="5" fill="white" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="12" x2="43" y2="12" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="28" x2="43" y2="28" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <line x1="7" y1="44" x2="43" y2="44" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2.5"/>
            <text x="25" y="36" text-anchor="middle" font-size="9" font-weight="700" fill="#4b556b">Lf</text>
        </g>
        <line x1="165" y1="119" x2="190" y2="120" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <rect x="270" y="108" width="35" height="28" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.cap}" stroke-width="2"/>
        <text x="287" y="127" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">Co</text>
        <line x1="240" y1="120" x2="270" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="305" y1="122" x2="330" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <rect x="330" y="106" width="45" height="28" rx="4" fill="#d1fae5" stroke="${SCHEMATIC_COLORS.load}" stroke-width="2"/>
        <text x="352" y="125" text-anchor="middle" font-size="9" font-weight="700" fill="#065f46">Load</text>
        <text x="180" y="220" text-anchor="middle" font-size="9" fill="#6b7a95">Vout = Vin × D ，D 控制输出电压</text>
    </svg>`;
}

function makeIsolatedSchematic(topo, animStyle) {
    const config = TOPO_CONFIG[topo];
    return `<svg viewBox="0 0 640 280" style="width:100%; max-width:700px;">${animStyle}
        <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3c72">${config ? config.title : '隔离型变换器'}</text>
        <rect x="20" y="105" width="45" height="35" rx="5" fill="#eef3fc" stroke="${SCHEMATIC_COLORS.vin}" stroke-width="2"/>
        <text x="42" y="127" text-anchor="middle" font-size="10" font-weight="700" fill="#1e4a76">Vin</text>
        <rect x="85" y="108" width="35" height="28" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.switch}" stroke-width="2"/>
        <text x="102" y="126" text-anchor="middle" font-size="8" font-weight="700" fill="#92400e" class="c-on">原边</text>
        <g transform="translate(150,85)">
            <rect x="0" y="0" width="70" height="85" rx="6" fill="white" stroke="${SCHEMATIC_COLORS.core}" stroke-width="2.5"/>
            <line x1="8" y1="18" x2="62" y2="18" stroke="${SCHEMATIC_COLORS.core}" stroke-width="2"/>
            <line x1="8" y1="35" x2="62" y2="35" stroke="${SCHEMATIC_COLORS.core}" stroke-width="2"/>
            <line x1="8" y1="52" x2="62" y2="52" stroke="${SCHEMATIC_COLORS.core}" stroke-width="2"/>
            <line x1="8" y1="69" x2="62" y2="69" stroke="${SCHEMATIC_COLORS.core}" stroke-width="2"/>
            <text x="35" y="50" text-anchor="middle" font-size="9" font-weight="700" fill="#0c4a6e">T1</text>
        </g>
        <rect x="250" y="108" width="35" height="28" rx="4" fill="#dbeafe" stroke="${SCHEMATIC_COLORS.diode}" stroke-width="2"/>
        <text x="267" y="126" text-anchor="middle" font-size="8" font-weight="700" fill="#1e40af" class="c-off">副边</text>
        <g transform="translate(310,90)">
            <rect x="0" y="0" width="45" height="60" rx="5" fill="white" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2"/>
            <line x1="6" y1="12" x2="39" y2="12" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2"/>
            <line x1="6" y1="28" x2="39" y2="28" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2"/>
            <line x1="6" y1="44" x2="39" y2="44" stroke="${SCHEMATIC_COLORS.inductor}" stroke-width="2"/>
            <text x="22" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="#4b556b">Lf</text>
        </g>
        <rect x="380" y="108" width="35" height="28" rx="4" fill="#fef3c7" stroke="${SCHEMATIC_COLORS.cap}" stroke-width="2"/>
        <text x="397" y="126" text-anchor="middle" font-size="8" font-weight="700" fill="#92400e">Co</text>
        <rect x="440" y="108" width="45" height="28" rx="4" fill="#d1fae5" stroke="${SCHEMATIC_COLORS.load}" stroke-width="2"/>
        <text x="462" y="126" text-anchor="middle" font-size="8" font-weight="700" fill="#065f46">Load</text>
        <line x1="65" y1="122" x2="85" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <line x1="120" y1="122" x2="150" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <line x1="220" y1="122" x2="250" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2" class="flow"/>
        <line x1="285" y1="122" x2="310" y2="120" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="355" y1="120" x2="380" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <line x1="415" y1="122" x2="440" y2="122" stroke="${SCHEMATIC_COLORS.wire}" stroke-width="2"/>
        <text x="320" y="185" text-anchor="middle" font-size="9" fill="#6b7a95">${config ? config.desc : ''}</text>
        <text x="320" y="200" text-anchor="middle" font-size="9" fill="#6b7a95">${config ? config.notes : ''}</text>
    </svg>`;
}

// ==================== 全局状态 ====================
let currentTopo = 'forward';

// ==================== DOM 引用 ====================
const topoBtns = document.querySelectorAll('.topo-btn');
const schematicTitle = document.querySelector('.schematic-title');
const schematicContainer = document.getElementById('schematicContainer');
const tfCalcBtn = document.getElementById('tfCalcBtn');

const tfVin = document.getElementById('tfVin');
const tfVout = document.getElementById('tfVout');
const tfIout = document.getElementById('tfIout');
const tfFsw = document.getElementById('tfFsw');
const tfDmax = document.getElementById('tfDmax');
const tfEff = document.getElementById('tfEff');
const tfCore = document.getElementById('tfCore');
const tfMaterial = document.getElementById('tfMaterial');
const tfWireType = document.getElementById('tfWireType');
const tfJ = document.getElementById('tfJ');
const tfKu = document.getElementById('tfKu');
const tfDeltaB = document.getElementById('tfDeltaB');

const resTurnsRatio = document.getElementById('resTurnsRatio');
const resNp = document.getElementById('resNp');
const resNs = document.getElementById('resNs');
const resAe = document.getElementById('resAe');
const resLg = document.getElementById('resLg');
const resIp = document.getElementById('resIp');
const resIs = document.getElementById('resIs');
const resAwg = document.getElementById('resAwg');

const coreImportInfo = document.getElementById('coreImportInfo');

// 多股膜包线计算
const litzWireSel = document.getElementById('litzWireSel');
const litzStrands = document.getElementById('litzStrands');
const litzOuterMax = document.getElementById('litzOuterMax');
const litzOuterMin = document.getElementById('litzOuterMin');
const litzCalcBtn = document.getElementById('litzCalcBtn');
const litzResDia = document.getElementById('litzResDia');
const litzResMaxDia = document.getElementById('litzResMaxDia');
const litzResStrands = document.getElementById('litzResStrands');
const litzResFill = document.getElementById('litzResFill');
const litzResArea = document.getElementById('litzResArea');
const litzResRes = document.getElementById('litzResRes');

// ==================== 1. 拓扑切换 ====================
topoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        topoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTopo = btn.dataset.topo;
        updateSchematic();
        updateTopoDefaults();
        calculateTransformer();
    });
});

function updateSchematic() {
    const config = TOPO_CONFIG[currentTopo];
    schematicTitle.textContent = '📐 ' + (config ? config.title : '原理图');
    schematicContainer.innerHTML = makeSchematic(currentTopo, { animated: true });
}

function updateTopoDefaults() {
    const config = TOPO_CONFIG[currentTopo];
    if (config) tfDmax.value = config.dutyMax;
}

// ==================== 2. 从磁芯规格库导入数据 ====================
function importCoreFromSpecs() {
    const params = new URLSearchParams(window.location.search);
    const core = params.get('core');
    const ae = params.get('ae');
    const le = params.get('le');
    const ve = params.get('ve');
    const aw = params.get('aw');
    const bs = params.get('bs');
    const mu = params.get('mu');
    const supplier = params.get('supplier');
    const type = params.get('type');

    if (!core) {
        if (coreImportInfo) coreImportInfo.innerHTML = '<span style="color:#8a9bb5;">未导入磁芯数据，请从磁芯规格库选择</span>';
        return;
    }

    const coreKey = core.replace(/[/-]/g, '_');
    if (CORE_DATA[coreKey]) {
        tfCore.value = coreKey;
    } else {
        const newOption = document.createElement('option');
        newOption.value = coreKey;
        newOption.textContent = `${core} (${supplier || ''}) Ae=${parseFloat(ae||0).toFixed(2)}`;
        newOption.selected = true;
        tfCore.appendChild(newOption);
        CORE_DATA[coreKey] = { Ae: parseFloat(ae) || 0.5, Le: parseFloat(le) || 6.0, Ve: parseFloat(ve) || 3.0, Aw: parseFloat(aw) || 1.0, name: core };
        tfCore.value = coreKey;
    }

    const coreD = CORE_DATA[coreKey] || { Ae: parseFloat(ae) || 0, name: core };
    resAe.textContent = (coreD.Ae || parseFloat(ae) || 0).toFixed(2) + ' cm²';
    
    if (coreImportInfo) {
        coreImportInfo.innerHTML = `
            <div style="background:#eef2ff;border-radius:12px;padding:10px;font-size:0.82rem;">
                ✅ 已导入: <strong>${core}</strong> ${supplier ? '| 供应商: ' + supplier : ''}
                | Ae=${parseFloat(ae||0).toFixed(2)}cm² le=${parseFloat(le||0).toFixed(1)}cm
            </div>`;
    }
    calculateTransformer();
}

// ==================== 3. 核心计算 ====================
function calculateTransformer() {
    const Vin = parseFloat(tfVin.value);
    const Vout = parseFloat(tfVout.value);
    const Iout = parseFloat(tfIout.value);
    const fsw_kHz = parseFloat(tfFsw.value);
    const Dmax = parseFloat(tfDmax.value);
    const eff = parseFloat(tfEff.value);
    const coreKey = tfCore.value;
    const J = parseFloat(tfJ.value);
    const Ku = parseFloat(tfKu.value);
    const deltaB = parseFloat(tfDeltaB.value);

    if ([Vin, Vout, Iout, fsw_kHz, Dmax, eff, J, Ku, deltaB].some(v => isNaN(v) || v <= 0)) {
        resTurnsRatio.textContent = '---';
        resNp.textContent = '---'; resNs.textContent = '---';
        resIp.textContent = '---'; resIs.textContent = '---';
        return;
    }

    const core = CORE_DATA[coreKey];
    const fsw = fsw_kHz * 1000;
    const config = TOPO_CONFIG[currentTopo];
    if (!core) { resAe.textContent = '请选择磁芯'; return; }

    if (currentTopo === 'boost' || currentTopo === 'buck') {
        const Pout = Vout * Iout;
        const Pin = Pout / eff;
        let L, Ipk, I_rms;
        if (currentTopo === 'boost') {
            const D = 1 - Vin / Vout;
            const Iin = Pin / Vin;
            const dI = Iin * 0.3;
            L = Vin * D / (dI * fsw);
            Ipk = Iin + dI/2;
            I_rms = Math.sqrt(Iin * Iin + (dI*dI)/12);
            resLg.textContent = (L * 1e6).toFixed(1) + ' μH';
            resTurnsRatio.textContent = (Vout/Vin).toFixed(2);
            resNp.textContent = 'N/A (非隔离)'; resNs.textContent = 'N/A';
            resIp.textContent = Ipk.toFixed(2) + ' A (pk)';
            const wireArea = I_rms / J;
            const awg = selectJIS5(wireArea);
            resAwg.textContent = awg ? 'JIS5 #' + awg : '>#0';
            resIs.textContent = I_rms.toFixed(2) + ' A (rms)';
        } else {
            const D = Vout / Vin;
            const dI = Iout * 0.3;
            L = (Vin - Vout) * D / (dI * fsw);
            Ipk = Iout + dI/2;
            I_rms = Math.sqrt(Iout * Iout + (dI*dI)/12);
            resLg.textContent = (L * 1e6).toFixed(1) + ' μH';
            resTurnsRatio.textContent = D.toFixed(3);
            resNp.textContent = 'N/A (非隔离)'; resNs.textContent = 'N/A';
            resIp.textContent = Ipk.toFixed(2) + ' A (pk)';
            const wireArea = I_rms / J;
            const awg = selectJIS5(wireArea);
            resAwg.textContent = awg ? 'JIS5 #' + awg : '>#0';
            resIs.textContent = I_rms.toFixed(2) + ' A (rms)';
        }
        return;
    }

    const Vin_eff = Vin * config.Vdc;
    const Np = Math.ceil(Vin_eff * Dmax / (4.44 * fsw * deltaB * core.Ae * 1e-4));
    const Vsec_eff = Vout * config.Vsec;
    const Ns = Math.ceil(Np * Vsec_eff / Vin_eff);
    const turnsRatio = (Np / Ns).toFixed(2);

    const mu0 = 4 * Math.PI * 1e-7;
    const mur_eff = 100;
    const Lg_mm = (mu0 * mur_eff * Np * Np * core.Ae * 1e-4) / (core.Le * 1e-3) * 1000;

    const Pout = Vout * Iout;
    const Pin = Pout / eff;
    let Ipri, Isec;
    if (config.IpriType === 'avg') Ipri = Pin / Vin_eff;
    else Ipri = Pin / Vin_eff * 1.2;
    if (config.IsecType === 'avg') Isec = Iout;
    else Isec = Iout * 1.3;

    const wireAreaPri = Ipri / J;
    const wireAreaSec = Isec / J;
    const jisPri = selectJIS5(wireAreaPri);
    const jisSec = selectJIS5(wireAreaSec);
    const jisDisplay = jisPri === jisSec ? `JIS5 #${jisPri}` : `Pri: JIS5 #${jisPri}, Sec: JIS5 #${jisSec}`;

    resTurnsRatio.textContent = `${Np}:${Ns}`;
    resNp.textContent = Np + ' 匝';
    resNs.textContent = Ns + ' 匝';
    resAe.textContent = (core.Ae || 0).toFixed(2) + ' cm²';
    resLg.textContent = Lg_mm.toFixed(2) + ' mm';
    resIp.textContent = Ipri.toFixed(2) + ' A';
    resIs.textContent = Isec.toFixed(2) + ' A';
    resAwg.textContent = jisDisplay;
}

function selectJIS5(area_mm2) {
    if (area_mm2 <= 0) return null;
    for (const wire of JIS5_WIRE_TABLE) {
        if (wire.area >= area_mm2) return wire.awg;
    }
    return null;
}

// ==================== 4. 多股膜包线计算 ====================
function populateLitzWireSelect() {
    if (!litzWireSel) return;
    litzWireSel.innerHTML = '<option value="">-- 选择线径 --</option>';
    JIS5_WIRE_TABLE.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.d_nom;
        opt.textContent = `JIS5 #${w.awg} (ø${w.d_nom.toFixed(3)}mm / 完ø${w.d_max.toFixed(3)}mm)`;
        litzWireSel.appendChild(opt);
    });
}

function calculateLitzWire() {
    const selectedDia = parseFloat(litzWireSel.value);
    const strands = parseInt(litzStrands.value);
    let d_nom, d_max;
    
    if (!isNaN(selectedDia) && selectedDia > 0) {
        // 找到对应的JIS5规格
        const wire = JIS5_WIRE_TABLE.find(w => w.d_nom === selectedDia);
        if (wire) {
            d_nom = wire.d_nom;
            d_max = wire.d_max;
        }
    }
    
    // 也允许手动输入
    if (isNaN(d_nom) || d_nom <= 0) {
        d_nom = parseFloat(document.getElementById('litzManualDia').value);
        if (isNaN(d_nom) || d_nom <= 0) { alert('请选择或输入导线直径'); return; }
        d_max = d_nom * 1.08; // 估算含漆膜
    }
    
    if (isNaN(strands) || strands < 1) { alert('请输入有效股数'); return; }

    // 填充系数
    const fill = getLitzFillFactor(strands);
    
    // 单股面积
    const singleArea = Math.PI * d_nom * d_nom / 4;
    const totalArea = singleArea * strands;
    
    // 等效圆直径（理想）
    const equivDia = d_nom * Math.sqrt(strands);
    
    // 最大完成外径（考虑填充系数和漆膜）
    const outerMax = equivDia / Math.sqrt(fill) + (d_max - d_nom);
    
    // 最小完成外径（理想紧密堆积）
    const outerMin = d_nom * Math.sqrt(strands / fill);
    
    // 直流电阻（20°C）
    const singleRes = 1.724e-8 * 1000 / (singleArea * 1e-6); // Ω/m
    const totalRes = singleRes / strands;
    
    // 更新结果
    if (litzResDia) litzResDia.textContent = d_nom.toFixed(3) + ' mm';
    if (litzResMaxDia) litzResMaxDia.textContent = d_max.toFixed(3) + ' mm';
    if (litzResStrands) litzResStrands.textContent = strands + ' 股';
    if (litzResFill) litzResFill.textContent = (fill * 100).toFixed(1) + '%';
    if (litzResArea) litzResArea.textContent = totalArea.toFixed(4) + ' mm²';
    if (litzResRes) litzResRes.textContent = totalRes.toFixed(5) + ' Ω/m';
    
    // 更新外径显示
    if (litzOuterMax) litzOuterMax.textContent = outerMax.toFixed(3) + ' mm';
    if (litzOuterMin) litzOuterMin.textContent = outerMin.toFixed(3) + ' mm';
}

// 选择线径时自动填充
function onLitzWireSelectChange() {
    const val = litzWireSel.value;
    if (val) {
        const wire = JIS5_WIRE_TABLE.find(w => w.d_nom === parseFloat(val));
        if (wire) {
            const manualDia = document.getElementById('litzManualDia');
            if (manualDia) manualDia.value = wire.d_nom;
        }
    }
}

// ==================== 5. 事件绑定 ====================
tfCalcBtn.addEventListener('click', calculateTransformer);

const tfInputs = [tfVin, tfVout, tfIout, tfFsw, tfDmax, tfEff, tfJ, tfKu, tfDeltaB];
tfInputs.forEach(input => {
    input.addEventListener('change', () => { calculateTransformer(); updateSchematic(); });
    input.addEventListener('input', () => { calculateTransformer(); });
});

tfCore.addEventListener('change', () => {
    const core = CORE_DATA[tfCore.value];
    if (core && resAe) resAe.textContent = (core.Ae || 0).toFixed(2) + ' cm²';
    calculateTransformer();
});

[tfVin, tfVout, tfFsw, tfDmax].forEach(input => {
    input.addEventListener('change', () => updateSchematic());
});

if (litzCalcBtn) litzCalcBtn.addEventListener('click', calculateLitzWire);
if (litzWireSel) litzWireSel.addEventListener('change', onLitzWireSelectChange);
if (litzStrands) litzStrands.addEventListener('change', calculateLitzWire);
if (litzStrands) litzStrands.addEventListener('input', calculateLitzWire);

// 线径表点击填充
document.querySelectorAll('.wire-select').forEach(row => {
    row.addEventListener('click', function() {
        const dia = this.dataset.dia;
        const awg = this.dataset.awg;
        // 填充到多股膜包线选择框
        if (litzWireSel && dia) {
            // 查找最接近的JIS5规格
            const wire = JIS5_WIRE_TABLE.find(w => Math.abs(w.d_nom - parseFloat(dia)) < 0.005);
            if (wire) {
                litzWireSel.value = wire.d_nom;
                onLitzWireSelectChange();
                calculateLitzWire();
            }
        }
        // 填充到电流密度计算的直径显示
        const manualDia = document.getElementById('litzManualDia');
        if (manualDia && dia) manualDia.value = dia;
    });
});

// ==================== 6. 填充JIS5线径表 ====================
function populateJIS5Table() {
    const tbody = document.getElementById('jis5TableBody');
    if (!tbody) return;
    tbody.innerHTML = JIS5_WIRE_TABLE.map(w => {
        const current = 4 * w.area;
        return `<tr class="wire-select" data-dia="${w.d_nom}" data-awg="${w.awg}" style="cursor:pointer;">
            <td><strong>#${w.awg}</strong></td>
            <td>${w.d_nom.toFixed(3)}</td>
            <td>${w.d_max.toFixed(3)}</td>
            <td>${w.area.toFixed(4)}</td>
            <td>${w.res.toFixed(4)}</td>
            <td>${current.toFixed(2)}</td>
        </tr>`;
    }).join('');

    // 绑定点击事件
    tbody.querySelectorAll('.wire-select').forEach(row => {
        row.addEventListener('click', function() {
            const dia = parseFloat(this.dataset.dia);
            if (!isNaN(dia) && litzWireSel) {
                const wire = JIS5_WIRE_TABLE.find(w => w.d_nom === dia);
                if (wire) {
                    litzWireSel.value = wire.d_nom;
                    onLitzWireSelectChange();
                    calculateLitzWire();
                }
            }
        });
    });
}

// ==================== 7. 初始化 ====================
function init() {
    populateLitzWireSelect();
    populateJIS5Table();
    importCoreFromSpecs();
    updateSchematic();
    updateTopoDefaults();
    calculateTransformer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}