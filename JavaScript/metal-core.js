/**
 * 金属磁芯计算平台 - JavaScript 业务逻辑
 * 对应 index/金属磁芯计算.html
 * 
 * 功能模块:
 * 1. 材料选择与参数联动
 * 2. 电感量 L 与 AL 值计算
 * 3. 磁通密度 B 与磁场强度 H 计算
 * 4. 工作磁导率 μe（含DC偏磁修正）
 * 5. 磁芯损耗 Pv（Steinmetz 修正模型）
 * 6. DC偏磁滑动条联动
 * 7. 动态B-H回线
 * 8. 磁导率 vs DC偏磁曲线
 * 9. 损耗 vs 频率特性曲线
 */

// ==================== 材料数据库 ====================
const MATERIAL_DATA = {
    iron: {
        name: '铁粉芯',
        tag: 'Iron Powder',
        tagClass: 'material-tag-iron',
        mu: 75,
        Bs: 1.5,
        BrRatio: 0.6,   // Br/Bs
        Hc: 80,         // A/m
        // Steinmetz 系数 (k, α, β) - 中频典型值
        k: 1.8e-3,
        alpha: 1.2,
        beta: 2.3,
        // DC偏磁曲线参数 - 归一化H/Hc vs μ/μ0 拟合
        biasCurve: [1.0, 0.92, 0.78, 0.62, 0.48, 0.38, 0.30, 0.24, 0.20, 0.17]
    },
    sendust: {
        name: '铁硅铝',
        tag: 'Sendust',
        tagClass: 'material-tag-sendust',
        mu: 60,
        Bs: 1.0,
        BrRatio: 0.5,
        Hc: 40,
        k: 8.5e-4,
        alpha: 1.3,
        beta: 2.4,
        biasCurve: [1.0, 0.94, 0.85, 0.72, 0.58, 0.46, 0.36, 0.28, 0.22, 0.18]
    },
    mpp: {
        name: 'MPP (钼坡莫合金)',
        tag: 'MPP',
        tagClass: 'material-tag-mpp',
        mu: 125,
        Bs: 0.7,
        BrRatio: 0.4,
        Hc: 25,
        k: 3.2e-4,
        alpha: 1.4,
        beta: 2.5,
        biasCurve: [1.0, 0.96, 0.90, 0.80, 0.68, 0.55, 0.43, 0.34, 0.26, 0.20]
    },
    hf: {
        name: '高磁通',
        tag: 'High Flux',
        tagClass: 'material-tag-hf',
        mu: 60,
        Bs: 1.5,
        BrRatio: 0.55,
        Hc: 60,
        k: 1.2e-3,
        alpha: 1.25,
        beta: 2.35,
        biasCurve: [1.0, 0.93, 0.82, 0.68, 0.54, 0.42, 0.33, 0.26, 0.20, 0.16]
    }
};

// ==================== 图表实例 ====================
let mcHysteresisChart = null;
let mcPermeabilityChart = null;
let mcLossChart = null;

// 当前选中的材料
let currentMaterial = 'sendust';

// ==================== DOM 引用 ====================
const mcMaterial = document.getElementById('mcMaterial');
const mcMuInput = document.getElementById('mcMu');
const mcTurns = document.getElementById('mcTurns');
const mcCurrent = document.getElementById('mcCurrent');
const mcAe = document.getElementById('mcAe');
const mcLe = document.getElementById('mcLe');
const mcFreq = document.getElementById('mcFreq');
const mcVoltage = document.getElementById('mcVoltage');
const calcMcBtn = document.getElementById('calcMcBtn');
const mcMaterialName = document.getElementById('mcMaterialName');
const mcBsDisplay = document.getElementById('mcBsDisplay');
const mcInductance = document.getElementById('mcInductance');
const mcAlValue = document.getElementById('mcAlValue');
const mcBDensity = document.getElementById('mcBDensity');
const mcHStrength = document.getElementById('mcHStrength');
const mcEffMu = document.getElementById('mcEffMu');
const mcCoreLoss = document.getElementById('mcCoreLoss');
const mcBiasPercent = document.getElementById('mcBiasPercent');
const mcBiasPercentDisplay = document.getElementById('mcBiasPercentDisplay');
const mcBiasH = document.getElementById('mcBiasH');
const mcBiasMuPct = document.getElementById('mcBiasMuPct');
const mcBiasMuResult = document.getElementById('mcBiasMuResult');
const mcLossDetail = document.getElementById('mcLossDetail');
const mcLossHysteresis = document.getElementById('mcLossHysteresis');
const mcLossEddy = document.getElementById('mcLossEddy');
const mcLossVolume = document.getElementById('mcLossVolume');

// ==================== 1. 材料切换联动 ====================
function updateMaterialSelection() {
    const val = mcMaterial.value;
    const data = MATERIAL_DATA[val];
    if (!data) return;
    
    currentMaterial = val;
    mcMuInput.value = data.mu;
    mcMaterialName.innerText = data.name;
    
    // 更新材料标签
    const tagSpan = mcMaterialName.nextElementSibling;
    if (tagSpan) {
        tagSpan.className = 'material-tag ' + data.tagClass;
        tagSpan.innerText = data.tag;
    }
    
    mcBsDisplay.innerText = data.Bs;
    
    // 触发全面计算
    fullCalculation();
}

// 材料选择变化
mcMaterial.addEventListener('change', updateMaterialSelection);

// ==================== 2. 全面计算核心 ====================
function fullCalculation() {
    const materialKey = currentMaterial;
    const mat = MATERIAL_DATA[materialKey];
    if (!mat) return;
    
    const N = parseFloat(mcTurns.value);
    const I = parseFloat(mcCurrent.value);
    const Ae_mm2 = parseFloat(mcAe.value);
    const Le_mm = parseFloat(mcLe.value);
    const f_kHz = parseFloat(mcFreq.value);
    const V = parseFloat(mcVoltage.value);
    const biasPct = parseFloat(mcBiasPercent.value) / 100;
    
    if (isNaN(N) || N <= 0 || isNaN(Ae_mm2) || Ae_mm2 <= 0 ||
        isNaN(Le_mm) || Le_mm <= 0 || isNaN(f_kHz) || isNaN(V)) {
        return;
    }
    
    // 单位转换
    const Ae_m2 = Ae_mm2 * 1e-6;
    const Le_m = Le_mm * 1e-3;
    
    // 初始磁导率 (未偏磁)
    const mu0 = 4 * Math.PI * 1e-7;
    const mu_i = parseFloat(mcMuInput.value) || mat.mu;
    
    // ----- (A) 电感量 L -----
    const L_H = mu0 * mu_i * N * N * Ae_m2 / Le_m;
    const L_uH = L_H * 1e6;
    
    // ----- (B) AL 值 -----
    const AL_nH_N2 = L_uH * 1000 / (N * N);
    
    // ----- (C) 磁场强度 H (通过电流) -----
    const H_I = N * I / Le_m;
    
    // ----- (D) 偏磁修正后的有效磁导率 -----
    // 计算 H/Hc 比率
    const Hc = mat.Hc;
    const H_over_Hc = H_I / Hc;
    const biasFactor = getBiasFactor(biasPct);
    const mu_eff = mu_i * biasFactor;
    
    // ----- (E) 磁通密度 B (通过电压) -----
    const f_Hz = f_kHz * 1000;
    const B_voltage = V / (4.44 * f_Hz * N * Ae_m2);
    
    // ----- (F) 磁芯损耗 Pv -----
    const Pv = mat.k * Math.pow(f_kHz, mat.alpha) * Math.pow(B_voltage * 1000, mat.beta);
    
    // ----- 更新显示 -----
    mcInductance.innerText = L_uH.toFixed(2);
    mcAlValue.innerText = AL_nH_N2.toFixed(2);
    mcBDensity.innerText = B_voltage.toFixed(4);
    mcHStrength.innerText = H_I.toFixed(1);
    mcEffMu.innerText = mu_eff.toFixed(1);
    mcCoreLoss.innerText = Pv.toFixed(1);
    
    // 更新偏磁显示
    updateBiasDisplay(biasPct, H_I, mu_i, mat);
    
    // 更新损耗分析
    updateLossAnalysis(mat, f_kHz, B_voltage, Pv);
    
    // 更新图表
    updateMcHysteresis(mat, B_voltage, H_I);
    updatePermeabilityCurve(mat);
    updateLossSpectrum(mat, B_voltage);
}

// ==================== 3. DC偏磁修正模型 ====================
function getBiasFactor(biasPercent) {
    // 基于归一化偏磁比率 (0~1) 计算磁导率保持率
    // 使用多项式拟合: μ/μ0 = 1 - 0.5*x - 0.3*x^2 经验公式
    const x = biasPercent;
    const factor = 1 - 0.5 * x - 0.3 * x * x + 0.1 * x * x * x;
    return Math.max(0.05, Math.min(1.0, factor));
}

// ==================== 4. 偏磁显示更新 ====================
function updateBiasDisplay(biasPct, H_I, mu_i, mat) {
    const H_dc = H_I * biasPct;
    const biasFactor = getBiasFactor(biasPct);
    const mu_bias = mu_i * biasFactor;
    
    mcBiasH.innerText = H_dc.toFixed(1);
    mcBiasMuPct.innerText = (biasFactor * 100).toFixed(1) + '%';
    mcBiasMuResult.innerText = mu_bias.toFixed(1);
    
    mcBiasPercentDisplay.innerText = Math.round(biasPct * 100) + '%';
}

// 偏磁滑动条
mcBiasPercent.addEventListener('input', function() {
    fullCalculation();
});

// ==================== 5. 损耗分析 ====================
function updateLossAnalysis(mat, f_kHz, B_T, Pv_total) {
    // 磁滞损耗约占总损耗的 60~80% (金属粉芯)
    const hysteresisRatio = 0.7;
    const Ph = Pv_total * hysteresisRatio;
    const Pe = Pv_total * (1 - hysteresisRatio);
    
    mcLossDetail.innerText = Pv_total.toFixed(1);
    mcLossHysteresis.innerText = Ph.toFixed(1);
    mcLossEddy.innerText = Pe.toFixed(1);
    mcLossVolume.innerText = Pv_total.toFixed(1);
}

// ==================== 6. 计算按钮事件 ====================
calcMcBtn.addEventListener('click', fullCalculation);

// 输入变化触发计算
const mcInputs = [mcTurns, mcCurrent, mcAe, mcLe, mcFreq, mcVoltage, mcMuInput];
mcInputs.forEach(el => {
    el.addEventListener('change', fullCalculation);
    el.addEventListener('input', fullCalculation);
});

// ==================== 7. B-H 回线（金属磁芯） ====================
function catmullRomPoints(points, steps) {
    steps = steps || 25;
    if (points.length < 2) return points;
    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        for (let t = 0; t <= 1; t += 1 / steps) {
            const t2 = t * t;
            const t3 = t2 * t;
            const x = 0.5 * (
                (2 * p1.x) + (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
            );
            const y = 0.5 * (
                (2 * p1.y) + (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
            );
            result.push({ x, y });
        }
    }
    result.push(points[points.length - 1]);
    return result;
}

function updateMcHysteresis(mat, B_work, H_work) {
    const Bs = mat.Bs;
    const Br = mat.BrRatio * Bs;
    const Hc = mat.Hc;
    
    const Hmax = Math.max(3 * Math.max(H_work, Hc), 100);
    
    const upPoints = [
        { x: -Hmax, y: -Bs },
        { x: -Hc, y: 0 },
        { x: 0, y: Br },
        { x: Hc, y: 0 },
        { x: Hmax, y: Bs }
    ];
    const downPoints = [
        { x: Hmax, y: Bs },
        { x: Hc, y: 0 },
        { x: 0, y: -Br },
        { x: -Hc, y: 0 },
        { x: -Hmax, y: -Bs }
    ];
    
    const upCurve = catmullRomPoints(upPoints, 28);
    const downCurve = catmullRomPoints(downPoints, 28);
    const workPoint = { x: H_work, y: B_work };
    
    const ctx = document.getElementById('mcHysteresisCanvas').getContext('2d');
    if (mcHysteresisChart) mcHysteresisChart.destroy();
    
    mcHysteresisChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                { label: '上升支', data: upCurve.map(p => ({ x: p.x, y: p.y })), borderColor: '#8b5cf6', borderWidth: 2.5, showLine: true, pointRadius: 0, tension: 0.1 },
                { label: '下降支', data: downCurve.map(p => ({ x: p.x, y: p.y })), borderColor: '#3b82f6', borderWidth: 2.5, showLine: true, pointRadius: 0, tension: 0.1 },
                { label: '工作点', data: [workPoint], borderColor: '#ef4444', backgroundColor: '#ef4444', pointRadius: 6, pointStyle: 'triangle', showLine: false }
            ]
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
            interaction: { mode: 'nearest', intersect: true, axis: 'xy' },
            scales: {
                x: { title: { display: true, text: 'H (A/m)' } },
                y: { title: { display: true, text: 'B (T)' } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === '工作点') return '工作点: H=' + context.parsed.x.toFixed(1) + ' A/m, B=' + context.parsed.y.toFixed(4) + ' T';
                            return context.dataset.label;
                        }
                    }
                }
            }
        }
    });
}

// ==================== 8. 磁导率 vs DC偏磁曲线 ====================
function updatePermeabilityCurve(mat) {
    const points_iron = [];
    const points_sendust = [];
    const points_mpp = [];
    const points_hf = [];
    
    // 生成4种材料的偏磁曲线
    const materials = ['iron', 'sendust', 'mpp', 'hf'];
    const datasets = [];
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
    const labels = ['铁粉芯', '铁硅铝', 'MPP', '高磁通'];
    
    // 标定Hc中位值用于归一化
    materials.forEach((key, idx) => {
        const m = MATERIAL_DATA[key];
        const pts = [];
        for (let pct = 0; pct <= 100; pct += 2) {
            const x = pct; // 百分比
            const factor = getBiasFactor(pct / 100);
            const muPct = factor * 100;
            pts.push({ x: x, y: muPct });
        }
        datasets.push({
            label: labels[idx],
            data: pts.map(p => ({ x: p.x, y: p.y })),
            borderColor: colors[idx],
            borderWidth: idx === 1 ? 3 : 1.5, // 当前材料高亮
            pointRadius: 0,
            showLine: true,
            borderDash: idx === 1 ? [] : [4, 4]
        });
    });
    
    const ctx = document.getElementById('mcPermeabilityCanvas').getContext('2d');
    if (mcPermeabilityChart) mcPermeabilityChart.destroy();
    
    mcPermeabilityChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: {
            responsive: true,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    title: { display: true, text: '偏磁磁场 H/Hc (%)' },
                    min: 0,
                    max: 100
                },
                y: {
                    title: { display: true, text: '磁导率保持率 μ/μ₀ (%)' },
                    min: 0,
                    max: 105
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// ==================== 9. 损耗 vs 频率特性 ====================
function updateLossSpectrum(mat, B_T) {
    const freqs = [];
    const losses = [];
    const hysteresisParts = [];
    const eddyParts = [];
    
    for (let fk = 10; fk <= 500; fk += 10) {
        const Pv = mat.k * Math.pow(fk, mat.alpha) * Math.pow(B_T * 1000, mat.beta);
        const Ph = Pv * 0.7;
        const Pe = Pv * 0.3 * (fk / 50); // 涡流分量随频率线性增加
        const total = Ph + Pe;
        
        freqs.push(fk);
        losses.push(total);
        hysteresisParts.push(Ph);
        eddyParts.push(Pe);
    }
    
    const ctx = document.getElementById('mcLossSpectrum').getContext('2d');
    if (mcLossChart) mcLossChart.destroy();
    
     mcLossChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: freqs,
            datasets: [
                {
                    label: '总损耗 Pv',
                    data: losses,
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.2
                },
                {
                    label: '磁滞损耗 Ph',
                    data: hysteresisParts,
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.2,
                    borderDash: [4, 4]
                },
                {
                    label: '涡流损耗 Pe',
                    data: eddyParts,
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.2,
                    borderDash: [6, 3]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    title: { display: true, text: '频率 f (kHz)' }
                },
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: '损耗 Pv (kW/m³)' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' kW/m³';
                        }
                    }
                }
            }
        }
    });
}

// ==================== 10. 初始化 ====================
function init() {
    // 初始材料选择
    updateMaterialSelection();
    
    // 初始计算
    fullCalculation();
}

// DOM 就绪
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}