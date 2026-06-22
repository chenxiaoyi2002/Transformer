/**
 * 变压器设计计算平台 - JavaScript 业务逻辑
 * 对应 index/变压器计算.html
 * 
 * 支持拓扑: 正激、反激、推挽、半桥、全桥、LLC半桥、移相全桥
 * 功能: 匝数计算、气隙设计、线径选择、原理图切换
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

// ==================== 拓扑参数配置 ====================
const TOPO_CONFIG = {
    forward: {
        name: '正激变压器',
        icon: '➡️',
        title: '正激变压器原理图 (Forward Converter)',
        desc: '开关管导通时能量传递到副边，适用于中等功率 (50W~500W)',
        dutyMax: 0.45,
        Vdc: 1.0,      // 输入电压为直流母线电压
        Vsec: 1.0,     // 副边电压与输出相同（无倍压）
        IpriType: 'avg', // 原边电流类型：平均值
        IsecType: 'avg', // 副边电流类型：平均值
        hasClamp: true,
        notes: '开关管导通时能量传递到副边，关断时通过钳位电路释放励磁能量。'
    },
    flyback: {
        name: '反激变压器',
        icon: '🔄',
        title: '反激变压器原理图 (Flyback Converter)',
        desc: '开关管导通时储能，关断时释放能量到副边，适用于小功率 (5W~150W)',
        dutyMax: 0.5,
        Vdc: 1.0,
        Vsec: 1.0,
        IpriType: 'avg',
        IsecType: 'peak',
        hasClamp: false,
        notes: '反激变压器实际为耦合电感，利用气隙储能。Dmax通常<0.5。'
    },
    pushpull: {
        name: '推挽变压器',
        icon: '↔️',
        title: '推挽变压器原理图 (Push-Pull Converter)',
        desc: '两个开关管交替导通，适用于中等功率 (100W~500W)',
        dutyMax: 0.45,
        Vdc: 1.0,
        Vsec: 2.0,     // 副边电压为输入的一半（中心抽头）
        IpriType: 'avg',
        IsecType: 'avg',
        hasClamp: false,
        notes: '推挽需要中心抽头副边，原边两个绕组交替导通。'
    },
    halfbridge: {
        name: '半桥变压器',
        icon: '🌉',
        title: '半桥变压器原理图 (Half-Bridge Converter)',
        desc: '两个开关管互补导通，适用于中等功率 (100W~500W)',
        dutyMax: 0.45,
        Vdc: 0.5,      // 半桥输入电压为母线的一半
        Vsec: 1.0,
        IpriType: 'avg',
        IsecType: 'avg',
        hasClamp: false,
        notes: '半桥拓扑输入电压为母线电压的一半，需要两个高压电容分压。'
    },
    fullbridge: {
        name: '全桥变压器',
        icon: '🌁',
        title: '全桥变压器原理图 (Full-Bridge Converter)',
        desc: '四个开关管组成桥臂，适用于大功率 (500W~2000W)',
        dutyMax: 0.45,
        Vdc: 1.0,
        Vsec: 1.0,
        IpriType: 'avg',
        IsecType: 'avg',
        hasClamp: false,
        notes: '全桥拓扑输入电压为母线电压，变压器利用率高，适合大功率。'
    },
    llc: {
        name: 'LLC半桥变压器',
        icon: '🎯',
        title: 'LLC半桥谐振变压器 (LLC Half-Bridge)',
        desc: '利用谐振实现软开关，适用于高效率大功率 (200W~2000W)',
        dutyMax: 0.5,
        Vdc: 0.5,
        Vsec: 1.0,
        IpriType: 'rms',
        IsecType: 'rms',
        hasClamp: false,
        notes: 'LLC变压器需要考虑谐振电感（通常为变压器漏感），计算需考虑增益曲线。'
    },
    phasefull: {
        name: '移相全桥变压器',
        icon: '📐',
        title: '移相全桥变压器 (Phase-Shifted Full-Bridge)',
        desc: '通过移相控制实现软开关，适用于大功率 (500W~3000W)',
        dutyMax: 0.8,
        Vdc: 1.0,
        Vsec: 1.0,
        IpriType: 'rms',
        IsecType: 'avg',
        hasClamp: true,
        notes: '移相全桥通过调节相位实现ZVS，需要考虑占空比丢失。'
    }
};

// ==================== 原理图 SVG 模板 ====================
const SCHEMATICS = {
    forward: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="110" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="130" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Q1</text>
            <g transform="translate(180, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#1e4a76" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#0c4a6e">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">1:Ns</text>
            </g>
            <rect x="290" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="307" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="350" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="375" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="430" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="450" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="500" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="525" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="130" x2="110" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="150" y1="130" x2="180" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="260" y1="130" x2="290" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="325" y1="130" x2="350" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="400" y1="130" x2="430" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="470" y1="130" x2="500" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="200" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">开关管导通时能量传递到副边</text>
            <text x="200" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于中等功率 (50W~500W)</text>
        </svg>`,
    flyback: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="110" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="130" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Q1</text>
            <g transform="translate(180, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#8b5cf6" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#8b5cf6" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#5b21b6">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">带气隙</text>
            </g>
            <rect x="290" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="307" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="350" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="375" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="430" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="450" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="500" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="525" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="130" x2="110" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="150" y1="130" x2="180" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="260" y1="130" x2="290" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="325" y1="130" x2="350" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="400" y1="130" x2="430" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="470" y1="130" x2="500" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="200" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">开关管导通时储能，关断时释放</text>
            <text x="200" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于小功率 (5W~150W)</text>
        </svg>`,
    pushpull: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="100" y="100" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="116" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q1</text>
            <rect x="100" y="135" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="151" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q2</text>
            <g transform="translate(180, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#1e4a76" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#0c4a6e">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">1:1:Ns</text>
            </g>
            <rect x="290" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="307" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="350" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="375" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="430" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="450" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="500" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="525" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="112" x2="100" y2="112" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="148" x2="100" y2="148" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="112" x2="180" y2="112" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="148" x2="180" y2="148" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="260" y1="130" x2="290" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="325" y1="130" x2="350" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="400" y1="130" x2="430" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="470" y1="130" x2="500" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="200" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">两个开关管交替导通，中心抽头副边</text>
            <text x="200" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于中等功率 (100W~500W)</text>
        </svg>`,
    halfbridge: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="100" y="100" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="116" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q1</text>
            <rect x="100" y="135" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="151" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q2</text>
            <rect x="150" y="115" width="30" height="20" fill="#d1fae5" stroke="#10b981" stroke-width="1.5" rx="2"/>
            <text x="165" y="129" text-anchor="middle" font-size="8" fill="#065f46">C1</text>
            <rect x="150" y="135" width="30" height="20" fill="#d1fae5" stroke="#10b981" stroke-width="1.5" rx="2"/>
            <text x="165" y="149" text-anchor="middle" font-size="8" fill="#065f46">C2</text>
            <g transform="translate(220, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#1e4a76" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#0c4a6e">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">1:Ns</text>
            </g>
            <rect x="330" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="347" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="390" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="415" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="470" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="490" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="530" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="555" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="112" x2="100" y2="112" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="148" x2="100" y2="148" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="112" x2="150" y2="112" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="148" x2="150" y2="148" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="180" y1="112" x2="220" y2="112" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="180" y1="148" x2="220" y2="148" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="300" y1="130" x2="330" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="365" y1="130" x2="390" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="440" y1="130" x2="470" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="510" y1="130" x2="530" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="300" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">两个开关管互补导通，输入电压为母线一半</text>
            <text x="300" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于中等功率 (100W~500W)</text>
        </svg>`,
    fullbridge: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="100" y="95" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="110" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q1</text>
            <rect x="100" y="120" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="135" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q2</text>
            <rect x="100" y="145" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="160" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q3</text>
            <rect x="100" y="170" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="185" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q4</text>
            <g transform="translate(180, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#1e4a76" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#0c4a6e">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">1:Ns</text>
            </g>
            <rect x="290" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="307" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="350" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="375" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="430" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="450" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="500" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="525" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="106" x2="100" y2="106" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="130" x2="100" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="154" x2="100" y2="154" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="178" x2="100" y2="178" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="106" x2="180" y2="106" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="178" x2="180" y2="178" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="260" y1="130" x2="290" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="325" y1="130" x2="350" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="400" y1="130" x2="430" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="470" y1="130" x2="500" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="300" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">四个开关管组成桥臂，变压器利用率高</text>
            <text x="300" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于大功率 (500W~2000W)</text>
        </svg>`,
    llc: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="100" y="115" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="131" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q1</text>
            <rect x="100" y="145" width="35" height="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="161" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q2</text>
            <rect x="150" y="115" width="30" height="55" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5" rx="2"/>
            <text x="165" y="145" text-anchor="middle" font-size="8" fill="#9d174d">Lr</text>
            <g transform="translate(220, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#8b5cf6" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#8b5cf6" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#5b21b6">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">含Lr</text>
            </g>
            <rect x="330" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="347" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="390" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="415" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="470" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="490" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="530" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="555" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="127" x2="100" y2="127" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="157" x2="100" y2="157" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="127" x2="150" y2="127" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="157" x2="150" y2="157" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="180" y1="127" x2="220" y2="127" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="180" y1="157" x2="220" y2="157" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="300" y1="130" x2="330" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="365" y1="130" x2="390" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="440" y1="130" x2="470" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="510" y1="130" x2="530" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="300" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">利用谐振实现软开关，高效率</text>
            <text x="300" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于大功率 (200W~2000W)</text>
        </svg>`,
    phasefull: `
        <svg viewBox="0 0 600 280" style="width:100%; max-width:700px;">
            <rect x="30" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="55" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Vin</text>
            <rect x="100" y="95" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="110" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q1</text>
            <rect x="100" y="120" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="135" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q2</text>
            <rect x="100" y="145" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="160" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q3</text>
            <rect x="100" y="170" width="35" height="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="117" y="185" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Q4</text>
            <g transform="translate(180, 80)">
                <rect x="0" y="0" width="80" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="6"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="40" x2="70" y2="40" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="60" x2="70" y2="60" stroke="#1e4a76" stroke-width="2"/>
                <line x1="10" y1="80" x2="70" y2="80" stroke="#1e4a76" stroke-width="2"/>
                <text x="40" y="55" text-anchor="middle" font-size="10" font-weight="700" fill="#0c4a6e">T1</text>
                <text x="40" y="70" text-anchor="middle" font-size="8" fill="#4b556b">1:Ns</text>
            </g>
            <rect x="290" y="115" width="35" height="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/>
            <text x="307" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">D1</text>
            <rect x="350" y="110" width="50" height="40" fill="#eef3fc" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="375" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e4a76">Lf</text>
            <rect x="430" y="115" width="40" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="3"/>
            <text x="450" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Co</text>
            <rect x="500" y="115" width="50" height="30" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="3"/>
            <text x="525" y="134" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Load</text>
            <line x1="80" y1="106" x2="100" y2="106" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="130" x2="100" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="154" x2="100" y2="154" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="80" y1="178" x2="100" y2="178" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="106" x2="180" y2="106" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="135" y1="178" x2="180" y2="178" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="260" y1="130" x2="290" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="325" y1="130" x2="350" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="400" y1="130" x2="430" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <line x1="470" y1="130" x2="500" y2="130" stroke="#1a2c3e" stroke-width="2"/>
            <text x="300" y="210" text-anchor="middle" font-size="9" fill="#6b7a95">通过移相控制实现ZVS软开关</text>
            <text x="300" y="225" text-anchor="middle" font-size="9" fill="#6b7a95">适用于大功率 (500W~3000W)</text>
        </svg>`
};

// ==================== 全局状态 ====================
let currentTopo = 'forward';

// ==================== DOM 引用 ====================
const topoBtns = document.querySelectorAll('.topo-btn');
const schematicTitle = document.querySelector('.schematic-title');
const schematicContainer = document.getElementById('schematicContainer');
const tfCalcBtn = document.getElementById('tfCalcBtn');

// 输入参数
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

// 结果显示
const resTurnsRatio = document.getElementById('resTurnsRatio');
const resNp = document.getElementById('resNp');
const resNs = document.getElementById('resNs');
const resAe = document.getElementById('resAe');
const resLg = document.getElementById('resLg');
const resIp = document.getElementById('resIp');
const resIs = document.getElementById('resIs');
const resAwg = document.getElementById('resAwg');

// ==================== 1. 拓扑切换 ====================
topoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        topoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTopo = btn.dataset.topo;
        updateSchematic();
        updateTopoDefaults();
    });
});

function updateSchematic() {
    const config = TOPO_CONFIG[currentTopo];
    schematicTitle.textContent = '📐 ' + config.title;
    schematicContainer.innerHTML = SCHEMATICS[currentTopo] || SCHEMATICS.forward;
}

function updateTopoDefaults() {
    const config = TOPO_CONFIG[currentTopo];
    tfDmax.value = config.dutyMax;
    // 可以在这里根据拓扑调整其他默认值
}

// ==================== 2. 核心计算 ====================
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
        alert('请输入有效的正数参数');
        return;
    }

    const core = CORE_DATA[coreKey];
    const fsw = fsw_kHz * 1000;
    const config = TOPO_CONFIG[currentTopo];

    // ----- 匝数计算 -----
    // N = V / (4.44 * f * B * Ae)
    const Vin_eff = Vin * config.Vdc;
    const Np = Math.ceil(Vin_eff * Dmax / (4.44 * fsw * deltaB * core.Ae * 1e-4));
    const Vsec_eff = Vout * config.Vsec;
    const Ns = Math.ceil(Np * Vsec_eff / Vin_eff);
    const turnsRatio = (Np / Ns).toFixed(2);

    // ----- 气隙计算 -----
    // lg = (μ0 * μr * Np^2 * Ae) / Leff
    // 对于反激等需要气隙的拓扑，计算气隙
    const mu0 = 4 * Math.PI * 1e-7;
    const mur_eff = 100; // 有效磁导率（考虑气隙后）
    const Lg_mm = (mu0 * mur_eff * Np * Np * core.Ae * 1e-4) / (core.Le * 1e-3) * 1000;

    // ----- 电流计算 -----
    const Pout = Vout * Iout;
    const Pin = Pout / eff;
    let Ipri, Isec;

    if (config.IpriType === 'avg') {
        Ipri = Pin / Vin_eff;
    } else {
        Ipri = Pin / Vin_eff * 1.2; // RMS 估算
    }

    if (config.IsecType === 'avg') {
        Isec = Iout;
    } else {
        Isec = Iout * 1.3; // 峰值估算
    }

    // ----- 线径选择 -----
    const wireAreaPri = Ipri / J;
    const wireAreaSec = Isec / J;
    const awgPri = selectAWG(wireAreaPri);
    const awgSec = selectAWG(wireAreaSec);
    const awgDisplay = awgPri === awgSec ? `Pri/Sec: AWG${awgPri}` : `Pri: AWG${awgPri}, Sec: AWG${awgSec}`;

    // ----- 更新显示 -----
    resTurnsRatio.textContent = `${Np}:${Ns}`;
    resNp.textContent = Np + ' 匝';
    resNs.textContent = Ns + ' 匝';
    resAe.textContent = core.Ae + ' cm²';
    resLg.textContent = Lg_mm.toFixed(2) + ' mm';
    resIp.textContent = Ipri.toFixed(2) + ' A';
    resIs.textContent = Isec.toFixed(2) + ' A';
    resAwg.textContent = awgDisplay;
}

function selectAWG(area_mm2) {
    const awgTable = [
        { awg: 18, d: 1.02, a: 0.823 },
        { awg: 17, d: 1.15, a: 1.04 },
        { awg: 16, d: 1.29, a: 1.31 },
        { awg: 15, d: 1.45, a: 1.65 },
        { awg: 14, d: 1.63, a: 2.08 },
        { awg: 13, d: 1.83, a: 2.62 },
        { awg: 12, d: 2.05, a: 3.31 },
        { awg: 11, d: 2.30, a: 4.17 },
        { awg: 10, d: 2.59, a: 5.26 }
    ];

    for (const row of awgTable) {
        if (row.a >= area_mm2) return row.awg;
    }
    return 10; // 默认最大
}

// ==================== 3. 事件绑定 ====================
tfCalcBtn.addEventListener('click', calculateTransformer);

// 输入变化自动计算
const tfInputs = [tfVin, tfVout, tfIout, tfFsw, tfDmax, tfEff, tfJ, tfKu, tfDeltaB];
tfInputs.forEach(input => {
    input.addEventListener('change', calculateTransformer);
    input.addEventListener('input', calculateTransformer);
});

// 磁芯选择变化
tfCore.addEventListener('change', () => {
    const core = CORE_DATA[tfCore.value];
    if (core) {
        resAe.textContent = core.Ae + ' cm²';
    }
});

// ==================== 4. 初始化 ====================
function init() {
    updateSchematic();
    updateTopoDefaults();
    calculateTransformer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}