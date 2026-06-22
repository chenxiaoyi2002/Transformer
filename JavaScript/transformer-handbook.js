/**
 * 变压器与电感器设计手册（第三版）- 知识查询库
 * 对应 index/TransformerHandbook.html
 * 
 * 参考: Colonel Wm. T. McLyman 《Transformer and Inductor Design Handbook》
 * 涵盖 15 章完整知识体系
 */

// ==================== 知识数据库 ====================
const HB_CHAPTERS = [
    {
        id: 'ch1',
        section: '基础理论',
        title: '第1章 · 磁性材料与磁路基础',
        icon: '🧲',
        content: `
            <h2>第1章 · 磁性材料与磁路基础</h2>
            
            <h3>1.1 磁性材料分类</h3>
            <p>磁性材料按矫顽力 Hc 大小可分为：</p>
            <ul>
                <li><strong>软磁材料</strong>（Hc < 10³ A/m）：容易磁化和退磁，如铁氧体、硅钢片、坡莫合金、非晶/纳米晶。适用于变压器、电感器、磁放大器等。</li>
                <li><strong>硬磁材料</strong>（Hc > 10⁴ A/m）：磁化后不易退磁，即永磁材料，如钕铁硼、铁氧体永磁、铝镍钴等。</li>
                <li><strong>半硬磁材料</strong>（Hc 介于两者之间）：用于磁滞电机、磁保持继电器等。</li>
            </ul>

            <div class="hb-figure">
                <svg viewBox="0 0 560 200" style="width:100%; max-width:560px;">
                    <text x="280" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">磁性材料分类总图</text>
                    <rect x="20" y="35" width="160" height="55" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                    <text x="100" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">软磁材料</text>
                    <text x="100" y="75" text-anchor="middle" font-size="8" fill="#3b82f6">Hc < 10³ A/m</text>
                    <rect x="200" y="35" width="160" height="55" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                    <text x="280" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">半硬磁材料</text>
                    <text x="280" y="75" text-anchor="middle" font-size="8" fill="#f59e0b">Hc 中等级别</text>
                    <rect x="380" y="35" width="160" height="55" rx="8" fill="#fce7f3" stroke="#ec4899" stroke-width="2"/>
                    <text x="460" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="#9d174d">硬磁材料</text>
                    <text x="460" y="75" text-anchor="middle" font-size="8" fill="#ec4899">Hc > 10⁴ A/m</text>
                    <text x="100" y="115" text-anchor="middle" font-size="8.5" fill="#4b556b">铁氧体 · 硅钢片 · 坡莫合金</text>
                    <text x="100" y="128" text-anchor="middle" font-size="8.5" fill="#4b556b">非晶 · 纳米晶</text>
                    <text x="280" y="115" text-anchor="middle" font-size="8.5" fill="#4b556b">磁滞电机材料</text>
                    <text x="280" y="128" text-anchor="middle" font-size="8.5" fill="#4b556b">磁保持继电器用</text>
                    <text x="460" y="115" text-anchor="middle" font-size="8.5" fill="#4b556b">钕铁硼 · 铁氧体永磁</text>
                    <text x="460" y="128" text-anchor="middle" font-size="8.5" fill="#4b556b">铝镍钴 · 钐钴</text>
                    <text x="100" y="155" text-anchor="middle" font-size="8" fill="#6b7a95">↕ 高频变压器、电感器</text>
                    <text x="280" y="155" text-anchor="middle" font-size="8" fill="#6b7a95">↕ 特殊电机</text>
                    <text x="460" y="155" text-anchor="middle" font-size="8" fill="#6b7a95">↕ 永磁电机、传感器</text>
                </svg>
                <figcaption>图1-1 磁性材料按矫顽力分类</figcaption>
            </div>

            <h3>1.2 基本磁学量</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>物理量</th><th>符号</th><th>单位</th><th>定义与说明</th></tr></thead>
                    <tbody>
                        <tr><td>磁通量</td><td>Φ</td><td>Wb（韦伯）</td><td>通过某一截面的磁力线总数</td></tr>
                        <tr><td>磁通密度</td><td>B</td><td>T（特斯拉）</td><td>B = Φ/A，单位面积磁通</td></tr>
                        <tr><td>磁场强度</td><td>H</td><td>A/m</td><td>由电流产生的磁场大小</td></tr>
                        <tr><td>磁导率</td><td>μ</td><td>H/m</td><td>μ = B/H，材料导磁能力</td></tr>
                        <tr><td>相对磁导率</td><td>μᵣ</td><td>—</td><td>μᵣ = μ/μ₀</td></tr>
                        <tr><td>真空磁导率</td><td>μ₀</td><td>H/m</td><td>μ₀ = 4π × 10⁻⁷ H/m</td></tr>
                        <tr><td>磁阻</td><td>ℛ</td><td>H⁻¹</td><td>ℛ = l/(μA)，磁路中的阻碍</td></tr>
                        <tr><td>磁动势</td><td>MMF</td><td>A·t（安匝）</td><td>MMF = N·I</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表1-1 基本磁学量汇总</figcaption>
            </div>

            <div class="hb-formula">
                <span class="formula-label">安培环路定律</span>
                ∮ H · dl = ΣI = N · I
            </div>

            <div class="hb-formula">
                <span class="formula-label">法拉第电磁感应定律</span>
                E = N · dΦ/dt = N · A · dB/dt
            </div>

            <div class="hb-formula">
                <span class="formula-label">磁路欧姆定律</span>
                Φ = MMF / ℛ = (N·I) / (l<sub>e</sub> / μ·A<sub>e</sub>)
            </div>

            <h3>1.3 B-H 曲线与磁滞回线</h3>
            <p>B-H 曲线是磁性材料最基本的特性曲线，描述了磁通密度 B 与磁场强度 H 之间的关系。</p>
            <ul>
                <li><strong>初始磁化曲线</strong>：从完全退磁状态（H=0, B=0）开始，逐步增大 H 得到的 B-H 曲线。</li>
                <li><strong>磁滞回线</strong>：材料达到饱和后，减小 H 至反向饱和再回到正向饱和所形成的闭合曲线。</li>
                <li><strong>饱和磁密 B<sub>s</sub></strong>：材料中所有磁畴都沿外磁场方向排列时的最大磁通密度。</li>
                <li><strong>剩磁 B<sub>r</sub></strong>：H 减小到零时材料中残留的磁通密度。</li>
                <li><strong>矫顽力 H<sub>c</sub></strong>：使 B 降到零所需的反向磁场强度。</li>
            </ul>

            <div class="hb-figure">
                <svg viewBox="0 0 400 260" style="width:100%; max-width:400px;">
                    <!-- 坐标系 -->
                    <line x1="30" y1="200" x2="370" y2="200" stroke="#333" stroke-width="1.5"/>
                    <line x1="200" y1="20" x2="200" y2="240" stroke="#333" stroke-width="1.5"/>
                    <text x="365" y="215" font-size="11" font-weight="600" fill="#1a2c3e">H</text>
                    <text x="210" y="25" font-size="11" font-weight="600" fill="#1a2c3e">B</text>
                    <!-- 磁滞回线 -->
                    <path d="M 350 40 Q 310 40 280 70 Q 250 100 220 120 Q 200 135 200 170 Q 200 200 220 200 Q 250 200 280 170 Q 310 140 350 40" fill="none" stroke="#2563eb" stroke-width="2.5"/>
                    <path d="M 350 40 Q 310 40 280 70 Q 250 100 220 120 Q 200 135 200 170 Q 200 200 220 200 Q 250 200 280 170 Q 310 140 350 40" fill="none" stroke="#dc2626" stroke-width="2.5" transform="rotate(180,200,130)"/>
                    <!-- 标注 -->
                    <line x1="200" y1="40" x2="160" y2="40" stroke="#999" stroke-dasharray="3,3"/>
                    <text x="140" y="44" font-size="9" fill="#4b556b">B<sub>s</sub></text>
                    <line x1="200" y1="170" x2="150" y2="170" stroke="#999" stroke-dasharray="3,3"/>
                    <text x="135" y="174" font-size="9" fill="#4b556b">B<sub>r</sub></text>
                    <line x1="240" y1="200" x2="240" y2="215" stroke="#999" stroke-dasharray="3,3"/>
                    <text x="238" y="228" font-size="9" fill="#4b556b">H<sub>c</sub></text>
                    <text x="30" y="130" font-size="8" fill="#6b7a95">B-H 磁滞回线</text>
                    <text x="30" y="145" font-size="8" fill="#6b7a95">面积 = 磁滞损耗</text>
                </svg>
                <figcaption>图1-2 典型软磁材料 B-H 磁滞回线</figcaption>
            </div>

            <div class="hb-keypoint">
                <strong>⚡ 关键知识点：</strong><br>
                B-H 回线的面积代表材料在每个磁化周期中的磁滞损耗能量。<br>
                软磁材料的 Hc 小，回线窄，损耗低；硬磁材料的 Hc 大，回线宽。<br>
                变压器设计通常工作在 B-H 回线的小幅值区域内以降低损耗。
            </div>

            <h3>1.4 磁导率及其影响因素</h3>
            <p>磁导率 μ = B/H 是衡量材料导磁能力的关键参数。对于变压器设计，以下磁导率概念很重要：</p>
            <ul>
                <li><strong>初始磁导率 μ<sub>i</sub></strong>：在 H→0 的极限条件下 B/H 的比值，即 B-H 曲线起始点的斜率。</li>
                <li><strong>有效磁导率 μ<sub>e</sub></strong>：考虑气隙后磁芯的等效磁导率。</li>
                <li><strong>振幅磁导率 μ<sub>a</sub></strong>：在交变磁场下，B 峰值与 H 峰值的比值。</li>
                <li><strong>增量磁导率 μ<sub>Δ</sub></strong>：在 DC 偏磁条件下叠加小信号 AC 时的磁导率。</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">有效磁导率（含气隙）</span>
                μ<sub>e</sub> = μ<sub>i</sub> / (1 + μ<sub>i</sub> · g / l<sub>e</sub>)
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">其中 g = 气隙长度，l<sub>e</sub> = 有效磁路长度</span>
            </div>

            <h3>1.5 磁芯损耗</h3>
            <p>磁芯在交变磁场中工作会产生损耗，主要包括：</p>
            <ul>
                <li><strong>磁滞损耗 P<sub>h</sub></strong>：由磁畴壁来回移动时的摩擦产生，与频率成正比，与 B-H 回线面积成正比。P<sub>h</sub> ∝ f · B<sup>n</sup>（n 约为 1.6~2.0）。</li>
                <li><strong>涡流损耗 P<sub>e</sub></strong>：交变磁场在磁芯中感应出涡流，产生 I²R 损耗。P<sub>e</sub> ∝ f² · B² · d²/ρ（d 为材料厚度，ρ 为电阻率）。</li>
                <li><strong>剩余损耗 P<sub>r</sub></strong>：除磁滞和涡流以外的损耗，在低频时通常很小。</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">Steinmetz 经验公式（总磁芯损耗）</span>
                P<sub>v</sub> = k · f<sup>α</sup> · B<sup>β</sup>
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">k, α, β 由材料性质决定，典型值：α≈1.3, β≈2.2~2.5</span>
            </div>

            <h3>1.6 集肤效应与邻近效应</h3>
            <p>高频电流在导体中流动时会产生两种重要效应：</p>
            <ul>
                <li><strong>集肤效应（Skin Effect）</strong>：高频电流倾向于在导体表面流动，导致有效截面积减小，AC 电阻增大。集肤深度 δ = √(ρ/(π·f·μ))。</li>
                <li><strong>邻近效应（Proximity Effect）</strong>：相邻导线中的交变电流产生的磁场会在邻近导线中感应出涡流，进一步增加 AC 电阻。</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">集肤深度计算公式</span>
                δ = √(2 / (ω · μ · σ)) = √(ρ / (π · f · μ<sub>0</sub> · μ<sub>r</sub>))
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">铜在 100kHz 下集肤深度 ≈ 0.21mm，500kHz 下 ≈ 0.093mm</span>
            </div>

            <div class="hb-tip">
                <span class="tip-icon">💡</span>
                <div><strong>设计建议：</strong>为减小高频绕组损耗，导线直径应小于 2 倍集肤深度。高频时推荐使用利兹线（Litz wire）或多股细线并绕。</div>
            </div>
        `
    },
    {
        id: 'ch2',
        section: '磁芯材料',
        title: '第2章 · 磁芯材料与磁芯结构',
        icon: '📦',
        content: `
            <h2>第2章 · 磁芯材料与磁芯结构</h2>
            
            <h3>2.1 铁氧体磁芯</h3>
            <p>铁氧体是由氧化铁（Fe₂O₃）与其他金属氧化物（如 MnO、ZnO、NiO 等）经陶瓷工艺烧结而成的磁性材料。</p>
            <ul>
                <li><strong>MnZn 铁氧体</strong>：锰锌铁氧体，μᵢ = 2000~15000，Bs ≈ 0.4~0.5T，适用于 10kHz~1MHz。是最常用的功率铁氧体材料。</li>
                <li><strong>NiZn 铁氧体</strong>：镍锌铁氧体，μᵢ = 10~1500，Bs ≈ 0.3~0.4T，适用于 1MHz~100MHz。电阻率高，高频特性好。</li>
            </ul>
            
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>材料牌号</th><th>μᵢ</th><th>B<sub>s</sub> (T)</th><th>B<sub>r</sub> (T)</th><th>H<sub>c</sub> (A/m)</th><th>适用频率</th><th>典型用途</th></tr></thead>
                    <tbody>
                        <tr><td>PC40</td><td>2300</td><td>0.51</td><td>0.10</td><td>24</td><td>~500kHz</td><td>功率变压器</td></tr>
                        <tr><td>PC44</td><td>2400</td><td>0.51</td><td>0.10</td><td>20</td><td>~700kHz</td><td>高频变压器</td></tr>
                        <tr><td>PC47</td><td>2500</td><td>0.53</td><td>0.12</td><td>18</td><td>~1MHz</td><td>高效变压器</td></tr>
                        <tr><td>PC95</td><td>3300</td><td>0.53</td><td>0.10</td><td>15</td><td>~300kHz</td><td>大功率变压器</td></tr>
                        <tr><td>LP3</td><td>2200</td><td>0.50</td><td>0.09</td><td>22</td><td>~600kHz</td><td>低损耗变压器</td></tr>
                        <tr><td>3C90</td><td>2300</td><td>0.49</td><td>0.11</td><td>25</td><td>~400kHz</td><td>通用功率转换</td></tr>
                        <tr><td>3C95</td><td>3400</td><td>0.53</td><td>0.12</td><td>16</td><td>~300kHz</td><td>大功率变压器</td></tr>
                        <tr><td>3F3</td><td>2000</td><td>0.44</td><td>0.09</td><td>28</td><td>~700kHz</td><td>高频功率变压器</td></tr>
                        <tr><td>3F4</td><td>900</td><td>0.36</td><td>0.07</td><td>35</td><td>~3MHz</td><td>超高频变压器</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表2-1 常用铁氧体材料参数对比</figcaption>
            </div>

            <h3>2.2 金属磁粉芯</h3>
            <p>金属磁粉芯是将铁磁合金粉末与绝缘粘结剂混合压制而成的软磁材料。由于粉末颗粒间有绝缘层分隔，涡流损耗大幅降低。</p>
            <ul>
                <li><strong>铁粉芯 (Iron Powder)</strong>：μ=10~100，Bs≈1.5T，成本低，适用于储能电感、PFC 电感、大功率应用。</li>
                <li><strong>铁硅铝 (Sendust / Kool Mu)</strong>：μ=26~125，Bs≈1.0T，损耗低，DC 偏磁特性优良，适用于输出滤波电感。</li>
                <li><strong>MPP (钼坡莫合金)</strong>：μ=14~550，Bs≈0.7T，损耗最低，温度稳定性最好，适用于精密电源和滤波器。</li>
                <li><strong>高磁通 (High Flux)</strong>：μ=14~160，Bs≈1.5T，储能能力最高，适用于高功率紧凑型设计。</li>
            </ul>

            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>材料类型</th><th>磁导率范围</th><th>Bs (T)</th><th>损耗级别</th><th>DC偏磁特性</th><th>温度稳定性</th><th>相对成本</th></tr></thead>
                    <tbody>
                        <tr><td>铁粉芯</td><td>10~100</td><td>1.5</td><td>高</td><td>良好</td><td>一般</td><td>低</td></tr>
                        <tr><td>铁硅铝</td><td>26~125</td><td>1.0</td><td>中低</td><td>优良</td><td>良好</td><td>中</td></tr>
                        <tr><td>MPP</td><td>14~550</td><td>0.7</td><td>最低</td><td>良好</td><td>优良</td><td>高</td></tr>
                        <tr><td>高磁通</td><td>14~160</td><td>1.5</td><td>中</td><td>优良</td><td>良好</td><td>中高</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表2-2 金属磁粉芯材料对比</figcaption>
            </div>

            <h3>2.3 磁芯结构类型</h3>
            <div class="hb-figure">
                <svg viewBox="0 0 560 220" style="width:100%; max-width:560px;">
                    <text x="280" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">常用磁芯结构示意图</text>
                    <!-- EE 型 -->
                    <g transform="translate(20,40)">
                        <rect x="0" y="0" width="60" height="80" rx="4" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="15" y="0" width="30" height="80" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" rx="2"/>
                        <text x="30" y="95" text-anchor="middle" font-size="9" fill="#4b556b">EE 型</text>
                    </g>
                    <!-- ETD 型 -->
                    <g transform="translate(110,40)">
                        <rect x="0" y="15" width="60" height="50" rx="25" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="15" y="5" width="30" height="70" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                        <text x="30" y="95" text-anchor="middle" font-size="9" fill="#4b556b">ETD 型</text>
                    </g>
                    <!-- PQ 型 -->
                    <g transform="translate(200,40)">
                        <rect x="5" y="5" width="55" height="70" rx="15" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="18" y="10" width="28" height="60" rx="8" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/>
                        <text x="30" y="95" text-anchor="middle" font-size="9" fill="#4b556b">PQ 型</text>
                    </g>
                    <!-- RM 型 -->
                    <g transform="translate(290,40)">
                        <rect x="5" y="5" width="50" height="70" rx="6" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="15" y="10" width="30" height="60" rx="4" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="1.5"/>
                        <text x="30" y="95" text-anchor="middle" font-size="9" fill="#4b556b">RM 型</text>
                    </g>
                    <!-- Toroid -->
                    <g transform="translate(380,40)">
                        <circle cx="35" cy="40" r="35" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <circle cx="35" cy="40" r="15" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/>
                        <text x="35" y="95" text-anchor="middle" font-size="9" fill="#4b556b">环形</text>
                    </g>
                    <!-- UI 型 -->
                    <g transform="translate(480,40)">
                        <rect x="0" y="0" width="20" height="80" rx="3" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="40" y="0" width="20" height="80" rx="3" fill="none" stroke="#1e4a76" stroke-width="2"/>
                        <rect x="0" y="0" width="60" height="20" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
                        <rect x="0" y="60" width="60" height="20" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
                        <text x="30" y="95" text-anchor="middle" font-size="9" fill="#4b556b">UI 型</text>
                    </g>
                </svg>
                <figcaption>图2-1 常用磁芯结构类型</figcaption>
            </div>

            <h4>各种磁芯的特点与选用</h4>
            <ul>
                <li><strong>EE/EI 型</strong>：最常用的磁芯形式，成本低，绕线方便。适用于中小功率变压器和电感器。</li>
                <li><strong>ETD 型</strong>：圆形中柱设计，绕组平均匝长短，漏感小。适用于大功率、高频变压器。</li>
                <li><strong>PQ 型</strong>：方形结构，窗口面积大，绕线空间好，热阻小。适用于大功率电源。</li>
                <li><strong>RM 型</strong>：圆形结构，磁屏蔽效果好。适用于通信电源和滤波器。</li>
                <li><strong>环形 (Toroid)</strong>：磁路封闭，电磁干扰最低。适用于滤波器和小功率变压器。</li>
                <li><strong>UI/UR 型</strong>：大功率电感器常用，气隙调整灵活。</li>
            </ul>

            <h3>2.4 磁芯参数定义</h3>
            <ul>
                <li><strong>A<sub>e</sub></strong> — 有效截面积 (cm²)：磁芯中磁通路径的有效横截面积</li>
                <li><strong>l<sub>e</sub></strong> — 有效磁路长度 (cm)：磁通在磁芯中的平均路径长度</li>
                <li><strong>V<sub>e</sub></strong> — 有效体积 (cm³)：V<sub>e</sub> = A<sub>e</sub> × l<sub>e</sub></li>
                <li><strong>A<sub>w</sub></strong> — 窗口面积 (cm²)：可用于容纳绕组的空间面积</li>
                <li><strong>A<sub>p</sub></strong> — 面积乘积 (cm⁴)：A<sub>p</sub> = A<sub>e</sub> × A<sub>w</sub>，衡量磁芯的功率处理能力</li>
                <li><strong>C<sub>1</sub></strong> — 磁芯常数 (cm⁻¹)：C<sub>1</sub> = l<sub>e</sub>/A<sub>e</sub>，用于计算气隙和 AL 值</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">面积乘积法（磁芯功率容量估算）</span>
                A<sub>p</sub> = A<sub>e</sub> · A<sub>w</sub> = (P<sub>o</sub> · 10⁴) / (K<sub>f</sub> · K<sub>u</sub> · B<sub>m</sub> · f · J)
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">K<sub>f</sub> = 波形系数（正弦波4.44，方波4.0），K<sub>u</sub> = 窗口利用系数</span>
            </div>
        `
    },
    {
        id: 'ch3',
        section: '磁芯设计',
        title: '第3章 · 磁芯选择与面积乘积法',
        icon: '📐',
        content: `
            <h2>第3章 · 磁芯选择与面积乘积法</h2>
            
            <h3>3.1 面积乘积法（A<sub>p</sub> 法）原理</h3>
            <p>面积乘积法是最常用的磁芯选型方法。A<sub>p</sub> = A<sub>e</sub> × A<sub>w</sub> 综合了磁芯的磁路截面积和窗口面积，反映了磁芯能处理的功率容量。</p>
            
            <div class="hb-steps">
                <div class="hb-step">
                    <div class="hb-step-num">1</div>
                    <div class="hb-step-content">
                        <strong>确定设计规格</strong>
                        <span>输入输出电压 V<sub>in</sub>、V<sub>out</sub>，输出功率 P<sub>o</sub>，开关频率 f<sub>sw</sub>，效率 η</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">2</div>
                    <div class="hb-step-content">
                        <strong>计算视在功率 P<sub>t</sub></strong>
                        <span>P<sub>t</sub> = P<sub>o</sub> × (1/η + 1) 或根据拓扑具体公式</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">3</div>
                    <div class="hb-step-content">
                        <strong>计算所需 A<sub>p</sub></strong>
                        <span>A<sub>p</sub> = (P<sub>t</sub> × 10⁴) / (K<sub>f</sub> × K<sub>u</sub> × B<sub>m</sub> × f × J)</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">4</div>
                    <div class="hb-step-content">
                        <strong>选择磁芯</strong>
                        <span>从产品手册中选择 A<sub>p</sub> 值大于计算值的磁芯型号</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">5</div>
                    <div class="hb-step-content">
                        <strong>计算匝数</strong>
                        <span>N<sub>p</sub> = V<sub>in</sub> × D / (4.44 × f × B<sub>m</sub> × A<sub>e</sub>)</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">6</div>
                    <div class="hb-step-content">
                        <strong>确定线径</strong>
                        <span>根据电流和电流密度 J 计算导线截面积，考虑集肤效应选择 AWG</span>
                    </div>
                </div>
            </div>

            <div class="hb-formula">
                <span class="formula-label">面积乘积法通用公式</span>
                A<sub>p</sub> = [ (P<sub>o</sub> × 10⁴) / (K<sub>f</sub> · K<sub>u</sub> · B<sub>m</sub> · f · J) ]<sup>1/1.16</sup>
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">式中 K<sub>f</sub> 取决于波形：正弦波 = 4.44，方波 = 4.0</span>
            </div>

            <h3>3.2 波形系数 K<sub>f</sub></h3>
            <p>波形系数 K<sub>f</sub> = 有效值/平均值，不同波形需要不同的 K<sub>f</sub> 值：</p>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>波形类型</th><th>K<sub>f</sub> 值</th><th>应用场景</th></tr></thead>
                    <tbody>
                        <tr><td>正弦波</td><td>4.44</td><td>工频变压器、LLC 谐振</td></tr>
                        <tr><td>方波</td><td>4.0</td><td>全桥、半桥、推挽</td></tr>
                        <tr><td>正激励磁</td><td>4.44</td><td>正激变换器</td></tr>
                        <tr><td>反激励磁</td><td>4.44 × D</td><td>反激变换器</td></tr>
                    </tbody>
                </table>
            </div>

            <h3>3.3 窗口利用系数 K<sub>u</sub></h3>
            <p>窗口利用系数 K<sub>u</sub> 表示窗口面积中被有效绕组导体占据的比例。K<sub>u</sub> 通常包含以下因素：</p>
            <ul>
                <li><strong>导线绝缘层</strong>：漆包线的绝缘漆厚度约占 5~15%</li>
                <li><strong>骨架与挡墙</strong>：骨架壁厚、挡墙胶带占用约 10~20%</li>
                <li><strong>层间绝缘</strong>：层间绝缘胶带占用约 5~10%</li>
                <li><strong>绕线间隙</strong>：圆导线之间的空隙约占 15~25%</li>
            </ul>
            <p>综合而言，K<sub>u</sub> 的典型取值范围：</p>
            <ul>
                <li><strong>多层密绕</strong>：K<sub>u</sub> ≈ 0.3~0.4</li>
                <li><strong>单层绕制</strong>：K<sub>u</sub> ≈ 0.4~0.5</li>
                <li><strong>多绕组复杂设计</strong>：K<sub>u</sub> ≈ 0.2~0.3</li>
            </ul>

            <div class="hb-keypoint">
                <strong>⚡ 重要提示：</strong><br>
                面积乘积法只是初步选型方法。实际设计中还需要验证温升、绕组损耗、漏感、分布电容等参数。建议选择 A<sub>p</sub> 裕量 20~30% 的磁芯。
            </div>
        `
    },
    {
        id: 'ch4',
        section: '绕组设计',
        title: '第4章 · 变压器绕组设计与铜损计算',
        icon: '🔄',
        content: `
            <h2>第4章 · 变压器绕组设计与铜损计算</h2>
            
            <h3>4.1 绕组设计基本原理</h3>
            <p>变压器绕组设计涉及导线选择、匝数确定、绕制方式、绝缘处理等。好的绕组设计应实现：</p>
            <ul>
                <li>最小的直流电阻（DCR）和交流电阻（ACR）</li>
                <li>最小的漏感</li>
                <li>合理的分布电容</li>
                <li>良好的散热条件</li>
                <li>满足绝缘和安规要求</li>
            </ul>

            <h3>4.2 变压器电压-匝数关系方程</h3>
            <div class="hb-formula">
                <span class="formula-label">法拉第定律 - 变压器基本方程</span>
                E = N · A<sub>e</sub> · dB/dt · 10⁻⁸<br>
                E<sub>rms</sub> = 4.44 · f · N · B<sub>m</sub> · A<sub>e</sub> · 10⁻⁸
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">式中 A<sub>e</sub> 单位为 cm²，B<sub>m</sub> 单位为高斯 (G)，1T = 10⁴G</span>
            </div>

            <h3>4.3 匝数计算</h3>
            <div class="hb-formula">
                <span class="formula-label">原边匝数计算</span>
                N<sub>p</sub> = V<sub>in(min)</sub> · D<sub>max</sub> / (4.44 · f · B<sub>m</sub> · A<sub>e</sub> · 10⁻⁸)
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">或 B<sub>m</sub> 以特斯拉为单位时：N<sub>p</sub> = V<sub>in(min)</sub> · D<sub>max</sub> / (4.44 · f · B<sub>m</sub> · A<sub>e</sub>)</span>
            </div>

            <div class="hb-formula">
                <span class="formula-label">副边匝数计算</span>
                N<sub>s</sub> = (V<sub>out</sub> + V<sub>f</sub>) · N<sub>p</sub> / (V<sub>in(min)</sub> · D<sub>max</sub>)
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">V<sub>f</sub> = 输出整流管正向压降（典型 0.5~1.0V）</span>
            </div>

            <h3>4.4 铜损计算</h3>
            <p>铜损是变压器绕组中的 I²R 损耗，包括直流铜损和交流铜损：</p>
            <ul>
                <li><strong>直流铜损</strong>：P<sub>cu_dc</sub> = I²<sub>rms</sub> · R<sub>dc</sub></li>
                <li><strong>交流铜损</strong>：由于集肤效应和邻近效应，AC 电阻大于 DC 电阻</li>
                <li><strong>交流电阻系数</strong>：F<sub>r</sub> = R<sub>ac</sub>/R<sub>dc</sub>，由 Dowell 公式计算</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">铜导线直流电阻</span>
                R<sub>dc</sub> = ρ · l / A
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">铜电阻率 ρ = 1.724 × 10⁻⁸ Ω·m (20°C)，温度系数 α = 0.00393/°C</span>
            </div>

            <div class="hb-formula">
                <span class="formula-label">温度修正后电阻</span>
                R(T) = R(20°C) · [1 + α · (T - 20)]
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">80°C 时铜电阻率 ρ ≈ 2.11 × 10⁻⁸ Ω·m</span>
            </div>

            <h3>4.5 导线选择</h3>
            <p>导线选择基于电流密度 J（通常 3~6 A/mm²）：</p>
            <ul>
                <li><strong>自然冷却</strong>：J = 2~4 A/mm²</li>
                <li><strong>强制风冷</strong>：J = 4~6 A/mm²</li>
                <li><strong>油冷/水冷</strong>：J = 6~10 A/mm²</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">导线截面积计算</span>
                A<sub>w</sub> = I<sub>rms</sub> / J
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">导线直径 d = 2 × √(A<sub>w</sub>/π)，需选择接近的 AWG 标准线规</span>
            </div>

            <h3>4.6 变压器设计铜损优化</h3>
            <ul>
                <li><strong>最小铜损原则</strong>：铜损与铁损应尽量平衡，使总损耗最小。通常在 P<sub>cu</sub> ≈ P<sub>fe</sub> 时效率最高。</li>
                <li><strong>利兹线应用</strong>：当工作频率较高（>100kHz）时，使用多股细线绞合的利兹线可降低集肤效应损耗。</li>
                <li><strong>铜箔绕组</strong>：大电流输出（>20A）时使用铜箔代替圆导线，可减小集肤效应并改善散热。</li>
                <li><strong>交错绕法</strong>：将原副边绕组交替排列可减小漏感，降低交流损耗。</li>
            </ul>

            <div class="hb-tip">
                <span class="tip-icon">💡</span>
                <div><strong>绕组设计建议：</strong>原副边交错排列（如 P-S-P 或 S-P-S）可降低漏感 50~70%。对于大电流输出，使用铜箔绕组或多股并绕。</div>
            </div>
        `
    },
    {
        id: 'ch5',
        section: '正激变换器',
        title: '第5章 · 正激变换器变压器设计',
        icon: '➡️',
        content: `
            <h2>第5章 · 正激变换器变压器设计</h2>
            
            <h3>5.1 正激变换器工作原理</h3>
            <p>正激变换器（Forward Converter）是最基本的 DC-DC 变换器拓扑之一。其特点是在开关管导通时，能量从原边直接传递到副边。</p>
            
            <div class="hb-figure">
                <svg viewBox="0 0 500 200" style="width:100%; max-width:500px;">
                    <text x="250" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">正激变换器主电路</text>
                    <rect x="20" y="70" width="40" height="30" rx="4" fill="#eef3fc" stroke="#3b82f6" stroke-width="1.5"/>
                    <text x="40" y="90" text-anchor="middle" font-size="9" font-weight="600" fill="#1e4a76">Vin</text>
                    <rect x="80" y="72" width="30" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                    <text x="95" y="90" text-anchor="middle" font-size="8" fill="#92400e">Q</text>
                    <rect x="130" y="50" width="70" height="70" rx="5" fill="white" stroke="#1e4a76" stroke-width="1.5"/>
                    <line x1="140" y1="65" x2="190" y2="65" stroke="#1e4a76" stroke-width="1.5"/>
                    <line x1="140" y1="85" x2="190" y2="85" stroke="#1e4a76" stroke-width="1.5"/>
                    <line x1="140" y1="105" x2="190" y2="105" stroke="#1e4a76" stroke-width="1.5"/>
                    <text x="165" y="92" text-anchor="middle" font-size="9" fill="#0c4a6e">T</text>
                    <text x="220" y="95" text-anchor="middle" font-size="10" fill="#dc2626">D1</text>
                    <rect x="230" y="55" width="40" height="25" rx="3" fill="#eef3fc" stroke="#3b82f6" stroke-width="1.5"/>
                    <text x="250" y="72" text-anchor="middle" font-size="8" fill="#1e4a76">Lf</text>
                    <rect x="280" y="72" width="30" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                    <text x="295" y="90" text-anchor="middle" font-size="8" fill="#92400e">Co</text>
                    <rect x="330" y="72" width="40" height="26" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1.5"/>
                    <text x="350" y="90" text-anchor="middle" font-size="8" fill="#065f46">Rload</text>
                    <line x1="60" y1="85" x2="80" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="110" y1="85" x2="130" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="200" y1="85" x2="220" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="285" y1="85" x2="330" y2="85" stroke="#333" stroke-width="1.5"/>
                    <text x="250" y="150" text-anchor="middle" font-size="9" fill="#6b7a95">开关管导通时原边储能并传递到副边</text>
                    <text x="250" y="165" text-anchor="middle" font-size="9" fill="#6b7a95">需要磁复位电路（第三绕组或RCD复位）</text>
                </svg>
                <figcaption>图5-1 正激变换器电路原理</figcaption>
            </div>

            <h3>5.2 正激变压器设计要点</h3>
            <ul>
                <li><strong>占空比 D<sub>max</sub> ≤ 0.5</strong>：正激变换器的最大占空比受磁复位限制，通常不超过 0.45~0.5。</li>
                <li><strong>磁复位方式</strong>：第三绕组复位（最常用）、RCD 复位、有源钳位复位。</li>
                <li><strong>匝数比计算</strong>：n = N<sub>p</sub>/N<sub>s</sub> = V<sub>in</sub> · D / V<sub>out</sub></li>
                <li><strong>伏秒平衡</strong>：正激变压器设计需确保每个周期的伏秒积相等，避免磁芯饱和。</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">正激变压器设计公式</span>
                N<sub>p</sub> = V<sub>in(min)</sub> · D<sub>max</sub> · 10⁸ / (4.44 · f · B<sub>m</sub> · A<sub>e</sub>)<br>
                N<sub>s</sub> = (V<sub>o</sub> + V<sub>f</sub>) · N<sub>p</sub> / (V<sub>in(min)</sub> · D<sub>max</sub>)
            </div>

            <div class="hb-formula">
                <span class="formula-label">磁复位绕组匝数（第三绕组）</span>
                N<sub>r</sub> ≥ N<sub>p</sub>    （一般取 N<sub>r</sub> = N<sub>p</sub>）
            </div>

            <h3>5.3 设计实例（50W 正激变压器）</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>参数</th><th>值</th><th>说明</th></tr></thead>
                    <tbody>
                        <tr><td>输入电压 V<sub>in</sub></td><td>200~400V DC</td><td>PFC 输出母线电压</td></tr>
                        <tr><td>输出电压 V<sub>out</sub></td><td>12V</td><td>—</td></tr>
                        <tr><td>输出功率 P<sub>o</sub></td><td>50W</td><td>—</td></tr>
                        <tr><td>开关频率 f<sub>sw</sub></td><td>100kHz</td><td>—</td></tr>
                        <tr><td>最大占空比 D<sub>max</sub></td><td>0.45</td><td>留有余量</td></tr>
                        <tr><td>磁芯型号</td><td>EE30</td><td>A<sub>e</sub> = 0.92 cm²</td></tr>
                        <tr><td>磁通密度摆幅 ΔB</td><td>0.2T</td><td>铁氧体典型值</td></tr>
                        <tr><td>原边匝数 N<sub>p</sub></td><td>52 匝</td><td>取整后</td></tr>
                        <tr><td>副边匝数 N<sub>s</sub></td><td>4 匝</td><td>取整后</td></tr>
                        <tr><td>原边线径</td><td>0.4mm (AWG26)</td><td>J = 4A/mm²</td></tr>
                        <tr><td>副边线径</td><td>0.8mm × 2 股</td><td>多股并绕降损耗</td></tr>
                        <tr><td>磁复位绕组</td><td>52 匝</td><td>等于原边匝数</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="hb-keypoint">
                <strong>⚡ 设计要点：</strong><br>
                1. 正激变压器必须可靠磁复位，否则会导致磁芯饱和损坏开关管。<br>
                2. 第三绕组复位是最可靠的方式，但会增加绕组层数和成本。<br>
                3. 有源钳位复位可提高效率，适合高频设计（>200kHz）。<br>
                4. 输出滤波电感 L<sub>f</sub> 需要独立设计，其电流纹波通常取 20~30% 的负载电流。
            </div>
        `
    },
    {
        id: 'ch6',
        section: '反激变换器',
        title: '第6章 · 反激变换器变压器设计',
        icon: '🔄',
        content: `
            <h2>第6章 · 反激变换器变压器设计</h2>
            
            <h3>6.1 反激变换器工作原理</h3>
            <p>反激变换器（Flyback Converter）是最简单、成本最低的隔离型 DC-DC 变换器。其变压器实际是一个耦合电感，在开关管导通时储能，关断时释放能量到副边。</p>
            
            <div class="hb-figure">
                <svg viewBox="0 0 500 200" style="width:100%; max-width:500px;">
                    <text x="250" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">反激变换器主电路</text>
                    <rect x="20" y="70" width="40" height="30" rx="4" fill="#eef3fc" stroke="#3b82f6" stroke-width="1.5"/>
                    <text x="40" y="90" text-anchor="middle" font-size="9" font-weight="600" fill="#1e4a76">Vin</text>
                    <rect x="80" y="72" width="30" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                    <text x="95" y="90" text-anchor="middle" font-size="8" fill="#92400e">Q</text>
                    <rect x="130" y="50" width="70" height="70" rx="5" fill="white" stroke="#8b5cf6" stroke-width="1.5"/>
                    <line x1="140" y1="65" x2="190" y2="65" stroke="#8b5cf6" stroke-width="1.5"/>
                    <line x1="140" y1="105" x2="190" y2="105" stroke="#8b5cf6" stroke-width="1.5"/>
                    <text x="165" y="92" text-anchor="middle" font-size="9" fill="#5b21b6">T</text>
                    <text x="165" y="120" text-anchor="middle" font-size="7" fill="#6b7a95">带气隙</text>
                    <text x="220" y="95" text-anchor="middle" font-size="10" fill="#dc2626">D1</text>
                    <rect x="240" y="72" width="30" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                    <text x="255" y="90" text-anchor="middle" font-size="8" fill="#92400e">Co</text>
                    <rect x="300" y="72" width="40" height="26" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1.5"/>
                    <text x="320" y="90" text-anchor="middle" font-size="8" fill="#065f46">Rload</text>
                    <line x1="60" y1="85" x2="80" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="110" y1="85" x2="130" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="200" y1="85" x2="220" y2="85" stroke="#333" stroke-width="1.5"/>
                    <line x1="270" y1="85" x2="300" y2="85" stroke="#333" stroke-width="1.5"/>
                    <text x="250" y="150" text-anchor="middle" font-size="9" fill="#6b7a95">开关管导通时变压器储能，关断时释放到输出</text>
                    <text x="250" y="165" text-anchor="middle" font-size="9" fill="#6b7a95">变压器须开气隙储存能量，适用于小功率 (5~150W)</text>
                </svg>
                <figcaption>图6-1 反激变换器电路原理</figcaption>
            </div>

            <div class="hb-keypoint">
                <strong>⚡ 关键概念：</strong><br>
                反激变压器的核心是：由于需要储能，磁芯必须开气隙。反激变压器实质是一个耦合电感，气隙中存储了大部分的磁场能量。在同等尺寸下，反激可传输的功率通常比正激小。
            </div>

            <h3>6.2 反激变压器设计公式</h3>
            
            <div class="hb-formula">
                <span class="formula-label">匝数比计算</span>
                n = N<sub>p</sub>/N<sub>s</sub> = V<sub>in(min)</sub> · D<sub>max</sub> / [(V<sub>out</sub> + V<sub>f</sub>) · (1 - D<sub>max</sub>)]
            </div>

            <div class="hb-formula">
                <span class="formula-label">原边电感量（临界模式）</span>
                L<sub>p</sub> = (V<sub>in(min)</sub> · D<sub>max</sub>)² / (2 · P<sub>o</sub> · f<sub>sw</sub> · η)
            </div>

            <div class="hb-formula">
                <span class="formula-label">原边匝数</span>
                N<sub>p</sub> = L<sub>p</sub> · I<sub>pk</sub> / (B<sub>m</sub> · A<sub>e</sub>) · 10⁴
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">I<sub>pk</sub> = 原边峰值电流，B<sub>m</sub> 单位为 T，A<sub>e</sub> 单位为 cm²</span>
            </div>

            <div class="hb-formula">
                <span class="formula-label">气隙长度计算</span>
                g = μ<sub>0</sub> · N<sub>p</sub>² · A<sub>e</sub> / L<sub>p</sub> · 10⁴
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">式中 μ<sub>0</sub> = 4π × 10⁻⁷ H/m，A<sub>e</sub> → m² 需转换</span>
            </div>

            <h3>6.3 反激工作模式选择</h3>
            <ul>
                <li><strong>断续模式 (DCM)</strong>：开关管关断期间副边电流下降到零。优点：无反向恢复问题，控制简单。缺点：峰值电流大，铜损高。</li>
                <li><strong>连续模式 (CCM)</strong>：开关管再次导通时副边电流仍未到零。优点：峰值电流小，铜损低。缺点：需要右半平面零点补偿。</li>
                <li><strong>临界模式 (BCM)</strong>：恰好介于 DCM 和 CCM 之间，常用于 PFC 电路。</li>
            </ul>

            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>参数</th><th>DCM</th><th>CCM</th><th>BCM</th></tr></thead>
                    <tbody>
                        <tr><td>原边电感量</td><td>小</td><td>大</td><td>中等</td></tr>
                        <tr><td>峰值电流</td><td>高</td><td>低</td><td>中等</td></tr>
                        <tr><td>变压器尺寸</td><td>较大</td><td>较小</td><td>中等</td></tr>
                        <tr><td>EMI</td><td>较差</td><td>较好</td><td>中等</td></tr>
                        <tr><td>输出纹波</td><td>较大</td><td>较小</td><td>中等</td></tr>
                        <tr><td>控制补偿</td><td>简单</td><td>较复杂</td><td>中等</td></tr>
                        <tr><td>功率范围</td><td><50W</td><td>>50W</td><td>PFC</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表6-1 反激三种工作模式对比</figcaption>
            </div>

            <h3>6.4 设计实例（20W 反激变压器）</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>参数</th><th>值</th><th>说明</th></tr></thead>
                    <tbody>
                        <tr><td>输入电压 V<sub>in</sub></td><td>85~265V AC</td><td>通用输入</td></tr>
                        <tr><td>输出电压 V<sub>out</sub></td><td>12V</td><td>—</td></tr>
                        <tr><td>输出功率 P<sub>o</sub></td><td>20W</td><td>—</td></tr>
                        <tr><td>开关频率 f<sub>sw</sub></td><td>65kHz</td><td>—</td></tr>
                        <tr><td>最大占空比 D<sub>max</sub></td><td>0.45</td><td>—</td></tr>
                        <tr><td>磁芯型号</td><td>EE25</td><td>A<sub>e</sub> = 0.49 cm²</td></tr>
                        <tr><td>原边电感 L<sub>p</sub></td><td>1.2mH</td><td>DCM 模式</td></tr>
                        <tr><td>原边匝数 N<sub>p</sub></td><td>120 匝</td><td>—</td></tr>
                        <tr><td>副边匝数 N<sub>s</sub></td><td>10 匝</td><td>—</td></tr>
                        <tr><td>辅助绕组 N<sub>a</sub></td><td>15 匝</td><td>VCC = 18V</td></tr>
                        <tr><td>气隙长度 g</td><td>0.35mm</td><td>中心柱研磨</td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    {
        id: 'ch7',
        section: '桥式拓扑',
        title: '第7章 · 桥式变换器变压器设计',
        icon: '🌉',
        content: `
            <h2>第7章 · 桥式变换器变压器设计</h2>
            
            <h3>7.1 半桥变换器 (Half-Bridge)</h3>
            <p>半桥变换器使用两个开关管和两个分压电容，变压器承受的电压为母线电压的一半（V<sub>in</sub>/2）。</p>
            <ul>
                <li><strong>优点</strong>：开关管电压应力低（仅为 V<sub>in</sub>），抗不平衡能力强。</li>
                <li><strong>缺点</strong>：需要两个高压电容，有效占空比范围有限。</li>
                <li><strong>功率范围</strong>：100W~500W</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">半桥变压器匝数计算</span>
                N<sub>p</sub> = (V<sub>in</sub>/2) · D · 10⁸ / (4.44 · f · B<sub>m</sub> · A<sub>e</sub>)
            </div>

            <h3>7.2 全桥变换器 (Full-Bridge)</h3>
            <p>全桥变换器使用四个开关管组成 H 桥，变压器承受完整的母线电压。</p>
            <ul>
                <li><strong>优点</strong>：变压器利用率高，功率密度大，适合大功率应用。</li>
                <li><strong>缺点</strong>：需要四路隔离驱动，电路复杂度高。</li>
                <li><strong>功率范围</strong>：500W~2000W</li>
            </ul>

            <h3>7.3 推挽变换器 (Push-Pull)</h3>
            <p>推挽变换器使用两个开关管，变压器原边有中心抽头。</p>
            <ul>
                <li><strong>优点</strong>：驱动简单，无需要高压电容。</li>
                <li><strong>缺点</strong>：开关管电压应力高（2×V<sub>in</sub>），可能存在偏磁饱和问题。</li>
                <li><strong>功率范围</strong>：100W~500W</li>
            </ul>

            <h3>7.4 桥式拓扑对比</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>参数</th><th>半桥</th><th>全桥</th><th>推挽</th></tr></thead>
                    <tbody>
                        <tr><td>开关管数量</td><td>2</td><td>4</td><td>2</td></tr>
                        <tr><td>开关管电压应力</td><td>V<sub>in</sub></td><td>V<sub>in</sub></td><td>2·V<sub>in</sub></td></tr>
                        <tr><td>变压器输入电压</td><td>V<sub>in</sub>/2</td><td>V<sub>in</sub></td><td>V<sub>in</sub></td></tr>
                        <tr><td>最大占空比</td><td><0.5</td><td><0.5</td><td><0.5</td></tr>
                        <tr><td>抗不平衡能力</td><td>强</td><td>中等</td><td>弱（需电流控制）</td></tr>
                        <tr><td>隔离驱动数</td><td>2</td><td>4</td><td>2</td></tr>
                        <tr><td>典型功率</td><td>100~500W</td><td>500~2000W</td><td>100~500W</td></tr>
                        <tr><td>效率</td><td>中等</td><td>高</td><td>中等</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表7-1 桥式拓扑参数对比</figcaption>
            </div>
        `
    },
    {
        id: 'ch8',
        section: 'LLC谐振',
        title: '第8章 · LLC 谐振变换器变压器设计',
        icon: '🎯',
        content: `
            <h2>第8章 · LLC 谐振变换器变压器设计</h2>
            
            <h3>8.1 LLC 谐振变换器原理</h3>
            <p>LLC 谐振变换器利用谐振电感 L<sub>r</sub>、谐振电容 C<sub>r</sub> 和励磁电感 L<sub>m</sub> 构成谐振网络，实现开关管的零电压导通（ZVS）和整流管的零电流关断（ZCS）。</p>
            <ul>
                <li><strong>优点</strong>：可全负载范围实现 ZVS，效率高，EMI 低。</li>
                <li><strong>优点</strong>：输出不需要滤波电感，变压器可集成谐振电感。</li>
                <li><strong>缺点</strong>：拓扑复杂，频率调制控制，设计难度大。</li>
                <li><strong>功率范围</strong>：200W~2000W</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">谐振频率计算</span>
                f<sub>r</sub> = 1 / (2π · √(L<sub>r</sub> · C<sub>r</sub>))<br>
                f<sub>m</sub> = 1 / (2π · √((L<sub>r</sub> + L<sub>m</sub>) · C<sub>r</sub>))
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">f<sub>r</sub> = 串联谐振频率，f<sub>m</sub> = 并联谐振频率</span>
            </div>

            <h3>8.2 LLC 变压器设计要点</h3>
            <ul>
                <li><strong>励磁电感 L<sub>m</sub></strong>：由变压器磁化电感提供，通常 L<sub>m</sub> = 3~10 × L<sub>r</sub></li>
                <li><strong>谐振电感 L<sub>r</sub></strong>：可利用变压器漏感实现（集成式），或独立电感（外置式）</li>
                <li><strong>电感比 k</strong>：k = L<sub>m</sub>/L<sub>r</sub>，典型值 3~10</li>
                <li><strong>品质因数 Q</strong>：Q = √(L<sub>r</sub>/C<sub>r</sub>)/R<sub>ac</sub>，影响增益曲线</li>
            </ul>

            <div class="hb-keypoint">
                <strong>⚡ LLC 设计关键：</strong><br>
                1. 变压器励磁电感 L<sub>m</sub> 参与谐振，需要通过调整气隙精确控制。<br>
                2. 谐振电感 L<sub>r</sub> 通常为变压器漏感（约 1~5% 的 L<sub>m</sub>），不足时需外加电感。<br>
                3. LLC 变压器的工作频率范围通常在 0.8·f<sub>r</sub> ~ 2·f<sub>r</sub> 之间。<br>
                4. 增益曲线设计需确保在最低输入电压下仍能输出额定电压。
            </div>

            <div class="hb-formula">
                <span class="formula-label">LLC 匝数比计算</span>
                n = N<sub>p</sub>/N<sub>s</sub> = (V<sub>in(nom)</sub>/2) / (V<sub>o</sub> + V<sub>f</sub>)
            </div>

            <div class="hb-formula">
                <span class="formula-label">最大增益与最小增益</span>
                G<sub>max</sub> = (2n · V<sub>o</sub>) / V<sub>in(min)</sub><br>
                G<sub>min</sub> = (2n · V<sub>o</sub>) / V<sub>in(max)</sub>
            </div>
        `
    },
    {
        id: 'ch9',
        section: '移相全桥',
        title: '第9章 · 移相全桥变换器变压器设计',
        icon: '📐',
        content: `
            <h2>第9章 · 移相全桥变换器变压器设计</h2>
            
            <h3>9.1 移相全桥变换器原理</h3>
            <p>移相全桥（Phase-Shifted Full-Bridge, PSFB）又称 ZVS 全桥，通过调节桥臂开关管的移相角来控制输出功率，实现主开关管的零电压导通（ZVS）。</p>
            <ul>
                <li><strong>功率范围</strong>：500W~3000W</li>
                <li><strong>优点</strong>：主开关管可实现 ZVS，效率高，输出功率大。</li>
                <li><strong>优点</strong>：变压器利用率高，适合大功率紧凑型设计。</li>
                <li><strong>缺点</strong>：占空比丢失问题，滞后桥臂 ZVS 较难实现。</li>
            </ul>

            <h3>9.2 移相全桥关键设计考虑</h3>
            <ul>
                <li><strong>占空比丢失</strong>：由于谐振电感的存在，副边占空比小于原边占空比，设计中需预留裕量。</li>
                <li><strong>滞后桥臂 ZVS</strong>：需足够的谐振电感和死区时间来实现滞后桥臂的 ZVS。</li>
                <li><strong>变压器漏感</strong>：作为谐振电感的一部分参与 ZVS 过程。</li>
                <li><strong>输出滤波</strong>：需要输出滤波电感和电容，输出电流纹波与全桥相同。</li>
            </ul>

            <div class="hb-formula">
                <span class="formula-label">有效占空比</span>
                D<sub>eff</sub> = D - ΔD
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">ΔD = 占空比丢失，与漏感和负载电流有关</span>
            </div>

            <div class="hb-formula">
                <span class="formula-label">匝数比计算</span>
                n = V<sub>in</sub> · D<sub>eff(max)</sub> / (V<sub>o</sub> + V<sub>f</sub>)
            </div>
        `
    },
    {
        id: 'ch10',
        section: '电感器设计',
        title: '第10章 · 电感器设计',
        icon: '🔋',
        content: `
            <h2>第10章 · 电感器设计</h2>
            
            <h3>10.1 电感器基本原理</h3>
            <p>电感器是储能元件，通过磁场储存能量。电感量 L 定义为每单位电流产生的磁链：</p>

            <div class="hb-formula">
                <span class="formula-label">电感量基本公式</span>
                L = N · dΦ/dI = N² · μ · A<sub>e</sub> / l<sub>e</sub>
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">L = N² / ℛ，其中 ℛ = l<sub>e</sub>/(μ · A<sub>e</sub>) 为总磁阻</span>
            </div>

            <h3>10.2 电感分类与设计方法</h3>
            <ul>
                <li><strong>储能电感</strong>：开关电源输出滤波电感、PFC 升压电感、Buck/Buck-Boost 电感等。需要开气隙储能。</li>
                <li><strong>线性电感</strong>：滤波器、EMI 滤波器等。通常工作在小信号下，无 DC 偏磁。</li>
                <li><strong>饱和电感</strong>：利用磁芯饱和特性实现特定功能。</li>
            </ul>

            <h3>10.3 储能电感设计公式</h3>
            
            <div class="hb-formula">
                <span class="formula-label">储能公式（电感储存的能量）</span>
                W = ½ · L · I²
            </div>

            <div class="hb-formula">
                <span class="formula-label">气隙电感器设计</span>
                L = μ<sub>0</sub> · N² · A<sub>e</sub> / g
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">当气隙 g 远大于磁路长度 l<sub>e</sub> 时，电感量主要由气隙决定</span>
            </div>

            <div class="hb-formula">
                <span class="formula-label">面积乘积法 - 电感器</span>
                A<sub>p</sub> = (L · I²<sub>pk</sub> · 10⁴) / (B<sub>m</sub> · K<sub>u</sub> · J)
            </div>

            <h3>10.4 PFC 电感设计实例</h3>
            <p>设计要求：L = 400μH, I<sub>DC</sub> = 5A, I<sub>AC</sub> = 2A, f = 100kHz</p>
            <ul>
                <li><strong>磁芯选择</strong>：Kool Mu 77908 (A<sub>e</sub> = 0.47cm², μ = 60)</li>
                <li><strong>匝数计算</strong>：N = √(L · l<sub>e</sub> / (μ<sub>0</sub> · μ<sub>e</sub> · A<sub>e</sub>)) = 42 匝</li>
                <li><strong>线径选择</strong>：I<sub>rms</sub> = 5.4A, J = 4A/mm², 所需截面积 = 1.35mm², AWG16 (1.31mm²)</li>
                <li><strong>DC 偏磁校验</strong>：H = N·I/l<sub>e</sub>，计算磁导率下降率</li>
            </ul>
        `
    },
    {
        id: 'ch11',
        section: 'EMI滤波器',
        title: '第11章 · EMI 滤波器设计',
        icon: '🛡️',
        content: `
            <h2>第11章 · EMI 滤波器设计</h2>
            
            <h3>11.1 电磁干扰（EMI）基础</h3>
            <p>EMI 分为传导发射（CE，150kHz~30MHz）和辐射发射（RE，30MHz~1GHz）。传导发射又分为差模（DM）和共模（CM）两种。</p>
            <ul>
                <li><strong>差模噪声 (DM)</strong>：在电源线之间产生的噪声电流，方向与电源电流相同。</li>
                <li><strong>共模噪声 (CM)</strong>：在电源线与地之间产生的噪声电流，方向相同。</li>
            </ul>

            <h3>11.2 共模电感设计</h3>
            <p>共模电感使用高磁导率磁芯（通常 μᵢ > 5000），两个绕组绕在同一个磁芯上。共模电流产生的磁通在磁芯中叠加，电感量很大；差模电流产生的磁通相互抵消，不影响正常工作。</p>

            <div class="hb-formula">
                <span class="formula-label">共模电感量计算</span>
                L<sub>CM</sub> = μ<sub>0</sub> · μ<sub>i</sub> · N² · A<sub>e</sub> / l<sub>e</sub>
            </div>

            <h3>11.3 差模电感设计</h3>
            <p>差模电感通常使用金属磁粉芯（铁粉芯或铁硅铝），需要一定的储能能力以承受差模电流。</p>

            <h3>11.4 EMI 滤波器设计步骤</h3>
            <div class="hb-steps">
                <div class="hb-step">
                    <div class="hb-step-num">1</div>
                    <div class="hb-step-content">
                        <strong>测量/估算噪声频谱</strong>
                        <span>确定各频段的噪声幅度</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">2</div>
                    <div class="hb-step-content">
                        <strong>确定衰减量</strong>
                        <span>根据 EMI 标准（如 EN55022）计算所需衰减</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">3</div>
                    <div class="hb-step-content">
                        <strong>选择滤波器拓扑</strong>
                        <span>LC、CLC、LCL 等，通常使用二阶或三阶滤波器</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">4</div>
                    <div class="hb-step-content">
                        <strong>设计共模电感</strong>
                        <span>选择高 μ 磁芯，计算匝数和线径</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">5</div>
                    <div class="hb-step-content">
                        <strong>设计差模电感</strong>
                        <span>选择金属粉芯，考虑 DC 偏磁</span>
                    </div>
                </div>
                <div class="hb-step">
                    <div class="hb-step-num">6</div>
                    <div class="hb-step-content">
                        <strong>选择安全电容</strong>
                        <span>X 电容（差模）和 Y 电容（共模）</span>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'ch12',
        section: '高频效应',
        title: '第12章 · 高频效应与损耗分析',
        icon: '📈',
        content: `
            <h2>第12章 · 高频效应与损耗分析</h2>
            
            <h3>12.1 集肤效应</h3>
            <p>集肤效应（Skin Effect）使高频电流集中在导体表面流动，有效导电面积减小，AC 电阻增大。</p>

            <div class="hb-formula">
                <span class="formula-label">集肤深度（铜导线）</span>
                δ = 66.2 / √f    [f 单位为 Hz, δ 单位为 mm]
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">在 100kHz 时 δ ≈ 0.21mm，500kHz 时 δ ≈ 0.093mm</span>
            </div>

            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>频率</th><th>集肤深度 (mm)</th><th>建议最大线径 (mm)</th><th>建议 AWG</th></tr></thead>
                    <tbody>
                        <tr><td>50/60Hz</td><td>~8.5</td><td><17.0</td><td>可任意选择</td></tr>
                        <tr><td>1kHz</td><td>2.09</td><td><4.18</td><td>>AWG8</td></tr>
                        <tr><td>10kHz</td><td>0.662</td><td><1.32</td><td>>AWG16</td></tr>
                        <tr><td>100kHz</td><td>0.209</td><td><0.42</td><td>>AWG26</td></tr>
                        <tr><td>500kHz</td><td>0.093</td><td><0.19</td><td>>AWG32</td></tr>
                        <tr><td>1MHz</td><td>0.066</td><td><0.13</td><td>>AWG36</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表12-1 不同频率下铜导线的集肤深度和推荐最大线径</figcaption>
            </div>

            <h3>12.2 邻近效应</h3>
            <p>邻近效应（Proximity Effect）是相邻载流导线产生的磁场在邻近导线中感应出涡流，使电流分布不均匀，进一步增加 AC 电阻。邻近效应在多层绕组中尤其显著。</p>

            <div class="hb-tip">
                <span class="tip-icon">💡</span>
                <div><strong>降低高频损耗的方法：</strong><br>
                1. 使用利兹线（Litz Wire）：多股细线绞合，每根细线直径小于 2 倍集肤深度。<br>
                2. 交错绕法（Interleaving）：原副边交替排列，降低多层绕组的邻近效应。<br>
                3. 铜箔绕组（Foil Winding）：大电流时，铜箔厚度应小于集肤深度。<br>
                4. 降低绕组层数：单层绕组的 AC 电阻最小。</div>
            </div>

            <h3>12.3 Dowell 公式</h3>
            <p>Dowell 公式是计算多层绕组 AC 电阻系数的经典方法：</p>

            <div class="hb-formula">
                <span class="formula-label">AC 电阻系数</span>
                F<sub>r</sub> = R<sub>ac</sub>/R<sub>dc</sub> = Δ × [k<sub>1</sub>(Δ) + 2/3 · (m² - 1) · k<sub>2</sub>(Δ)]
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">Δ = d/δ（归一化厚度），m = 绕组层数</span>
            </div>

            <h3>12.4 磁芯损耗与频率</h3>
            <p>磁芯损耗随频率增加的规律：</p>
            <ul>
                <li><strong>磁滞损耗</strong>：P<sub>h</sub> ∝ f · B<sup>n</sup>（n ≈ 1.6~2.0）</li>
                <li><strong>涡流损耗</strong>：P<sub>e</sub> ∝ f² · B²</li>
                <li><strong>剩余损耗</strong>：在 MHz 以上频率占主导</li>
            </ul>
            <p>总的趋势是：频率每增加 10 倍，磁芯损耗约增加 2~3 倍（取决于材料和工作 B 值）。</p>
        `
    },
    {
        id: 'ch13',
        section: '热管理',
        title: '第13章 · 热管理与温升计算',
        icon: '🌡️',
        content: `
            <h2>第13章 · 热管理与温升计算</h2>
            
            <h3>13.1 热传递基本方式</h3>
            <ul>
                <li><strong>热传导</strong>：通过固体材料传递热量，由傅立叶定律描述。q = -k · dT/dx</li>
                <li><strong>热对流</strong>：通过流体（空气或冷却液）传递热量。自然对流 ≈ 5~10 W/m²·°C，强制风冷 ≈ 10~30 W/m²·°C</li>
                <li><strong>热辐射</strong>：通过电磁波辐射传递热量。遵循斯蒂芬-玻尔兹曼定律。</li>
            </ul>

            <h3>13.2 变压器温升计算</h3>
            <p>变压器的总损耗 P<sub>total</sub> = P<sub>fe</sub>（铁损）+ P<sub>cu</sub>（铜损）。温升由总损耗和表面积决定：</p>

            <div class="hb-formula">
                <span class="formula-label">表面温升估算</span>
                ΔT = (P<sub>total</sub> / A<sub>s</sub>)<sup>0.833</sup>  × R<sub>th</sub>
                <span style="display:block;font-size:0.7rem;color:#5b6e8c;font-weight:400;margin-top:4px;">A<sub>s</sub> = 磁芯和绕组的总散热表面积，R<sub>th</sub> = 热阻</span>
            </div>

            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>散热条件</th><th>热阻 R<sub>th</sub> (°C/W)</th><th>允许损耗密度</th></tr></thead>
                    <tbody>
                        <tr><td>自然冷却，自由空气</td><td>20~40</td><td>~0.01 W/cm²</td></tr>
                        <tr><td>自然冷却，磁芯散热</td><td>10~25</td><td>~0.02 W/cm²</td></tr>
                        <tr><td>强制风冷 1m/s</td><td>5~15</td><td>~0.04 W/cm²</td></tr>
                        <tr><td>强制风冷 3m/s</td><td>3~10</td><td>~0.06 W/cm²</td></tr>
                        <tr><td>水冷/油冷</td><td>1~5</td><td>>0.1 W/cm²</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表13-1 磁芯不同散热条件下的热阻</figcaption>
            </div>

            <h3>13.3 绝缘等级与允许温升</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>绝缘等级</th><th>最大允许温度 (°C)</th><th>允许温升 (°C)</th><th>材料示例</th></tr></thead>
                    <tbody>
                        <tr><td>A 级</td><td>105</td><td>65</td><td>棉布、纸、丝绸</td></tr>
                        <tr><td>E 级</td><td>120</td><td>80</td><td>聚乙烯树脂</td></tr>
                        <tr><td>B 级</td><td>130</td><td>90</td><td>聚酯薄膜、玻璃纤维</td></tr>
                        <tr><td>F 级</td><td>155</td><td>115</td><td>聚酯亚胺、环氧树脂</td></tr>
                        <tr><td>H 级</td><td>180</td><td>140</td><td>聚酰亚胺、硅橡胶</td></tr>
                        <tr><td>C 级</td><td>>180</td><td>—</td><td>云母、陶瓷、PTFE</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表13-2 绝缘等级与允许温升（环境温度 40°C）</figcaption>
            </div>

            <div class="hb-keypoint">
                <strong>⚡ 热设计要点：</strong><br>
                1. 一般变压器温升限制为 40~50°C（B~F 级绝缘）。<br>
                2. 铜损和铁损应平衡，使总损耗最小且温升在允许范围内。<br>
                3. 磁芯温度最高处通常是中心柱，绕组温度最高处是内层。<br>
                4. 较大尺寸的磁芯散热面积相对较小，单位体积的功率密度受限。<br>
                5. 使用导热灌封胶可显著降低热阻，但可能增加成本和工艺难度。
            </div>
        `
    },
    {
        id: 'ch14',
        section: '测试验证',
        title: '第14章 · 变压器测试与验证',
        icon: '🔬',
        content: `
            <h2>第14章 · 变压器测试与验证</h2>
            
            <h3>14.1 变压器基本测试项目</h3>
            <ul>
                <li><strong>电感量 L</strong>：用 LCR 表测量各绕组的电感量，验证设计值。</li>
                <li><strong>漏感 L<sub>lk</sub></strong>：副边短路时测量原边电感，应小于主电感的 1~5%。</li>
                <li><strong>直流电阻 DCR</strong>：用欧姆表或微阻计测量各绕组电阻，计算铜损。</li>
                <li><strong>匝数比 N</strong>：用 LCR 表或电压激励法测量匝数比。</li>
                <li><strong>绝缘电阻</strong>：用绝缘电阻测试仪（摇表）测量绕组间、绕组与磁芯间的绝缘电阻（>100MΩ）。</li>
                <li><strong>耐压测试 Hi-Pot</strong>：按安规要求施加高压（如 3000V AC 1分钟），检查击穿电流。</li>
            </ul>

            <h3>14.2 磁芯特性测试</h3>
            <ul>
                <li><strong>B-H 回线测量</strong>：用工频或低频交流信号激励，用示波器观察 B-H 回线。</li>
                <li><strong>磁导率测量</strong>：通过电感量反推磁芯的有效磁导率。</li>
                <li><strong>磁芯损耗测量</strong>：利用功率分析仪测量磁芯的损耗曲线。</li>
            </ul>

            <h3>14.3 变压器参数测试方法</h3>
            
            <div class="hb-figure">
                <svg viewBox="0 0 500 200" style="width:100%; max-width:500px;">
                    <text x="250" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3c72">变压器参数测试原理</text>
                    <!-- LCR 表 -->
                    <rect x="20" y="50" width="60" height="40" rx="6" fill="#eef3fc" stroke="#3b82f6" stroke-width="1.5"/>
                    <text x="50" y="75" text-anchor="middle" font-size="9" font-weight="600" fill="#1e4a76">LCR表</text>
                    <line x1="80" y1="70" x2="130" y2="70" stroke="#333" stroke-width="1.5"/>
                    <!-- 变压器 -->
                    <rect x="130" y="45" width="80" height="50" rx="5" fill="white" stroke="#1e4a76" stroke-width="1.5"/>
                    <line x1="140" y1="60" x2="200" y2="60" stroke="#1e4a76" stroke-width="1.5"/>
                    <line x1="140" y1="80" x2="200" y2="80" stroke="#1e4a76" stroke-width="1.5"/>
                    <text x="170" y="75" text-anchor="middle" font-size="8" fill="#0c4a6e">T</text>
                    <text x="130" y="115" font-size="8" fill="#6b7a95">开路: 测电感、并联电容</text>
                    <text x="130" y="130" font-size="8" fill="#6b7a95">短路: 测漏感</text>
                    <!-- 示波器 -->
                    <rect x="250" y="50" width="70" height="40" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                    <text x="285" y="75" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">示波器</text>
                    <line x1="210" y1="70" x2="250" y2="70" stroke="#333" stroke-width="1.5"/>
                    <text x="285" y="115" text-anchor="middle" font-size="8" fill="#6b7a95">观察 B-H 回线</text>
                    <!-- 功率计 -->
                    <rect x="360" y="50" width="70" height="40" rx="6" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/>
                    <text x="395" y="75" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">功率分析</text>
                    <text x="395" y="115" text-anchor="middle" font-size="8" fill="#6b7a95">测量损耗</text>
                </svg>
                <figcaption>图14-1 变压器参数测试配置</figcaption>
            </div>

            <h3>14.4 温升测试</h3>
            <ul>
                <li><strong>热电偶法</strong>：将热电偶贴在磁芯和绕组的关键点，加载额定功率并监测温度变化。</li>
                <li><strong>电阻法</strong>：通过测量绕组电阻的变化推算绕组温升。ΔT = (R<sub>2</sub> - R<sub>1</sub>) / (R<sub>1</sub> · α)</li>
                <li><strong>红外热像仪</strong>：非接触式测量表面温度分布。</li>
            </ul>

            <div class="hb-keypoint">
                <strong>⚡ 测试规范建议：</strong><br>
                研发阶段应完成的测试清单：电感量、漏感、DCR、匝数比、绝缘电阻、耐压、效率曲线、温升曲线、B-H 特性、损耗曲线。
            </div>
        `
    },
    {
        id: 'ch15',
        section: '设计实例',
        title: '第15章 · 工程设计实例与经验数据',
        icon: '💼',
        content: `
            <h2>第15章 · 工程设计实例与经验数据</h2>
            
            <h3>15.1 变压器设计流程总结</h3>
            <ol>
                <li><strong>明确规格</strong>：输入电压范围、输出电压/电流、开关频率、效率目标、温升限制、安规要求。</li>
                <li><strong>选择拓扑</strong>：按功率等级和应用场景选择变换器拓扑（正激/反激/半桥/全桥/LLC 等）。</li>
                <li><strong>计算视在功率</strong>：P<sub>t</sub> = P<sub>o</sub> × (1/η + 1) 或拓扑对应的公式。</li>
                <li><strong>选择磁芯</strong>：用面积乘积法 A<sub>p</sub> 选择磁芯型号和材料。</li>
                <li><strong>匝数计算</strong>：基于法拉第定律计算原副边匝数。</li>
                <li><strong>气隙设计</strong>：若需要储能（反激、PFC 电感、输出滤波电感），计算气隙长度。</li>
                <li><strong>线径选择</strong>：根据电流密度 J 和集肤深度选择导线规格。</li>
                <li><strong>绕组结构</strong>：确定绕线方式（交错/非交错）、绕组顺序、绝缘层。</li>
                <li><strong>损耗核算</strong>：计算铜损和铁损，校核总损耗和温升。</li>
                <li><strong>参数验证</strong>：测试电感量、漏感、DCR、匝数比等关键参数。</li>
            </ol>

            <h3>15.2 常用设计参数参考</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>参数</th><th>典型值范围</th><th>说明</th></tr></thead>
                    <tbody>
                        <tr><td>磁通密度摆幅 ΔB（铁氧体）</td><td>0.15~0.25 T</td><td>功率变压器</td></tr>
                        <tr><td>磁通密度摆幅 ΔB（金属粉芯）</td><td>0.3~0.6 T</td><td>储能电感</td></tr>
                        <tr><td>电流密度 J</td><td>3~6 A/mm²</td><td>自然冷却取小值</td></tr>
                        <tr><td>窗口利用系数 K<sub>u</sub></td><td>0.2~0.45</td><td>复杂绕组取小值</td></tr>
                        <tr><td>绝缘等级</td><td>B~F 级</td><td>性价比最优</td></tr>
                        <tr><td>效率目标</td><td>85~95%</td><td>功率越大效率越高</td></tr>
                        <tr><td>漏感/主电感</td><td>1~5%</td><td>过高需优化绕组</td></tr>
                        <tr><td>温升限值</td><td>40~50°C</td><td>B~F 级绝缘</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表15-1 变压器设计参数经验值</figcaption>
            </div>

            <h3>15.3 不同拓扑功率范围</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>拓扑</th><th>功率范围</th><th>典型效率</th><th>频率范围</th><th>应用领域</th></tr></thead>
                    <tbody>
                        <tr><td>反激</td><td>5~150W</td><td>80~88%</td><td>30~150kHz</td><td>充电器、适配器、辅助电源</td></tr>
                        <tr><td>正激</td><td>50~500W</td><td>85~92%</td><td>50~200kHz</td><td>通信电源、工业电源</td></tr>
                        <tr><td>推挽</td><td>100~500W</td><td>85~90%</td><td>30~100kHz</td><td>低电压大电流 DC-DC</td></tr>
                        <tr><td>半桥</td><td>100~500W</td><td>87~93%</td><td>50~200kHz</td><td>中功率开关电源</td></tr>
                        <tr><td>全桥</td><td>500~2000W</td><td>90~95%</td><td>50~200kHz</td><td>大功率开关电源</td></tr>
                        <tr><td>LLC 半桥</td><td>200~2000W</td><td>92~97%</td><td>70~500kHz</td><td>高效率电源、TV 电源</td></tr>
                        <tr><td>移相全桥</td><td>500~3000W</td><td>90~96%</td><td>50~200kHz</td><td>大功率通信电源、充电桩</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表15-2 各拓扑功率范围与效率对比</figcaption>
            </div>

            <h3>15.4 磁芯 A<sub>p</sub> 值与功率对照</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>磁芯型号</th><th>A<sub>e</sub> (cm²)</th><th>A<sub>p</sub> (cm⁴)</th><th>反激功率 (W)</th><th>正激功率 (W)</th><th>全桥功率 (W)</th></tr></thead>
                    <tbody>
                        <tr><td>EE16</td><td>0.16</td><td>0.034</td><td>~5</td><td>~10</td><td>—</td></tr>
                        <tr><td>EE20</td><td>0.25</td><td>0.088</td><td>~10</td><td>~20</td><td>—</td></tr>
                        <tr><td>EE25</td><td>0.49</td><td>0.304</td><td>~20</td><td>~40</td><td>~60</td></tr>
                        <tr><td>EE30</td><td>0.92</td><td>1.168</td><td>~40</td><td>~80</td><td>~120</td></tr>
                        <tr><td>EE35</td><td>1.19</td><td>2.071</td><td>~60</td><td>~120</td><td>~200</td></tr>
                        <tr><td>EE40</td><td>1.54</td><td>3.634</td><td>~90</td><td>~180</td><td>~300</td></tr>
                        <tr><td>EE50</td><td>3.02</td><td>12.71</td><td>~200</td><td>~400</td><td>~700</td></tr>
                        <tr><td>PQ35/35</td><td>1.56</td><td>2.886</td><td>~80</td><td>~160</td><td>~280</td></tr>
                        <tr><td>PQ40/40</td><td>2.30</td><td>6.095</td><td>~140</td><td>~280</td><td>~500</td></tr>
                        <tr><td>ETD34</td><td>1.02</td><td>1.479</td><td>~50</td><td>~100</td><td>~170</td></tr>
                        <tr><td>ETD49</td><td>2.30</td><td>7.245</td><td>~160</td><td>~320</td><td>~550</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表15-3 常用磁芯功率容量参考（f = 100kHz，B<sub>m</sub> = 0.2T，J = 4A/mm²）</figcaption>
            </div>

            <h3>15.5 常见问题与解决方法</h3>
            <div class="hb-table-wrap">
                <table class="hb-table">
                    <thead><tr><th>问题</th><th>可能原因</th><th>解决方法</th></tr></thead>
                    <tbody>
                        <tr><td>变压器饱和</td><td>磁通密度过高、伏秒失衡</td><td>增加匝数、降低 B<sub>m</sub>、增大气隙、检查 DC 偏磁</td></tr>
                        <tr><td>温升过高</td><td>铜损或铁损过大</td><td>增大线径、选择更低损耗材料、增加散热、平衡铜铁损</td></tr>
                        <tr><td>漏感过大</td><td>绕组间距远、层间耦合差</td><td>交错绕法、减小绕组间距、使用环形磁芯</td></tr>
                        <tr><td>EMI 超标</td><td>漏感大、绕组耦合差</td><td>优化绕组结构、增加屏蔽层、改进 EMI 滤波器</td></tr>
                        <tr><td>噪声（啸叫）</td><td>磁芯磁致伸缩、绕组振动</td><td>降低 B<sub>m</sub>、浸渍处理、选择低噪声材料</td></tr>
                        <tr><td>效率低</td><td>铜损或铁损不平衡</td><td>增大线径、选择低损耗材料、优化频率</td></tr>
                    </tbody>
                </table>
                <figcaption style="font-size:0.72rem;color:#6b7a95;margin-top:6px;">表15-4 变压器设计常见问题排查</figcaption>
            </div>

            <div class="hb-keypoint">
                <strong>⚡ 设计经验总结：</strong><br>
                1. 铜损和铁损应尽可能相等，此时总损耗最小。<br>
                2. 选择磁芯尺寸时，功率容量应留 20~30% 裕量。<br>
                3. 高频 (>100kHz) 必须考虑集肤效应，选择合适线径或利兹线。<br>
                4. 反激变压器气隙设计精度重要，建议中心柱研磨。<br>
                5. 大功率 (>500W) 推荐使用全桥或 LLC 拓扑。<br>
                6. 良好的绕组结构可同时降低漏感、AC 电阻和 EMI。
            </div>
        `
    }
];

// ==================== 全局状态 ====================
let activeChapterId = 'ch1';

// ==================== DOM 引用 ====================
const hbSearch = document.getElementById('hbSearch');
const hbNavList = document.getElementById('hbNavList');
const hbArticle = document.getElementById('hbArticle');

// ==================== 1. 渲染导航 ====================
function renderNav() {
    const sections = {};
    HB_CHAPTERS.forEach(ch => {
        if (!sections[ch.section]) sections[ch.section] = [];
        sections[ch.section].push(ch);
    });

    let html = '';
    Object.keys(sections).forEach(sectionName => {
        html += `<div class="hb-nav-section">`;
        html += `<div class="hb-nav-section-title">📂 ${sectionName}</div>`;
        sections[sectionName].forEach(ch => {
            html += `
                <a class="hb-nav-item ${ch.id === activeChapterId ? 'active' : ''}" 
                   data-id="${ch.id}" onclick="loadChapter('${ch.id}')">
                    <span class="nav-icon">${ch.icon}</span>
                    ${ch.title}
                </a>
            `;
        });
        html += `</div>`;
    });
    hbNavList.innerHTML = html;
}

// ==================== 2. 加载章节 ====================
function loadChapter(chapterId) {
    const chapter = HB_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter) return;

    activeChapterId = chapterId;

    // 更新导航高亮
    document.querySelectorAll('.hb-nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === chapterId);
    });

    // 渲染内容
    hbArticle.innerHTML = chapter.content;

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 3. 搜索功能 ====================
function performSearch() {
    const query = hbSearch.value.trim().toLowerCase();
    if (!query) {
        renderNav();
        loadChapter(activeChapterId);
        return;
    }

    // 搜索所有章节内容
    const results = HB_CHAPTERS.filter(ch => {
        return ch.title.toLowerCase().includes(query) ||
               ch.content.toLowerCase().includes(query) ||
               ch.section.toLowerCase().includes(query);
    });

    // 显示搜索结果导航
    let html = `<div class="hb-nav-section">
        <div class="hb-nav-section-title">🔍 搜索结果 (${results.length})</div>`;
    
    results.forEach(ch => {
        html += `
            <a class="hb-nav-item ${ch.id === activeChapterId ? 'active' : ''}" 
               data-id="${ch.id}" onclick="loadChapter('${ch.id}')">
                <span class="nav-icon">${ch.icon}</span>
                ${ch.title}
            </a>
        `;
    });
    html += `</div>`;
    hbNavList.innerHTML = html;

    if (results.length > 0) {
        loadChapter(results[0].id);
    } else {
        hbArticle.innerHTML = `
            <div class="hb-article" style="text-align:center;padding:60px 20px;">
                <div style="font-size:3rem;margin-bottom:12px;">🔍</div>
                <h2 style="border:none;">未找到"${query}"相关内容</h2>
                <p style="color:#8a9bb5;">请尝试其他关键词</p>
            </div>
        `;
    }
}

// ==================== 4. 事件绑定 ====================
function init() {
    renderNav();
    loadChapter('ch1');

    // 搜索
    let searchTimer;
    hbSearch.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(performSearch, 300);
    });
}

// ==================== 5. 启动 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}