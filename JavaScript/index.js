/**
 * 铁氧体磁芯全面计算平台 - JavaScript 业务逻辑
 * 对应 index/铁氧体磁芯计算.html
 * 
 * 功能模块:
 * 1. 初始磁导率 μi 计算（电感法）
 * 2. 损耗角正切 tanδ 三因子模型
 * 3. tanδ 频率特性曲线（10kHz~1MHz）
 * 4. 工作磁通密度 B 与功率损耗 Pv 估算
 * 5. 磁芯有效参数（Ae, Ve, C1, 重量）
 * 6. 动态磁滞回线 B-H Loop（Catmull-Rom 插值）— 实时更新
 * 7. 初始磁化曲线 — 实时更新
 * 8. 铜损 Pcu 计算
 * 9. 膜包线（漆包线）用量计算
 * 10. 扁平线（铜带）用量计算
 */

// ==================== DOM 引用 ====================
// μi 计算
const calcMuBtn = document.getElementById('calcMuBtn');
const muResultSpan = document.getElementById('muResult');

// tanδ 相关
const calcTanBtn = document.getElementById('calcTanDeltaBtn');
const tanhSpan = document.getElementById('tanhVal');
const taneSpan = document.getElementById('taneVal');
const tanrSpan = document.getElementById('tanrVal');
const totalTanSpan = document.getElementById('totalTanDelta');

// B & Pv
const calcBbtn = document.getElementById('calcBfluxBtn');
const bGaussSpan = document.getElementById('bGauss');
const bTeslaSpan = document.getElementById('bTesla');
const pvSpan = document.getElementById('pvValue');
const refreshPvBtn = document.getElementById('refreshPvBtn');

// 电阻率与有效参数
const rhoSelect = document.getElementById('rhoSelect');
const resistivityInput = document.getElementById('resistivity');
const rhoDisplay = document.getElementById('rhoDisplay');
const calcEffBtn = document.getElementById('calcEffParamsBtn');
const effAeSpan = document.getElementById('effAe');
const effVeSpan = document.getElementById('effVe');
const c1Span = document.getElementById('c1Val');
const weightResult = document.getElementById('weightResult');

// 图表实例
let hysteresisChart = null;
let initChart = null;
let freqSpectrumChart = null;

// ==================== 1. 初始磁导率 μi 计算 ====================
function calcInitialMu() {
    const N = parseFloat(document.getElementById('turns').value);
    const Ae_cm2 = parseFloat(document.getElementById('area').value);
    const le_cm = parseFloat(document.getElementById('length').value);
    const Lcore_uh = parseFloat(document.getElementById('Lcore').value);
    const Lair_uh = parseFloat(document.getElementById('Lair').value);

    if (isNaN(N) || N <= 0 || isNaN(Ae_cm2) || Ae_cm2 <= 0 ||
        isNaN(le_cm) || le_cm <= 0 || isNaN(Lcore_uh) || isNaN(Lair_uh)) {
        muResultSpan.innerText = '无效输入';
        return;
    }

    const deltaL_H = (Lcore_uh - Lair_uh) * 1e-6;
    if (deltaL_H <= 0) {
        muResultSpan.innerText = '⚠️ Lcore ≤ Lair';
        return;
    }

    const numerator = deltaL_H * le_cm;
    const denominator = 4 * Math.PI * N * N * Ae_cm2 * 1e-9;
    const mu_i = numerator / denominator;
    muResultSpan.innerText = mu_i.toFixed(1);
}

// ==================== 2. 损耗角正切 tanδ 计算 ====================
function computeTanDeltaAndUpdate() {
    const L_uh = parseFloat(document.getElementById('tanL').value);
    const V1_cm3 = parseFloat(document.getElementById('vol').value);
    const f_kHz = parseFloat(document.getElementById('freq').value);
    const h1 = parseFloat(document.getElementById('h1coef').value);
    const e1 = parseFloat(document.getElementById('e1coef').value);
    const r1 = parseFloat(document.getElementById('r1coef').value);

    if (isNaN(L_uh) || L_uh <= 0 || isNaN(V1_cm3) || V1_cm3 <= 0 || isNaN(f_kHz)) {
        return;
    }

    const L_H = L_uh * 1e-6;
    const sqrtTerm = Math.sqrt(L_H / V1_cm3);
    const tan_h = h1 * sqrtTerm;
    const f_Hz = f_kHz * 1000;
    const tan_e = e1 * f_Hz;
    const tan_r = r1;
    const total = tan_h + tan_e + tan_r;

    tanhSpan.innerText = tan_h.toFixed(5);
    taneSpan.innerText = tan_e.toExponential(4);
    tanrSpan.innerText = tan_r.toFixed(5);
    totalTanSpan.innerText = total.toFixed(5);

    updateFreqSpectrum(L_uh, V1_cm3, h1, e1, r1);
}

// ==================== 3. tanδ 频率特性曲线 ====================
function updateFreqSpectrum(L_uh, V1_cm3, h1, e1, r1) {
    if (isNaN(L_uh) || isNaN(V1_cm3)) return;

    const L_H = L_uh * 1e-6;
    const sqrtConst = Math.sqrt(L_H / V1_cm3);
    const freqKHz = [];
    const tan_h_vals = [];
    const tan_e_vals = [];
    const total_vals = [];

    let minPositive = Infinity;
    for (let fk = 10; fk <= 1000; fk += 10) {
        const f_hz = fk * 1000;
        const tan_h = h1 * sqrtConst;
        const tan_e = e1 * f_hz;
        const total = tan_h + tan_e + r1;
        freqKHz.push(fk);
        tan_h_vals.push(tan_h);
        tan_e_vals.push(tan_e);
        total_vals.push(total);
        if (total > 0 && total < minPositive) minPositive = total;
    }

    const yMin = Math.max(1e-6, minPositive * 0.5);
    const yMax = Math.max(...total_vals) * 5;

    const ctx = document.getElementById('tanDeltaSpectrum').getContext('2d');
    if (freqSpectrumChart) freqSpectrumChart.destroy();

    freqSpectrumChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: freqKHz,
            datasets: [
                { label: '磁滞 tanδ_h', data: tan_h_vals, borderColor: '#e68a2e', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false },
                { label: '涡流 tanδ_e', data: tan_e_vals, borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false },
                { label: '总 tanδ', data: total_vals, borderColor: '#10b981', borderWidth: 3, pointRadius: 0, tension: 0.2, fill: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
                tooltip: { mode: 'index', intersect: false, callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y.toExponential(4) } }
            },
            scales: {
                x: { title: { display: true, text: '频率 f (kHz)', font: { size: 12, weight: 'bold' } }, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { font: { size: 10 }, maxTicksLimit: 12 } },
                y: { type: 'logarithmic', min: yMin, max: yMax, title: { display: true, text: '损耗角正切 tanδ', font: { size: 12, weight: 'bold' } }, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { font: { size: 10 }, callback: v => v === 0 ? '0' : v === Math.pow(10, Math.round(Math.log10(v))) ? '10^' + Math.round(Math.log10(v)) : '' } }
            }
        }
    });
}

// ==================== 4. 磁通密度 B 与功率损耗 Pv ====================
function calcBAndPv() {
    const V = parseFloat(document.getElementById('voltageV').value);
    const f_hz = parseFloat(document.getElementById('freqB').value);
    const N = parseFloat(document.getElementById('nB').value);
    const Ae_cm2 = parseFloat(document.getElementById('aeB').value);
    if (isNaN(V) || isNaN(f_hz) || isNaN(N) || isNaN(Ae_cm2) || Ae_cm2 <= 0) return;
    const B_gauss = V * 1e8 / (4.44 * f_hz * N * Ae_cm2);
    const B_tesla = B_gauss * 1e-4;
    bGaussSpan.innerText = B_gauss.toFixed(0) + ' G';
    bTeslaSpan.innerText = B_tesla.toFixed(4) + ' T';
    const f_kHz = f_hz / 1000;
    const B_mT = B_tesla * 1000;
    let Pv = 1.2e-4 * Math.pow(f_kHz, 1.3) * Math.pow(B_mT, 2.2);
    if (isNaN(Pv) || Pv < 0) Pv = 0;
    pvSpan.innerText = Pv.toFixed(1) + ' kW/m³';
}

// ==================== 5. 磁芯有效参数 ====================
function calcEffectiveParams() {
    const aep = parseFloat(document.getElementById('aep').value);
    const amin = parseFloat(document.getElementById('amin').value);
    const le = parseFloat(document.getElementById('leGeom').value);
    const density = parseFloat(document.getElementById('density').value);
    if (isNaN(aep) || isNaN(amin) || isNaN(le) || le <= 0) return;
    const Ae_eff = Math.sqrt(aep * amin);
    const Ve = Ae_eff * le;
    const C1 = le / Ae_eff;
    effAeSpan.innerText = Ae_eff.toFixed(4);
    effVeSpan.innerText = Ve.toFixed(3);
    c1Span.innerText = C1.toFixed(2);
    if (!isNaN(density) && density > 0) weightResult.value = (Ve * density).toFixed(2) + ' g';
    else weightResult.value = '输入密度';
}

// ==================== 6. B-H 磁滞回线（Catmull-Rom 插值） ====================
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
            const t2 = t * t, t3 = t2 * t;
            const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
            const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
            result.push({ x, y });
        }
    }
    result.push(points[points.length - 1]);
    return result;
}

function updateHysteresis() {
    const Bs = parseFloat(document.getElementById('BsVal').value);
    const Br = parseFloat(document.getElementById('BrVal').value);
    const Hc = parseFloat(document.getElementById('HcVal').value);
    if (isNaN(Bs) || isNaN(Br) || isNaN(Hc)) return;
    const Hmax = Math.max(3 * Hc, 70);
    const upPoints = [{ x: -Hmax, y: -Bs }, { x: -Hc, y: 0 }, { x: 0, y: Br }, { x: Hc, y: 0 }, { x: Hmax, y: Bs }];
    const downPoints = [{ x: Hmax, y: Bs }, { x: Hc, y: 0 }, { x: 0, y: -Br }, { x: -Hc, y: 0 }, { x: -Hmax, y: -Bs }];
    const upCurve = catmullRomPoints(upPoints, 28);
    const downCurve = catmullRomPoints(downPoints, 28);
    const ctx = document.getElementById('hysteresisCanvas').getContext('2d');
    if (hysteresisChart) hysteresisChart.destroy();
    hysteresisChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                { label: '上升支', data: upCurve.map(p => ({ x: p.x, y: p.y })), borderColor: '#dc2626', borderWidth: 2.5, showLine: true, pointRadius: 0 },
                { label: '下降支', data: downCurve.map(p => ({ x: p.x, y: p.y })), borderColor: '#2563eb', borderWidth: 2.5, showLine: true, pointRadius: 0 }
            ]
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
            interaction: { mode: 'nearest', intersect: true, axis: 'xy' },
            scales: {
                x: { title: { display: true, text: 'H (A/m)' } },
                y: { title: { display: true, text: 'B (T)' } }
            }
        }
    });
    updateInitMagCurve(Bs, Hc);
}

// ==================== 7. 初始磁化曲线 ====================
function updateInitMagCurve(Bs, Hc) {
    const Hchar = Math.max(18, Hc * 1.3);
    const maxField = Math.min(400, Math.max(4 * Hc, 100));
    const points = [];
    for (let i = 0; i <= 70; i++) { const H = (i / 70) * maxField; const B = Bs * (1 - Math.exp(-H / Hchar)); points.push({ x: H, y: B }); }
    const ctx = document.getElementById('initMagCanvas').getContext('2d');
    if (initChart) initChart.destroy();
    initChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [{ label: '初始磁化曲线', data: points.map(p => ({ x: p.x, y: p.y })), borderColor: '#16a34a', borderWidth: 3, pointRadius: 0 }] },
        options: {
            responsive: true,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { title: { text: 'H (A/m)' } },
                y: { title: { text: 'B (T)' }, min: 0, max: Bs * 1.05 }
            }
        }
    });
}

// ==================== 8. 电阻率联动 ====================
function updateResistivity() {
    let val = parseFloat(resistivityInput.value);
    if (isNaN(val)) val = 1.2;
    rhoDisplay.innerText = val.toFixed(2);
}

// ==================== 9. 铜损 Pcu 计算 ====================
function calcCopperLoss() {
    const I = parseFloat(document.getElementById('cuI').value);
    const d_mm = parseFloat(document.getElementById('cuDiam').value);
    const l_m = parseFloat(document.getElementById('cuLength').value);
    const temp = parseFloat(document.getElementById('cuTemp').value);
    if (isNaN(I) || I <= 0 || isNaN(d_mm) || d_mm <= 0 || isNaN(l_m) || l_m <= 0 || isNaN(temp)) return;
    const RHO_20 = 1.724e-8;
    const ALPHA = 0.00393;
    const A_mm2 = Math.PI * (d_mm / 2) * (d_mm / 2);
    const A_m2 = A_mm2 * 1e-6;
    const rho_temp = RHO_20 * (1 + ALPHA * (temp - 20));
    const R = rho_temp * l_m / A_m2;
    const Pcu = I * I * R;
    const J = I / A_mm2;
    document.getElementById('cuResistance').innerText = R.toFixed(4);
    document.getElementById('cuJ').innerText = J.toFixed(2);
    document.getElementById('cuLoss').innerText = Pcu.toFixed(3);
}

// ==================== 10. 膜包线（漆包线）用量计算 ====================
function calcFilmWire() {
    const N = parseFloat(document.getElementById('mfTurns').value);
    const d_mm = parseFloat(document.getElementById('mfDiam').value);
    const Ns = parseFloat(document.getElementById('mfStrands').value);
    const a_mm = parseFloat(document.getElementById('mfCoreA').value);
    const b_mm = parseFloat(document.getElementById('mfCoreB').value);
    if (isNaN(N) || N <= 0 || isNaN(d_mm) || d_mm <= 0 || isNaN(Ns) || Ns < 1 || isNaN(a_mm) || a_mm <= 0 || isNaN(b_mm) || b_mm <= 0) return;
    const Lavg_mm = 2 * (a_mm + b_mm) + 2 * d_mm;
    const L_total_m = Lavg_mm * N / 1000;
    const A_single_mm2 = Math.PI * (d_mm / 2) * (d_mm / 2);
    const A_total_mm2 = A_single_mm2 * Ns;
    const Vol_mm3 = A_single_mm2 * L_total_m * 1000 * Ns;
    const W_g = Vol_mm3 * 8.96 / 1000;
    const RHO = 1.724e-8;
    const A_single_m2 = A_single_mm2 * 1e-6;
    const R_single = RHO * L_total_m / A_single_m2;
    const R_parallel = R_single / Ns;
    document.getElementById('mfAvgTurn').innerText = Lavg_mm.toFixed(2);
    document.getElementById('mfTotalLen').innerText = L_total_m.toFixed(2);
    document.getElementById('mfSection').innerText = A_single_mm2.toFixed(4);
    document.getElementById('mfTotalSection').innerText = A_total_mm2.toFixed(4);
    document.getElementById('mfWeight').innerText = W_g.toFixed(2);
    document.getElementById('mfResistance').innerText = R_parallel.toFixed(5);
}

// ==================== 11. 扁平线（铜带）用量计算 ====================
function calcFlatWire() {
    const w_mm = parseFloat(document.getElementById('fwWidth').value);
    const t_mm = parseFloat(document.getElementById('fwThick').value);
    const l_m = parseFloat(document.getElementById('fwLength').value);
    const price_kg = parseFloat(document.getElementById('fwPrice').value);
    if (isNaN(w_mm) || w_mm <= 0 || isNaN(t_mm) || t_mm <= 0 || isNaN(l_m) || l_m <= 0) return;
    const A_mm2 = w_mm * t_mm;
    const V_m3 = A_mm2 * l_m / 1e6;
    const W_kg = V_m3 * 8960;
    let cost = 0;
    if (!isNaN(price_kg) && price_kg > 0) cost = W_kg * price_kg;
    const RHO = 1.724e-8;
    const A_m2 = A_mm2 * 1e-6;
    const R = RHO * l_m / A_m2;
    document.getElementById('fwSection').innerText = A_mm2.toFixed(3);
    document.getElementById('fwWeight').innerText = W_kg.toFixed(4);
    document.getElementById('fwCost').innerText = cost.toFixed(2);
    document.getElementById('fwResistance').innerText = R.toFixed(5);
}

// ==================== 12. 事件绑定 ====================
function initEventListeners() {
    calcMuBtn.addEventListener('click', calcInitialMu);
    calcTanBtn.addEventListener('click', computeTanDeltaAndUpdate);
    calcBbtn.addEventListener('click', calcBAndPv);
    refreshPvBtn.addEventListener('click', calcBAndPv);
    calcEffBtn.addEventListener('click', calcEffectiveParams);
    
    // B-H 回线更新 — 使用 'input' 事件实现实时拖拽，与 tanδ 曲线一致的跟手体验
    document.getElementById('updateHysteresisBtn').addEventListener('click', updateHysteresis);
    document.getElementById('BsVal').addEventListener('input', updateHysteresis);
    document.getElementById('BrVal').addEventListener('input', updateHysteresis);
    document.getElementById('HcVal').addEventListener('input', updateHysteresis);

    // 电阻率联动
    rhoSelect.addEventListener('change', function () { resistivityInput.value = rhoSelect.value; updateResistivity(); });
    resistivityInput.addEventListener('input', updateResistivity);

    // 电感联动
    document.getElementById('Lcore').addEventListener('change', function () { calcInitialMu(); const lval = parseFloat(this.value); if (!isNaN(lval)) document.getElementById('tanL').value = lval; computeTanDeltaAndUpdate(); });
    document.getElementById('tanL').addEventListener('change', function () { const lv = parseFloat(this.value); if (!isNaN(lv)) document.getElementById('Lcore').value = lv; calcInitialMu(); computeTanDeltaAndUpdate(); });

    // 铜损、膜包线、扁平线
    document.getElementById('calcCuBtn').addEventListener('click', calcCopperLoss);
    document.getElementById('calcMfBtn').addEventListener('click', calcFilmWire);
    document.getElementById('calcFwBtn').addEventListener('click', calcFlatWire);
}

// ==================== 13. 初始化 ====================
function init() {
    initEventListeners();
    calcInitialMu();
    computeTanDeltaAndUpdate();
    calcBAndPv();
    calcEffectiveParams();
    updateHysteresis();
    updateResistivity();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();