/**
 * 常用磁芯规格库 - JavaScript 业务逻辑
 * 对应 index/常用磁芯规格.html
 * 
 * 功能:
 * 1. 磁芯规格数据库 (EE, EI, ETD, ER, PQ, RM, Toroid)
 * 2. 搜索与筛选
 * 3. 规格详情展示
 * 4. 统计信息
 */

// ==================== 磁芯规格数据库 ====================
const CORE_SPECS = [
    // EE 型铁氧体
    { id: 'EE16', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.16, Le: 3.2, Ve: 0.51, Aw: 0.21, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE20', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.25, Le: 4.0, Ve: 1.00, Aw: 0.35, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE25', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE30', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE35', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE40', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE50', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 3.02, Le: 12.2, Ve: 36.8, Aw: 4.21, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    { id: 'EE65', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 5.20, Le: 15.5, Ve: 80.6, Aw: 7.12, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE' },
    
    // EI 型铁氧体
    { id: 'EI25', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI' },
    { id: 'EI30', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI' },
    { id: 'EI35', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI' },
    
    // ETD 型铁氧体
    { id: 'ETD29', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 0.72, Le: 6.5, Ve: 4.70, Aw: 1.02, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    { id: 'ETD34', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.02, Le: 7.8, Ve: 7.96, Aw: 1.45, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    { id: 'ETD39', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.42, Le: 9.2, Ve: 13.1, Aw: 1.98, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    { id: 'ETD44', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.76, Le: 10.5, Ve: 18.5, Aw: 2.52, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    { id: 'ETD49', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 2.30, Le: 11.8, Ve: 27.1, Aw: 3.15, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    { id: 'ETD54', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 3.20, Le: 13.5, Ve: 43.2, Aw: 4.20, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD' },
    
    // ER 型铁氧体
    { id: 'ER35', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 1.10, Le: 8.2, Ve: 9.02, Aw: 1.55, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER' },
    { id: 'ER42', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 1.65, Le: 9.8, Ve: 16.2, Aw: 2.20, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER' },
    { id: 'ER49', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 2.40, Le: 11.5, Ve: 27.6, Aw: 3.05, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER' },
    
    // PQ 型铁氧体
    { id: 'PQ20/20', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 0.76, Le: 6.8, Ve: 5.17, Aw: 1.08, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ' },
    { id: 'PQ26/25', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 1.10, Le: 8.2, Ve: 9.02, Aw: 1.55, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ' },
    { id: 'PQ35/35', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ' },
    { id: 'PQ40/40', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 2.30, Le: 10.0, Ve: 23.0, Aw: 2.65, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ' },
    { id: 'PQ50/50', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 3.80, Le: 12.5, Ve: 47.5, Aw: 4.10, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ' },
    
    // RM 型铁氧体
    { id: 'RM5', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.28, Le: 4.5, Ve: 1.26, Aw: 0.42, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    { id: 'RM6', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.45, Le: 5.8, Ve: 2.61, Aw: 0.68, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    { id: 'RM8', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.78, Le: 7.2, Ve: 5.62, Aw: 1.12, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    { id: 'RM10', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 1.20, Le: 8.8, Ve: 10.6, Aw: 1.65, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    { id: 'RM12', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 1.85, Le: 10.5, Ve: 19.4, Aw: 2.40, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    { id: 'RM14', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 2.60, Le: 12.2, Ve: 31.7, Aw: 3.25, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM' },
    
    // Toroid 环形铁氧体
    { id: 'T16x10x5', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.12, Le: 2.8, Ve: 0.34, Aw: 0.18, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    { id: 'T20x12x6', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.22, Le: 3.8, Ve: 0.84, Aw: 0.30, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    { id: 'T25x15x8', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.40, Le: 5.0, Ve: 2.00, Aw: 0.52, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    { id: 'T30x20x10', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.65, Le: 6.5, Ve: 4.23, Aw: 0.80, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    { id: 'T36x23x12', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.95, Le: 8.0, Ve: 7.60, Aw: 1.15, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    { id: 'T42x28x14', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 1.45, Le: 9.8, Ve: 14.2, Aw: 1.70, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid' },
    
    // 金属磁芯 - 铁粉芯
    { id: 'EE16-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.16, Le: 3.2, Ve: 0.51, Aw: 0.21, Bs: 1.5, Hc: 80, mu: 75, series: 'EE' },
    { id: 'EE25-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.5, Hc: 80, mu: 75, series: 'EE' },
    { id: 'EE30-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.5, Hc: 80, mu: 75, series: 'EE' },
    { id: 'EE40-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 1.5, Hc: 80, mu: 75, series: 'EE' },
    
    // 金属磁芯 - 铁硅铝 (Sendust)
    { id: 'EE25-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.0, Hc: 40, mu: 60, series: 'EE' },
    { id: 'EE30-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.0, Hc: 40, mu: 60, series: 'EE' },
    { id: 'EE35-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 1.0, Hc: 40, mu: 60, series: 'EE' },
    { id: 'PQ35/35-Sendust', type: 'PQ', material: 'sendust', materialName: '铁硅铝', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 1.0, Hc: 40, mu: 60, series: 'PQ' },
    
    // 金属磁芯 - MPP
    { id: 'EE25-MPP', type: 'EE', material: 'mpp', materialName: 'MPP', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.7, Hc: 25, mu: 125, series: 'EE' },
    { id: 'EE30-MPP', type: 'EE', material: 'mpp', materialName: 'MPP', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.7, Hc: 25, mu: 125, series: 'EE' },
    { id: 'PQ35/35-MPP', type: 'PQ', material: 'mpp', materialName: 'MPP', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 0.7, Hc: 25, mu: 125, series: 'PQ' },
    
    // 金属磁芯 - 高磁通
    { id: 'EE25-HF', type: 'EE', material: 'hf', materialName: '高磁通', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.5, Hc: 60, mu: 60, series: 'EE' },
    { id: 'EE30-HF', type: 'EE', material: 'hf', materialName: '高磁通', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.5, Hc: 60, mu: 60, series: 'EE' },
    { id: 'PQ35/35-HF', type: 'PQ', material: 'hf', materialName: '高磁通', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 1.5, Hc: 60, mu: 60, series: 'PQ' }
];

// ==================== 全局状态 ====================
let selectedCoreId = null;
let filteredSpecs = [...CORE_SPECS];

// ==================== DOM 引用 ====================
const specSearch = document.getElementById('specSearch');
const specTypeFilter = document.getElementById('specTypeFilter');
const specMaterialFilter = document.getElementById('specMaterialFilter');
const specTableBody = document.getElementById('specTableBody');
const specDetailBody = document.getElementById('specDetailBody');
const statTotal = document.getElementById('statTotal');
const statFerrite = document.getElementById('statFerrite');
const statMetal = document.getElementById('statMetal');
const statFiltered = document.getElementById('statFiltered');
const tableCountBadge = document.getElementById('tableCountBadge');

// ==================== 1. 初始化 ====================
function init() {
    updateStats();
    renderTable(CORE_SPECS);
    bindEvents();
}

// ==================== 2. 统计更新 ====================
function updateStats() {
    const total = CORE_SPECS.length;
    const ferrite = CORE_SPECS.filter(c => c.material === 'ferrite').length;
    const metal = CORE_SPECS.filter(c => c.material !== 'ferrite').length;
    
    statTotal.textContent = total;
    statFerrite.textContent = ferrite;
    statMetal.textContent = metal;
    statFiltered.textContent = filteredSpecs.length;
    tableCountBadge.textContent = filteredSpecs.length + ' 条记录';
}

// ==================== 3. 表格渲染 ====================
function renderTable(specs) {
    if (specs.length === 0) {
        specTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #8a9bb5;">
                    未找到匹配的磁芯规格
                </td>
            </tr>
        `;
        return;
    }

    specTableBody.innerHTML = specs.map(spec => `
        <tr data-id="${spec.id}" class="${selectedCoreId === spec.id ? 'active' : ''}">
            <td><strong>${spec.id}</strong></td>
            <td><span class="spec-type spec-type-${spec.type.toLowerCase()}">${spec.type}</span></td>
            <td>${spec.materialName}</td>
            <td>${spec.Ae.toFixed(2)}</td>
            <td>${spec.Le.toFixed(1)}</td>
            <td>${spec.Ve.toFixed(2)}</td>
            <td>${spec.Aw.toFixed(2)}</td>
        </tr>
    `).join('');

    // 绑定点击事件
    specTableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.dataset.id;
            selectCore(id);
        });
    });
}

// ==================== 4. 选择磁芯 ====================
function selectCore(id) {
    selectedCoreId = id;
    const spec = CORE_SPECS.find(c => c.id === id);
    if (!spec) return;

    // 更新表格高亮
    specTableBody.querySelectorAll('tr').forEach(row => {
        row.classList.toggle('active', row.dataset.id === id);
    });

    // 渲染详情
    renderDetail(spec);
}

function renderDetail(spec) {
    const typeClass = `spec-type-${spec.type.toLowerCase()}`;
    
    // 计算一些衍生参数
    const C1 = spec.Le / spec.Ae;
    const Ku = 0.35; // 典型窗口利用系数
    const Np_100kHz_0_2T = Math.ceil(100000 * 0.2 * spec.Ae * 1e-4 / (4.44 * 100000 * 0.2 * spec.Ae * 1e-4)); // 简化示例
    
    specDetailBody.innerHTML = `
        <div class="spec-core-visual">
            <svg viewBox="0 0 200 160" style="width: 100%; max-width: 220px;">
                <!-- 简化的磁芯示意图 -->
                <rect x="40" y="30" width="120" height="100" fill="white" stroke="#1e4a76" stroke-width="2.5" rx="8"/>
                <rect x="55" y="45" width="90" height="70" fill="#f8fbff" stroke="#3b82f6" stroke-width="1.5" rx="4"/>
                <text x="100" y="85" text-anchor="middle" font-size="12" font-weight="700" fill="#0c4a6e">${spec.id}</text>
                <text x="100" y="102" text-anchor="middle" font-size="9" fill="#4b556b">${spec.type} 型</text>
                <text x="100" y="115" text-anchor="middle" font-size="8" fill="#6b7a95">${spec.materialName}</text>
            </svg>
        </div>
        
        <div class="spec-detail-grid">
            <div class="spec-detail-item">
                <div class="spec-detail-label">型号</div>
                <div class="spec-detail-value">${spec.id}</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">类型</div>
                <div class="spec-detail-value"><span class="spec-type ${typeClass}">${spec.type}</span></div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">材料</div>
                <div class="spec-detail-value">${spec.materialName}</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">初始磁导率 μi</div>
                <div class="spec-detail-value">${spec.mu}</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">有效截面积 Ae</div>
                <div class="spec-detail-value">${spec.Ae.toFixed(2)} cm²</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">有效磁路长度 le</div>
                <div class="spec-detail-value">${spec.Le.toFixed(1)} cm</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">有效体积 Ve</div>
                <div class="spec-detail-value">${spec.Ve.toFixed(2)} cm³</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">窗口面积 Aw</div>
                <div class="spec-detail-value">${spec.Aw.toFixed(2)} cm²</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">磁芯常数 C1</div>
                <div class="spec-detail-value">${C1.toFixed(2)} cm⁻¹</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">饱和磁密 Bs</div>
                <div class="spec-detail-value">${spec.Bs} T</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">矫顽力 Hc</div>
                <div class="spec-detail-value">${spec.Hc} A/m</div>
            </div>
            <div class="spec-detail-item">
                <div class="spec-detail-label">典型应用</div>
                <div class="spec-detail-value" style="font-size: 0.85rem;">
                    ${getTypicalApplication(spec)}
                </div>
            </div>
        </div>
        
        <div class="spec-note">
            <strong>📌 设计提示：</strong><br>
            C1 = le/Ae = ${C1.toFixed(2)} cm⁻¹，用于计算气隙和AL值。<br>
            窗口利用系数 Ku 典型值 0.3~0.4，实际设计需考虑绝缘层、骨架等占用。<br>
            ${spec.material === 'ferrite' ? '铁氧体适合高频应用（10kHz~1MHz），电阻率高，涡流损耗低。' : '金属磁粉芯适合中频应用（10kHz~500kHz），饱和磁密高，DC偏磁特性好。'}
        </div>
        
        <div class="spec-actions">
            <button class="spec-btn spec-btn-primary" onclick="copySpec('${spec.id}')">📋 复制规格</button>
            <button class="spec-btn spec-btn-secondary" onclick="useInCalculator('${spec.id}')">⚡ 用于计算</button>
        </div>
    `;
}

function getTypicalApplication(spec) {
    if (spec.material === 'ferrite') {
        if (spec.Ae < 0.5) return '小功率电源、反激变换器';
        if (spec.Ae < 1.5) return '中等功率正激、半桥';
        return '大功率全桥、LLC谐振';
    } else if (spec.material === 'iron') {
        return '储能电感、PFC电感、高功率密度';
    } else if (spec.material === 'sendust') {
        return '低损耗电感、DC-DC转换器';
    } else if (spec.material === 'mpp') {
        return '高稳定性电感、精密电源';
    } else if (spec.material === 'hf') {
        return '高储能密度、高功率应用';
    }
    return '通用功率变换器';
}

// ==================== 5. 筛选与搜索 ====================
function filterSpecs() {
    const searchText = specSearch.value.toLowerCase().trim();
    const typeFilter = specTypeFilter.value;
    const materialFilter = specMaterialFilter.value;

    filteredSpecs = CORE_SPECS.filter(spec => {
        // 文本搜索
        const matchSearch = !searchText || 
            spec.id.toLowerCase().includes(searchText) ||
            spec.type.toLowerCase().includes(searchText) ||
            spec.materialName.toLowerCase().includes(searchText) ||
            spec.series.toLowerCase().includes(searchText);
        
        // 类型筛选
        const matchType = typeFilter === 'all' || spec.type === typeFilter;
        
        // 材料筛选
        const matchMaterial = materialFilter === 'all' || spec.material === materialFilter;
        
        return matchSearch && matchType && matchMaterial;
    });

    updateStats();
    renderTable(filteredSpecs);
}

// ==================== 6. 工具函数 ====================
function copySpec(id) {
    const spec = CORE_SPECS.find(c => c.id === id);
    if (!spec) return;
    
    const text = `${spec.id}: Ae=${spec.Ae}cm², le=${spec.Le}cm, Ve=${spec.Ve}cm³, Aw=${spec.Aw}cm², Bs=${spec.Bs}T, μi=${spec.mu}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('规格已复制到剪贴板:\n' + text);
        });
    } else {
        alert('规格信息:\n' + text);
    }
}

function useInCalculator(id) {
    const spec = CORE_SPECS.find(c => c.id === id);
    if (!spec) return;
    
    // 跳转到变压器计算页面，并传递参数
    const url = '变压器计算.html?core=' + encodeURIComponent(id);
    window.location.href = url;
}

// ==================== 7. 事件绑定 ====================
function bindEvents() {
    specSearch.addEventListener('input', filterSpecs);
    specTypeFilter.addEventListener('change', filterSpecs);
    specMaterialFilter.addEventListener('change', filterSpecs);
}

// ==================== 8. 启动 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}