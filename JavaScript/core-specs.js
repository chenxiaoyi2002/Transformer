/**
 * 常用磁芯规格库 - JavaScript 业务逻辑
 * 对应 index/CommonMagneticCoreSpecifications.html
 * 
 * 功能:
 * 1. 磁芯规格数据库 (EE, EI, ETD, ER, PQ, RM, Toroid) + 供应商
 * 2. 搜索与筛选（类型、材料、供应商）
 * 3. 规格详情展示（含真实磁芯示意图）
 * 4. 统计信息
 * 5. 数据导出到变压器计算页面
 */

// ==================== 供应商列表 ====================
const SUPPLIERS = {
    TDK: { name: 'TDK', country: '日本', logo: '🔵' },
    Ferroxcube: { name: 'Ferroxcube', country: '荷兰', logo: '🟢' },
    Magnetics: { name: 'Magnetics', country: '美国', logo: '🔴' },
    ChangSung: { name: 'ChangSung', country: '韩国', logo: '🟡' },
    DMEGC: { name: 'DMEGC (横店东磁)', country: '中国', logo: '🟣' },
    TDG: { name: 'TDG (天通股份)', country: '中国', logo: '🟠' },
    KaiYuan: { name: 'KaiYuan (凯元磁材)', country: '中国', logo: '🔶' },
    FerriteWorld: { name: 'Ferrite World', country: '中国', logo: '🟤' }
};

// ==================== 磁芯规格数据库 ====================
const CORE_SPECS = [
    // EE 型铁氧体 - TDK
    { id: 'EE16', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.16, Le: 3.2, Ve: 0.51, Aw: 0.21, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 16, dimB: 8, dimC: 4 },
    { id: 'EE20', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.25, Le: 4.0, Ve: 1.00, Aw: 0.35, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 20, dimB: 10, dimC: 5 },
    { id: 'EE25', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EE35', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 35, dimB: 18, dimC: 8 },
    { id: 'EE40', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 40, dimB: 20, dimC: 10 },
    { id: 'EE50', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 3.02, Le: 12.2, Ve: 36.8, Aw: 4.21, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 50, dimB: 25, dimC: 12 },
    { id: 'EE65', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 5.20, Le: 15.5, Ve: 80.6, Aw: 7.12, Bs: 0.48, Hc: 24, mu: 2300, series: 'EE', supplier: 'TDK', dimA: 65, dimB: 32, dimC: 15 },
    
    // EE 型铁氧体 - Ferroxcube
    { id: 'EE25-FC', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.47, Hc: 22, mu: 2200, series: 'EE', supplier: 'Ferroxcube', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-FC', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.47, Hc: 22, mu: 2200, series: 'EE', supplier: 'Ferroxcube', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EE40-FC', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 0.47, Hc: 22, mu: 2200, series: 'EE', supplier: 'Ferroxcube', dimA: 40, dimB: 20, dimC: 10 },
    
    // EE 型铁氧体 - DMEGC
    { id: 'EE25-DM', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.50, Hc: 20, mu: 2500, series: 'EE', supplier: 'DMEGC', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-DM', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.50, Hc: 20, mu: 2500, series: 'EE', supplier: 'DMEGC', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EE40-DM', type: 'EE', material: 'ferrite', materialName: '铁氧体', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 0.50, Hc: 20, mu: 2500, series: 'EE', supplier: 'DMEGC', dimA: 40, dimB: 20, dimC: 10 },
    
    // EI 型铁氧体
    { id: 'EI25', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI', supplier: 'TDK', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EI30', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI', supplier: 'TDK', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EI35', type: 'EI', material: 'ferrite', materialName: '铁氧体', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 0.48, Hc: 24, mu: 2300, series: 'EI', supplier: 'TDK', dimA: 35, dimB: 18, dimC: 8 },
    
    // ETD 型铁氧体
    { id: 'ETD29', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 0.72, Le: 6.5, Ve: 4.70, Aw: 1.02, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 29, dimB: 15, dimC: 8 },
    { id: 'ETD34', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.02, Le: 7.8, Ve: 7.96, Aw: 1.45, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 34, dimB: 18, dimC: 9 },
    { id: 'ETD39', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.42, Le: 9.2, Ve: 13.1, Aw: 1.98, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 39, dimB: 20, dimC: 10 },
    { id: 'ETD44', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.76, Le: 10.5, Ve: 18.5, Aw: 2.52, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 44, dimB: 22, dimC: 11 },
    { id: 'ETD49', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 2.30, Le: 11.8, Ve: 27.1, Aw: 3.15, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 49, dimB: 25, dimC: 12 },
    { id: 'ETD54', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 3.20, Le: 13.5, Ve: 43.2, Aw: 4.20, Bs: 0.48, Hc: 24, mu: 2300, series: 'ETD', supplier: 'TDK', dimA: 54, dimB: 28, dimC: 14 },
    
    // ETD - Ferroxcube
    { id: 'ETD34-FC', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.02, Le: 7.8, Ve: 7.96, Aw: 1.45, Bs: 0.47, Hc: 22, mu: 2200, series: 'ETD', supplier: 'Ferroxcube', dimA: 34, dimB: 18, dimC: 9 },
    { id: 'ETD39-FC', type: 'ETD', material: 'ferrite', materialName: '铁氧体', Ae: 1.42, Le: 9.2, Ve: 13.1, Aw: 1.98, Bs: 0.47, Hc: 22, mu: 2200, series: 'ETD', supplier: 'Ferroxcube', dimA: 39, dimB: 20, dimC: 10 },
    
    // ER 型铁氧体
    { id: 'ER35', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 1.10, Le: 8.2, Ve: 9.02, Aw: 1.55, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER', supplier: 'TDK', dimA: 35, dimB: 18, dimC: 9 },
    { id: 'ER42', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 1.65, Le: 9.8, Ve: 16.2, Aw: 2.20, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER', supplier: 'TDK', dimA: 42, dimB: 22, dimC: 11 },
    { id: 'ER49', type: 'ER', material: 'ferrite', materialName: '铁氧体', Ae: 2.40, Le: 11.5, Ve: 27.6, Aw: 3.05, Bs: 0.48, Hc: 24, mu: 2300, series: 'ER', supplier: 'TDK', dimA: 49, dimB: 25, dimC: 12 },
    
    // PQ 型铁氧体
    { id: 'PQ20/20', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 0.76, Le: 6.8, Ve: 5.17, Aw: 1.08, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ', supplier: 'TDK', dimA: 20, dimB: 14, dimC: 8 },
    { id: 'PQ26/25', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 1.10, Le: 8.2, Ve: 9.02, Aw: 1.55, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ', supplier: 'TDK', dimA: 26, dimB: 18, dimC: 10 },
    { id: 'PQ35/35', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ', supplier: 'TDK', dimA: 35, dimB: 24, dimC: 12 },
    { id: 'PQ40/40', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 2.30, Le: 10.0, Ve: 23.0, Aw: 2.65, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ', supplier: 'TDK', dimA: 40, dimB: 28, dimC: 14 },
    { id: 'PQ50/50', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 3.80, Le: 12.5, Ve: 47.5, Aw: 4.10, Bs: 0.48, Hc: 24, mu: 2300, series: 'PQ', supplier: 'TDK', dimA: 50, dimB: 35, dimC: 18 },
    
    // PQ - Magnetics
    { id: 'PQ35/35-MG', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 0.49, Hc: 23, mu: 2400, series: 'PQ', supplier: 'Magnetics', dimA: 35, dimB: 24, dimC: 12 },
    { id: 'PQ40/40-MG', type: 'PQ', material: 'ferrite', materialName: '铁氧体', Ae: 2.30, Le: 10.0, Ve: 23.0, Aw: 2.65, Bs: 0.49, Hc: 23, mu: 2400, series: 'PQ', supplier: 'Magnetics', dimA: 40, dimB: 28, dimC: 14 },
    
    // RM 型铁氧体
    { id: 'RM5', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.28, Le: 4.5, Ve: 1.26, Aw: 0.42, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 14, dimB: 10, dimC: 5 },
    { id: 'RM6', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.45, Le: 5.8, Ve: 2.61, Aw: 0.68, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 17, dimB: 12, dimC: 6 },
    { id: 'RM8', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 0.78, Le: 7.2, Ve: 5.62, Aw: 1.12, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 22, dimB: 15, dimC: 8 },
    { id: 'RM10', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 1.20, Le: 8.8, Ve: 10.6, Aw: 1.65, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 26, dimB: 18, dimC: 10 },
    { id: 'RM12', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 1.85, Le: 10.5, Ve: 19.4, Aw: 2.40, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 30, dimB: 22, dimC: 12 },
    { id: 'RM14', type: 'RM', material: 'ferrite', materialName: '铁氧体', Ae: 2.60, Le: 12.2, Ve: 31.7, Aw: 3.25, Bs: 0.48, Hc: 24, mu: 2300, series: 'RM', supplier: 'TDK', dimA: 35, dimB: 26, dimC: 14 },
    
    // Toroid 环形铁氧体
    { id: 'T16x10x5', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.12, Le: 2.8, Ve: 0.34, Aw: 0.18, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 16, dimB: 10, dimC: 5 },
    { id: 'T20x12x6', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.22, Le: 3.8, Ve: 0.84, Aw: 0.30, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 20, dimB: 12, dimC: 6 },
    { id: 'T25x15x8', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.40, Le: 5.0, Ve: 2.00, Aw: 0.52, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 25, dimB: 15, dimC: 8 },
    { id: 'T30x20x10', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.65, Le: 6.5, Ve: 4.23, Aw: 0.80, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 30, dimB: 20, dimC: 10 },
    { id: 'T36x23x12', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 0.95, Le: 8.0, Ve: 7.60, Aw: 1.15, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 36, dimB: 23, dimC: 12 },
    { id: 'T42x28x14', type: 'Toroid', material: 'ferrite', materialName: '铁氧体', Ae: 1.45, Le: 9.8, Ve: 14.2, Aw: 1.70, Bs: 0.48, Hc: 24, mu: 2300, series: 'Toroid', supplier: 'TDK', dimA: 42, dimB: 28, dimC: 14 },
    
    // 金属磁芯 - 铁粉芯
    { id: 'EE16-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.16, Le: 3.2, Ve: 0.51, Aw: 0.21, Bs: 1.5, Hc: 80, mu: 75, series: 'EE', supplier: 'Magnetics', dimA: 16, dimB: 8, dimC: 4 },
    { id: 'EE25-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.5, Hc: 80, mu: 75, series: 'EE', supplier: 'Magnetics', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.5, Hc: 80, mu: 75, series: 'EE', supplier: 'Magnetics', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EE40-Iron', type: 'EE', material: 'iron', materialName: '铁粉芯', Ae: 1.54, Le: 9.8, Ve: 15.1, Aw: 2.36, Bs: 1.5, Hc: 80, mu: 75, series: 'EE', supplier: 'Magnetics', dimA: 40, dimB: 20, dimC: 10 },
    
    // 金属磁芯 - 铁硅铝 (Sendust) - ChangSung
    { id: 'EE25-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.0, Hc: 40, mu: 60, series: 'EE', supplier: 'ChangSung', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.0, Hc: 40, mu: 60, series: 'EE', supplier: 'ChangSung', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'EE35-Sendust', type: 'EE', material: 'sendust', materialName: '铁硅铝', Ae: 1.19, Le: 8.4, Ve: 10.0, Aw: 1.74, Bs: 1.0, Hc: 40, mu: 60, series: 'EE', supplier: 'ChangSung', dimA: 35, dimB: 18, dimC: 8 },
    { id: 'PQ35/35-Sendust', type: 'PQ', material: 'sendust', materialName: '铁硅铝', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 1.0, Hc: 40, mu: 60, series: 'PQ', supplier: 'ChangSung', dimA: 35, dimB: 24, dimC: 12 },
    
    // 金属磁芯 - MPP - Magnetics
    { id: 'EE25-MPP', type: 'EE', material: 'mpp', materialName: 'MPP', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 0.7, Hc: 25, mu: 125, series: 'EE', supplier: 'Magnetics', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-MPP', type: 'EE', material: 'mpp', materialName: 'MPP', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 0.7, Hc: 25, mu: 125, series: 'EE', supplier: 'Magnetics', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'PQ35/35-MPP', type: 'PQ', material: 'mpp', materialName: 'MPP', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 0.7, Hc: 25, mu: 125, series: 'PQ', supplier: 'Magnetics', dimA: 35, dimB: 24, dimC: 12 },
    
    // 金属磁芯 - 高磁通 - ChangSung
    { id: 'EE25-HF', type: 'EE', material: 'hf', materialName: '高磁通', Ae: 0.49, Le: 5.9, Ve: 2.90, Aw: 0.62, Bs: 1.5, Hc: 60, mu: 60, series: 'EE', supplier: 'ChangSung', dimA: 25, dimB: 12, dimC: 6 },
    { id: 'EE30-HF', type: 'EE', material: 'hf', materialName: '高磁通', Ae: 0.92, Le: 7.1, Ve: 6.50, Aw: 1.27, Bs: 1.5, Hc: 60, mu: 60, series: 'EE', supplier: 'ChangSung', dimA: 30, dimB: 15, dimC: 7 },
    { id: 'PQ35/35-HF', type: 'PQ', material: 'hf', materialName: '高磁通', Ae: 1.56, Le: 8.5, Ve: 13.3, Aw: 1.85, Bs: 1.5, Hc: 60, mu: 60, series: 'PQ', supplier: 'ChangSung', dimA: 35, dimB: 24, dimC: 12 }
];

// ==================== 全局状态 ====================
let selectedCoreId = null;
let filteredSpecs = [...CORE_SPECS];

// ==================== DOM 引用 ====================
const specSearch = document.getElementById('specSearch');
const specTypeFilter = document.getElementById('specTypeFilter');
const specMaterialFilter = document.getElementById('specMaterialFilter');
const specSupplierFilter = document.getElementById('specSupplierFilter');
const specTableBody = document.getElementById('specTableBody');
const specDetailBody = document.getElementById('specDetailBody');
const statTotal = document.getElementById('statTotal');
const statFerrite = document.getElementById('statFerrite');
const statMetal = document.getElementById('statMetal');
const statFiltered = document.getElementById('statFiltered');
const tableCountBadge = document.getElementById('tableCountBadge');

// ==================== 1. 初始化 ====================
function init() {
    populateSupplierFilter();
    updateStats();
    renderTable(CORE_SPECS);
    bindEvents();
}

function populateSupplierFilter() {
    const supplierSet = new Set(CORE_SPECS.map(s => s.supplier));
    const sorted = Array.from(supplierSet).sort();
    sorted.forEach(sup => {
        const opt = document.createElement('option');
        opt.value = sup;
        const info = SUPPLIERS[sup] || { name: sup, logo: '🏢' };
        opt.textContent = info.logo + ' ' + info.name;
        specSupplierFilter.appendChild(opt);
    });
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
                <td colspan="8" style="text-align: center; padding: 40px; color: #8a9bb5;">
                    未找到匹配的磁芯规格
                </td>
            </tr>
        `;
        return;
    }

    specTableBody.innerHTML = specs.map(spec => {
        const supInfo = SUPPLIERS[spec.supplier] || { logo: '🏢' };
        return `
        <tr data-id="${spec.id}" class="${selectedCoreId === spec.id ? 'active' : ''}">
            <td><strong>${spec.id}</strong></td>
            <td><span class="spec-type spec-type-${spec.type.toLowerCase()}">${spec.type}</span></td>
            <td>${spec.materialName}</td>
            <td>${supInfo.logo} ${spec.supplier}</td>
            <td>${spec.Ae.toFixed(2)}</td>
            <td>${spec.Le.toFixed(1)}</td>
            <td>${spec.Ve.toFixed(2)}</td>
            <td>${spec.Aw.toFixed(2)}</td>
        </tr>`;
    }).join('');

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

    specTableBody.querySelectorAll('tr').forEach(row => {
        row.classList.toggle('active', row.dataset.id === id);
    });

    renderDetail(spec);
}

function renderCoreVisual(spec) {
    const type = spec.type;
    const a = spec.dimA || 30;
    const b = spec.dimB || 15;
    const c = spec.dimC || 8;
    
    if (type === 'EE' || type === 'EI') {
        return `
            <svg viewBox="0 0 240 180" style="width:100%; max-width:240px;">
                <defs>
                    <linearGradient id="coreGradEE" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3a5a8a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadowEE">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.2"/>
                    </filter>
                </defs>
                <!-- EE 型磁芯 3D 效果 -->
                <!-- 上轭 -->
                <rect x="30" y="20" width="180" height="25" rx="4" fill="url(#coreGradEE)" stroke="#0f2a4a" stroke-width="1.5" filter="url(#shadowEE)"/>
                <!-- 下轭 -->
                <rect x="30" y="135" width="180" height="25" rx="4" fill="url(#coreGradEE)" stroke="#0f2a4a" stroke-width="1.5" filter="url(#shadowEE)"/>
                <!-- 左柱 -->
                <rect x="30" y="20" width="30" height="140" rx="4" fill="url(#coreGradEE)" stroke="#0f2a4a" stroke-width="1.5" filter="url(#shadowEE)"/>
                <!-- 右柱 -->
                <rect x="180" y="20" width="30" height="140" rx="4" fill="url(#coreGradEE)" stroke="#0f2a4a" stroke-width="1.5" filter="url(#shadowEE)"/>
                <!-- 中心柱 -->
                <rect x="95" y="45" width="50" height="110" rx="3" fill="#4a7ab5" stroke="#2a5a8a" stroke-width="1.5" filter="url(#shadowEE)"/>
                <!-- 窗口标注 -->
                <text x="60" y="95" text-anchor="middle" font-size="8" fill="#6b7a95">窗口</text>
                <text x="190" y="95" text-anchor="middle" font-size="8" fill="#6b7a95">窗口</text>
                <!-- 尺寸标注 -->
                <line x1="30" y1="170" x2="210" y2="170" stroke="#dc2626" stroke-width="1" stroke-dasharray="3,2"/>
                <text x="120" y="178" text-anchor="middle" font-size="8" fill="#dc2626">A = ${a}mm</text>
                <line x1="220" y1="20" x2="220" y2="160" stroke="#2563eb" stroke-width="1" stroke-dasharray="3,2"/>
                <text x="232" y="95" text-anchor="middle" font-size="8" fill="#2563eb" transform="rotate(90,232,95)">B = ${b}mm</text>
                <text x="120" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3c72">${spec.id} ${spec.type}型磁芯</text>
            </svg>`;
    } else if (type === 'ETD') {
        return `
            <svg viewBox="0 0 240 180" style="width:100%; max-width:240px;">
                <defs>
                    <linearGradient id="coreGradETD" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3a5a8a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <!-- ETD 型 - 圆形中柱 -->
                <rect x="30" y="20" width="180" height="22" rx="6" fill="url(#coreGradETD)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="30" y="138" width="180" height="22" rx="6" fill="url(#coreGradETD)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="30" y="20" width="28" height="140" rx="6" fill="url(#coreGradETD)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="182" y="20" width="28" height="140" rx="6" fill="url(#coreGradETD)" stroke="#0f2a4a" stroke-width="1.5"/>
                <ellipse cx="120" cy="90" rx="30" ry="50" fill="#4a7ab5" stroke="#2a5a8a" stroke-width="1.5"/>
                <text x="120" y="95" text-anchor="middle" font-size="9" fill="white" font-weight="700">ETD</text>
                <text x="120" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3c72">${spec.id} ETD型磁芯</text>
            </svg>`;
    } else if (type === 'PQ') {
        return `
            <svg viewBox="0 0 240 180" style="width:100%; max-width:240px;">
                <defs>
                    <linearGradient id="coreGradPQ" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3a5a8a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <!-- PQ 型 - 方形 -->
                <rect x="35" y="20" width="170" height="25" rx="8" fill="url(#coreGradPQ)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="35" y="135" width="170" height="25" rx="8" fill="url(#coreGradPQ)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="35" y="20" width="32" height="140" rx="8" fill="url(#coreGradPQ)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="173" y="20" width="32" height="140" rx="8" fill="url(#coreGradPQ)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="90" y="45" width="60" height="110" rx="5" fill="#4a7ab5" stroke="#2a5a8a" stroke-width="1.5"/>
                <text x="120" y="100" text-anchor="middle" font-size="9" fill="white" font-weight="700">PQ</text>
                <text x="120" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3c72">${spec.id} PQ型磁芯</text>
            </svg>`;
    } else if (type === 'RM') {
        return `
            <svg viewBox="0 0 240 180" style="width:100%; max-width:240px;">
                <defs>
                    <linearGradient id="coreGradRM" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3a5a8a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <!-- RM 型 - 圆形 -->
                <rect x="40" y="20" width="160" height="22" rx="10" fill="url(#coreGradRM)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="40" y="138" width="160" height="22" rx="10" fill="url(#coreGradRM)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="40" y="20" width="25" height="140" rx="10" fill="url(#coreGradRM)" stroke="#0f2a4a" stroke-width="1.5"/>
                <rect x="175" y="20" width="25" height="140" rx="10" fill="url(#coreGradRM)" stroke="#0f2a4a" stroke-width="1.5"/>
                <circle cx="120" cy="90" r="35" fill="#4a7ab5" stroke="#2a5a8a" stroke-width="1.5"/>
                <text x="120" y="95" text-anchor="middle" font-size="9" fill="white" font-weight="700">RM</text>
                <text x="120" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3c72">${spec.id} RM型磁芯</text>
            </svg>`;
    } else if (type === 'Toroid') {
        return `
            <svg viewBox="0 0 240 180" style="width:100%; max-width:240px;">
                <defs>
                    <linearGradient id="coreGradTor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3a5a8a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <!-- 环形磁芯 -->
                <circle cx="120" cy="90" r="65" fill="none" stroke="url(#coreGradTor)" stroke-width="28"/>
                <circle cx="120" cy="90" r="50" fill="none" stroke="#4a7ab5" stroke-width="2" opacity="0.3"/>
                <circle cx="120" cy="90" r="80" fill="none" stroke="#4a7ab5" stroke-width="2" opacity="0.3"/>
                <text x="120" y="95" text-anchor="middle" font-size="9" fill="white" font-weight="700">环形</text>
                <text x="120" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3c72">${spec.id} 环形磁芯</text>
                <text x="120" y="175" text-anchor="middle" font-size="7" fill="#6b7a95">OD=${spec.dimA}mm ID=${spec.dimB}mm H=${spec.dimC}mm</text>
            </svg>`;
    }
    return `<div style="font-size:3rem;padding:20px;">📦</div>`;
}

function renderDetail(spec) {
    const typeClass = `spec-type-${spec.type.toLowerCase()}`;
    const C1 = spec.Le / spec.Ae;
    const supInfo = SUPPLIERS[spec.supplier] || { name: spec.supplier, logo: '🏢', country: '' };
    
    specDetailBody.innerHTML = `
        <div class="spec-core-visual">
            ${renderCoreVisual(spec)}
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
                <div class="spec-detail-label">供应商</div>
                <div class="spec-detail-value">${supInfo.logo} ${supInfo.name} (${supInfo.country})</div>
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
                <div class="spec-detail-label">外形尺寸</div>
                <div class="spec-detail-value">${spec.dimA}×${spec.dimB}×${spec.dimC} mm</div>
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
            <button class="spec-btn spec-btn-secondary" onclick="useInCalculator('${spec.id}')">⚡ 用于变压器计算</button>
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
    const supplierFilter = specSupplierFilter.value;

    filteredSpecs = CORE_SPECS.filter(spec => {
        const matchSearch = !searchText || 
            spec.id.toLowerCase().includes(searchText) ||
            spec.type.toLowerCase().includes(searchText) ||
            spec.materialName.toLowerCase().includes(searchText) ||
            spec.series.toLowerCase().includes(searchText) ||
            spec.supplier.toLowerCase().includes(searchText);
        
        const matchType = typeFilter === 'all' || spec.type === typeFilter;
        const matchMaterial = materialFilter === 'all' || spec.material === materialFilter;
        const matchSupplier = supplierFilter === 'all' || spec.supplier === supplierFilter;
        
        return matchSearch && matchType && matchMaterial && matchSupplier;
    });

    updateStats();
    renderTable(filteredSpecs);
}

// ==================== 6. 工具函数 ====================
function copySpec(id) {
    const spec = CORE_SPECS.find(c => c.id === id);
    if (!spec) return;
    
    const text = `${spec.id} (${spec.supplier}): Ae=${spec.Ae}cm², le=${spec.Le}cm, Ve=${spec.Ve}cm³, Aw=${spec.Aw}cm², Bs=${spec.Bs}T, μi=${spec.mu}`;
    
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
    
    // 跳转到变压器计算页面，传递完整参数
    const params = new URLSearchParams({
        core: spec.id,
        ae: spec.Ae,
        le: spec.Le,
        ve: spec.Ve,
        aw: spec.Aw,
        bs: spec.Bs,
        mu: spec.mu,
        supplier: spec.supplier,
        type: spec.type
    });
    window.location.href = 'TransformerCalculation.html?' + params.toString();
}

// ==================== 7. 事件绑定 ====================
function bindEvents() {
    specSearch.addEventListener('input', filterSpecs);
    specTypeFilter.addEventListener('change', filterSpecs);
    specMaterialFilter.addEventListener('change', filterSpecs);
    specSupplierFilter.addEventListener('change', filterSpecs);
}

// ==================== 8. 启动 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}