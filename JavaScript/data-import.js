/**
 * 数据导入分析平台 - JavaScript 业务逻辑
 * 对应 index/数据导入.html
 * 
 * 功能:
 * 1. 多文件拖拽/选择上传（Excel + PDF + 图片 + CSV）
 * 2. Excel 解析（SheetJS/xlsx 库）
 * 3. PDF 文本/表格提取（PDF.js 库）
 * 4. 图片 OCR 解析（Tesseract.js 库）
 * 5. 数据拆分与多标签预览
 * 6. 数据导出（CSV 下载）
 */

// ==================== 全局状态 ====================
const state = {
    files: [],           // { id, file, name, size, type, status, data, sheets, pages, imageData }
    activeFileId: null,  // 当前预览的文件ID
    activeSheet: 0,      // 当前预览的Sheet索引
    activePage: 0,       // 当前预览的PDF/图片页面索引
    totalFiles: 0,
    parsedFiles: 0
};

let fileIdCounter = 0;

// ==================== DOM 引用 ====================
const dropzone = document.getElementById('diDropzone');
const fileInput = document.getElementById('diFileInput');
const fileListEl = document.getElementById('diFileList');
const toolbarEl = document.getElementById('diToolbar');
const fileCountEl = document.getElementById('diFileCount');
const clearAllBtn = document.getElementById('diClearAll');
const exportCsvBtn = document.getElementById('diExportCsv');
const parseAllBtn = document.getElementById('diParseAll');
const dataPreviewEl = document.getElementById('diDataPreview');
const progressBar = document.getElementById('diProgressBar');
const progressText = document.getElementById('diProgressText');
const progressContainer = document.getElementById('diProgressContainer');

// ==================== 工具函数 ====================
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return '📊';
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.csv')) return '📋';
    if (name.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/)) return '🖼️';
    return '📁';
}

function getFileType(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'excel';
    if (name.endsWith('.pdf')) return 'pdf';
    if (name.endsWith('.csv')) return 'csv';
    if (name.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/)) return 'image';
    return 'unknown';
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function wrapText(text, maxLen) {
    if (!text) return '';
    const words = text.split(' ');
    let result = '';
    let line = '';
    for (const word of words) {
        if ((line + word).length > maxLen) {
            result += line + '\n';
            line = word + ' ';
        } else {
            line += word + ' ';
        }
    }
    return result + line;
}

// ==================== 1. 文件添加 ====================
function addFiles(fileList) {
    const added = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const type = getFileType(file);
        if (type === 'unknown') continue;

        const fileId = ++fileIdCounter;
        state.files.push({
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: type,
            status: 'pending',
            data: null,
            sheets: [],
            pages: [],
            imageData: null
        });
        added.push(fileId);
    }

    if (added.length > 0) {
        state.activeFileId = added[0];
        state.activeSheet = 0;
        state.activePage = 0;
        renderFileList();
        renderToolbar();
        renderPreview();
        updateProgress();
    }
}

// ==================== 2. 文件解析 ====================
async function parseFile(fileObj) {
    fileObj.status = 'parsing';
    renderFileList();

    try {
        if (fileObj.type === 'excel') {
            await parseExcel(fileObj);
        } else if (fileObj.type === 'pdf') {
            await parsePdf(fileObj);
        } else if (fileObj.type === 'csv') {
            await parseCsv(fileObj);
        } else if (fileObj.type === 'image') {
            await parseImage(fileObj);
        }
        fileObj.status = 'done';
    } catch (err) {
        console.error('Parse error:', err);
        fileObj.status = 'error';
        fileObj.error = err.message || '解析失败';
    }

    renderFileList();
    renderPreview();
    updateProgress();
}

async function parseExcel(fileObj) {
    const arrayBuffer = await fileObj.file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    fileObj.sheets = [];
    fileObj.embeddedImages = []; // 存储嵌入图片 { sheetIndex, row, col, url, width, height }

    // --- 提取 xlsx 中的嵌入图片 ---
    try {
        if (typeof JSZip !== 'undefined' && (fileObj.file.name.endsWith('.xlsx') || fileObj.file.name.endsWith('.xlsm'))) {
            const zip = await JSZip.loadAsync(arrayBuffer);
            const mediaFolder = zip.folder('xl/media');
            const drawingsFolder = zip.folder('xl/drawings');

            if (mediaFolder) {
                // 收集所有媒体文件
                const mediaFiles = [];
                mediaFolder.forEach((path, entry) => {
                    mediaFiles.push({ path, entry });
                });

                // 解析 drawing XML 建立图片到单元格的映射
                const drawingRelationship = {};
                if (drawingsFolder) {
                    drawingsFolder.forEach((path, entry) => {
                        // drawing1.xml, drawing2.xml ...
                    });
                }

                // 尝试从 xl/worksheets/_rels/sheet{N}.xml.rels 读取 drawing 关系
                // 以及从 xl/drawings/drawing{N}.xml 获取图片位置
                for (let sIdx = 0; sIdx < workbook.SheetNames.length; sIdx++) {
                    const sheetName = workbook.SheetNames[sIdx];
                    // 读取 sheet 的 relationships
                    const relsPath = 'xl/worksheets/_rels/sheet' + (sIdx + 1) + '.xml.rels';
                    const relsEntry = zip.file(relsPath);
                    let drawingRId = null;
                    if (relsEntry) {
                        const relsText = await relsEntry.async('string');
                        const relsMatch = relsText.match(/<Relationship[^>]*Id="([^"]*)"[^>]*Type="[^"]*drawings[^"]*"[^>]*\/>/);
                        if (relsMatch) {
                            drawingRId = relsMatch[1];
                        }
                        // 另一种匹配方式
                        const relsMatch2 = relsText.match(/Target="\.\.\/drawings\/drawing(\d+)\.xml"/);
                        if (!drawingRId && relsMatch2) {
                            drawingRId = 'rId' + relsMatch2[1];
                        }
                    }

                    if (drawingRId) {
                        // 找到对应的 drawing XML
                        const drawingNum = drawingRId.replace('rId', '');
                        // 尝试多种可能的路径
                        let drawingXml = null;
                        const possiblePaths = [
                            'xl/drawings/drawing' + drawingNum + '.xml',
                            'xl/drawings/drawing' + (sIdx + 1) + '.xml'
                        ];
                        for (const dp of possiblePaths) {
                            const de = zip.file(dp);
                            if (de) {
                                drawingXml = await de.async('string');
                                break;
                            }
                        }

                        if (drawingXml) {
                            // 解析 drawing XML 提取图片位置和媒体引用
                            const anchorRegex = /<xdr:twoCellAnchor[^>]*>[\s\S]*?<\/xdr:twoCellAnchor>/g;
                            const anchors = drawingXml.match(anchorRegex) || [];
                            
                            for (const anchor of anchors) {
                                // 提取行列位置
                                const colFrom = extractXmlTag(anchor, 'xdr:col') || extractXmlTag(anchor, 'col');
                                const rowFrom = extractXmlTag(anchor, 'xdr:row') || extractXmlTag(anchor, 'row');
                                // 提取图片关系ID
                                const rEmbed = anchor.match(/r:embed="([^"]+)"/);
                                // 提取图片尺寸 (ext)
                                const extCx = anchor.match(/<xdr:ext[^>]*cx="([^"]+)"/);
                                const extCy = anchor.match(/<xdr:ext[^>]*cy="([^"]+)"/);
                                
                                if (rEmbed && colFrom !== null && rowFrom !== null) {
                                    // 从 relationships 中找到 rEmbed 对应的媒体文件
                                    const relsText2 = relsEntry ? await relsEntry.async('string') : '';
                                    const targetMatch = relsText2.match(new RegExp('Id="' + rEmbed[1] + '"[^>]*Target="([^"]+)"'));
                                    let mediaPath = null;
                                    if (targetMatch) {
                                        let t = targetMatch[1];
                                        // 处理相对路径
                                        if (t.startsWith('../')) {
                                            t = 'xl/' + t.substring(3);
                                        }
                                        mediaPath = t;
                                    }
                                    
                                    if (!mediaPath) {
                                        // 尝试直接从 mediaFiles 按顺序匹配
                                        const mediaIdx = anchors.indexOf(anchor);
                                        if (mediaFiles[mediaIdx]) {
                                            mediaPath = mediaFiles[mediaIdx].path;
                                        }
                                    }

                                    if (mediaPath) {
                                        const mediaEntry = zip.file(mediaPath);
                                        if (mediaEntry) {
                                            const blob = await mediaEntry.async('blob');
                                            const url = URL.createObjectURL(blob);
                                            
                                            // EMU 到像素转换（1 EMU = 1/914400 inch, 1 inch = 96px）
                                            const cxEmu = extCx ? parseFloat(extCx[1]) : 914400;
                                            const cyEmu = extCy ? parseFloat(extCy[1]) : 914400;
                                            const widthPx = Math.round(cxEmu / 914400 * 96);
                                            const heightPx = Math.round(cyEmu / 914400 * 96);

                                            fileObj.embeddedImages.push({
                                                sheetIndex: sIdx,
                                                row: parseInt(rowFrom),
                                                col: parseInt(colFrom),
                                                url: url,
                                                width: widthPx,
                                                height: heightPx
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // 如果上述映射失败，将所有未映射的图片附加到第一个Sheet末尾
                if (fileObj.embeddedImages.length === 0 && mediaFiles.length > 0) {
                    for (let mi = 0; mi < mediaFiles.length; mi++) {
                        const blob = await mediaFiles[mi].entry.async('blob');
                        const url = URL.createObjectURL(blob);
                        // 使用 Image 获取尺寸
                        fileObj.embeddedImages.push({
                            sheetIndex: 0,
                            row: -1,
                            col: -1,
                            url: url,
                            width: 200,
                            height: 150,
                            unanchored: true
                        });
                    }
                }
            }
        }
    } catch (imgErr) {
        console.warn('提取Excel嵌入图片时出错:', imgErr);
    }

    // --- 解析表格数据 ---
    workbook.SheetNames.forEach((sheetName, idx) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const headerRow = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
        const dataRows = jsonData.map(row => headerRow.map(h => row[h]));

        fileObj.sheets.push({
            name: sheetName,
            headers: headerRow,
            rows: dataRows,
            totalRows: dataRows.length,
            totalCols: headerRow.length
        });
    });

    fileObj.data = { type: 'excel', sheetCount: fileObj.sheets.length };
}

// 辅助函数：提取 XML 标签内容
function extractXmlTag(xml, tag) {
    const regex = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
    const match = xml.match(regex);
    if (match) return parseInt(match[1].trim());
    // 尝试自闭合标签
    const selfClose = xml.match(new RegExp('<' + tag + '[^>]*\\s([\\d.]+)\\s', 'i'));
    return null;
}

async function parsePdf(fileObj) {
    const arrayBuffer = await fileObj.file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    fileObj.pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // 提取文本
        const textItems = textContent.items.map(item => item.str);
        const fullText = textItems.join(' ');

        // 尝试检测表格结构（基于位置）
        const rows = detectTableFromText(textContent);

        fileObj.pages.push({
            pageNum: i,
            text: fullText,
            textItems: textContent.items,
            tableRows: rows
        });
    }

    fileObj.data = { type: 'pdf', pageCount: fileObj.pages.length };
}

function detectTableFromText(textContent) {
    const items = textContent.items;
    if (!items || items.length === 0) return [];

    const rows = {};
    const tolerance = 5;
    items.forEach(item => {
        let y = Math.round(item.transform[5]);
        let key = null;
        for (let r in rows) {
            if (Math.abs(parseFloat(r) - y) <= tolerance) {
                key = r;
                break;
            }
        }
        if (key === null) {
            rows[y] = [];
        }
        const actualKey = key || y;
        rows[actualKey].push({
            text: item.str,
            x: item.transform[4],
            width: item.width
        });
    });

    const sortedRows = Object.keys(rows)
        .map(k => ({ y: parseFloat(k), items: rows[k] }))
        .filter(r => r.items.length >= 2)
        .sort((a, b) => a.y - b.y);

    return sortedRows.map(row => {
        row.items.sort((a, b) => a.x - b.x);
        return row.items.map(item => item.text);
    });
}

async function parseCsv(fileObj) {
    const text = await fileObj.file.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    const dataRows = lines.map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    });

    const headers = dataRows.length > 0 ? dataRows[0] : [];
    const rows = dataRows.slice(1);

    fileObj.sheets = [{
        name: 'CSV数据',
        headers: headers,
        rows: rows,
        totalRows: rows.length,
        totalCols: headers.length
    }];
    fileObj.data = { type: 'csv' };
}

// ==================== 图片 OCR 解析 ====================
async function parseImage(fileObj) {
    // 生成图片预览 URL
    const imageUrl = URL.createObjectURL(fileObj.file);
    fileObj.imageData = {
        url: imageUrl,
        width: 0,
        height: 0,
        text: '',
        confidence: 0,
        blocks: []
    };

    // 读取图片尺寸
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
    });
    fileObj.imageData.width = img.naturalWidth;
    fileObj.imageData.height = img.naturalHeight;

    // 使用 Tesseract.js 进行 OCR 识别
    try {
        if (typeof Tesseract === 'undefined') {
            throw new Error('Tesseract.js 库未加载，请检查网络连接');
        }

        const result = await Tesseract.recognize(
            imageUrl,
            'chi_sim+eng',  // 中文简体 + 英文
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const pct = Math.round(m.progress * 100);
                        // 更新进度提示（可选）
                    }
                }
            }
        );

        fileObj.imageData.text = result.data.text;
        fileObj.imageData.confidence = result.data.confidence;
        fileObj.imageData.blocks = result.data.words || [];

        // 将识别文本分行，模拟成表格结构方便预览
        const lines = result.data.text.split('\n').filter(line => line.trim().length > 0);
        const headers = ['OCR 识别文本'];
        const rows = lines.map(line => [line]);

        fileObj.sheets = [{
            name: 'OCR结果',
            headers: headers,
            rows: rows,
            totalRows: rows.length,
            totalCols: 1,
            isOcr: true
        }];

    } catch (ocrErr) {
        console.warn('OCR识别失败:', ocrErr);
        // OCR 失败时仍然显示图片本身，不阻断
        fileObj.sheets = [{
            name: '图片预览',
            headers: ['提示'],
            rows: [['OCR 识别失败: ' + ocrErr.message + '。图片已加载，可查看原图。']],
            totalRows: 1,
            totalCols: 1,
            isOcr: false
        }];
    }

    fileObj.data = { type: 'image' };
}

// ==================== 3. 渲染函数 ====================
function renderFileList() {
    if (state.files.length === 0) {
        fileListEl.innerHTML = '';
        return;
    }

    fileListEl.innerHTML = state.files.map(f => {
        const statusClass = f.status;
        const statusText = { pending: '待解析', parsing: '解析中...', done: '已完成', error: '失败' }[f.status] || f.status;
        return `
            <div class="di-file-item" data-id="${f.id}">
                <span class="di-file-icon">${getFileIcon(f.file)}</span>
                <span class="di-file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</span>
                <span class="di-file-size">${formatFileSize(f.size)}</span>
                <span class="di-file-status ${statusClass}">${statusText}</span>
                <button class="di-file-remove" onclick="removeFile(${f.id})">✕</button>
            </div>
        `;
    }).join('');
}

function renderToolbar() {
    const count = state.files.length;
    fileCountEl.textContent = count + ' 个文件';
    clearAllBtn.disabled = count === 0;
    exportCsvBtn.disabled = count === 0;
    parseAllBtn.disabled = count === 0;
}

function renderPreview() {
    if (state.files.length === 0) {
        dataPreviewEl.innerHTML = `
            <div class="di-empty">
                <span class="di-empty-icon">📂</span>
                <div class="di-empty-text">暂无数据</div>
                <div class="di-empty-hint">请上传 Excel (.xlsx/.xls) / PDF / 图片 / CSV 文件</div>
            </div>
        `;
        return;
    }

    const activeFile = state.files.find(f => f.id === state.activeFileId);
    if (!activeFile || activeFile.status === 'pending') {
        dataPreviewEl.innerHTML = `
            <div class="di-empty">
                <span class="di-empty-icon">⏳</span>
                <div class="di-empty-text">暂未解析</div>
                <div class="di-empty-hint">点击"全部解析"或等待自动解析完成</div>
            </div>
        `;
        return;
    }

    if (activeFile.status === 'error') {
        dataPreviewEl.innerHTML = `
            <div class="di-empty">
                <span class="di-empty-icon">❌</span>
                <div class="di-empty-text">解析失败</div>
                <div class="di-empty-hint">${escapeHtml(activeFile.error || '未知错误')}</div>
            </div>
        `;
        return;
    }

    if (activeFile.type === 'excel' || activeFile.type === 'csv') {
        renderExcelPreview(activeFile);
    } else if (activeFile.type === 'pdf') {
        renderPdfPreview(activeFile);
    } else if (activeFile.type === 'image') {
        renderImagePreview(activeFile);
    }
}

function renderExcelPreview(fileObj) {
    const sheets = fileObj.sheets || [];
    if (sheets.length === 0) {
        dataPreviewEl.innerHTML = '<div class="di-empty"><span class="di-empty-icon">📭</span><div class="di-empty-text">无数据表</div></div>';
        return;
    }

    const activeSheetIdx = state.activeSheet;
    const sheet = sheets[activeSheetIdx] || sheets[0];
    if (!sheet) return;

    // 获取当前Sheet的嵌入图片
    const sheetImages = (fileObj.embeddedImages || []).filter(img => img.sheetIndex === activeSheetIdx);
    const unanchoredImages = sheetImages.filter(img => img.unanchored);
    const anchoredImages = sheetImages.filter(img => !img.unanchored);

    // 构建导航tab
    const imgBadge = sheetImages.length > 0 ? ` 🖼️${sheetImages.length}` : '';
    const tabsHtml = sheets.map((s, idx) => 
        `<button class="di-tab ${idx === activeSheetIdx ? 'active' : ''}" onclick="switchSheet(${idx})">${escapeHtml(s.name)} (${s.totalRows}行)${idx === activeSheetIdx ? imgBadge : ''}</button>`
    ).join('');

    // 构建表格，嵌入图片到对应单元格
    let tableHtml = '';
    if (sheet.headers.length > 0 && sheet.headers[0] !== '') {
        // 构建行数据，将图片嵌入到对应单元格
        const imageMap = {};
        anchoredImages.forEach(img => {
            // Excel行列是1-indexed，表格是0-indexed
            const rowKey = img.row - 1;  // 转换为0-indexed
            const colKey = img.col - 1;
            if (!imageMap[rowKey]) imageMap[rowKey] = {};
            imageMap[rowKey][colKey] = img;
        });

        tableHtml = '<table class="di-table"><thead><tr>' +
            sheet.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('') +
            '</tr></thead><tbody>' +
            sheet.rows.map((row, rowIdx) => 
                '<tr>' + row.map((cell, colIdx) => {
                    let cellContent = escapeHtml(cell);
                    // 检查该位置是否有嵌入图片
                    const img = imageMap[rowIdx] && imageMap[rowIdx][colIdx];
                    if (img) {
                        cellContent += `<div style="margin-top:4px;"><img src="${img.url}" alt="嵌入图片" style="max-width:120px; max-height:100px; border-radius:6px; border:1px solid #e2edf7; display:block;"></div>`;
                    }
                    return `<td>${cellContent}</td>`;
                }).join('') + '</tr>'
            ).join('') +
            '</tbody></table>';
    } else {
        tableHtml = '<div class="di-empty"><span class="di-empty-icon">📭</span><div class="di-empty-text">该Sheet无数据</div></div>';
    }

    // 未锚定的图片作为图库展示
    let galleryHtml = '';
    if (unanchoredImages.length > 0) {
        galleryHtml = `
            <div style="padding: 12px 16px; border-top: 1px solid #e2edf7;">
                <div style="font-size:0.85rem; font-weight:600; color:#0c4a6e; margin-bottom:10px;">
                    🖼️ 嵌入图片 (${unanchoredImages.length}张)
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">
                    ${unanchoredImages.map(img => `
                        <div style="background:#fafbfc; border:1px solid #e2edf7; border-radius:12px; padding:8px; text-align:center;">
                            <img src="${img.url}" style="max-width:150px; max-height:120px; border-radius:8px;">
                            <div style="font-size:0.6rem; color:#8a9bb5; margin-top:4px;">${img.width}×${img.height}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 如果表格数据为空但有未锚定图片，显示图库视图
    if (sheet.headers.length === 0 || sheet.headers[0] === '') {
        if (unanchoredImages.length > 0) {
            tableHtml = `<div style="padding:20px; text-align:center;">
                <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;">
                    ${unanchoredImages.map(img => `
                        <div style="background:#fafbfc; border:1px solid #e2edf7; border-radius:12px; padding:10px;">
                            <img src="${img.url}" style="max-width:200px; max-height:160px; border-radius:8px;">
                            <div style="font-size:0.7rem; color:#8a9bb5; margin-top:4px;">${img.width}×${img.height}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        } else {
            tableHtml = '<div class="di-empty"><span class="di-empty-icon">📭</span><div class="di-empty-text">该Sheet无数据</div></div>';
        }
    }

    dataPreviewEl.innerHTML = `
        <div class="di-data-section">
            <div class="di-data-header">
                <div class="di-data-title">
                    📊 ${escapeHtml(fileObj.name)}
                    <span class="di-data-badge">${escapeHtml(sheet.name)} · ${sheet.totalRows}行 × ${sheet.totalCols}列${imgBadge}</span>
                </div>
                <div class="di-data-nav">${tabsHtml}</div>
            </div>
            <div class="di-table-wrap">${tableHtml}${galleryHtml}</div>
        </div>
    `;
}

function renderPdfPreview(fileObj) {
    const pages = fileObj.pages || [];
    if (pages.length === 0) {
        dataPreviewEl.innerHTML = '<div class="di-empty"><span class="di-empty-icon">📭</span><div class="di-empty-text">无页面内容</div></div>';
        return;
    }

    const activePageIdx = state.activePage;
    const page = pages[activePageIdx] || pages[0];
    if (!page) return;

    // 构建页面导航
    const tabsHtml = pages.map((p, idx) =>
        `<button class="di-tab ${idx === activePageIdx ? 'active' : ''}" onclick="switchPage(${idx})">第${p.pageNum}页</button>`
    ).join('');

    // 优先显示检测到的表格
    let contentHtml = '';
    if (page.tableRows && page.tableRows.length > 4) {
        const maxCols = Math.max(...page.tableRows.map(r => r.length));
        contentHtml = '<table class="di-table"><tbody>' +
            page.tableRows.map(row => 
                '<tr>' + row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('') + '</tr>'
            ).join('') +
            '</tbody></table>';
    } else {
        contentHtml = `<div class="di-pdf-text">${escapeHtml(page.text)}</div>`;
    }

    dataPreviewEl.innerHTML = `
        <div class="di-data-section">
            <div class="di-data-header">
                <div class="di-data-title">
                    📄 ${escapeHtml(fileObj.name)}
                    <span class="di-data-badge">共 ${pages.length} 页</span>
                </div>
                <div class="di-data-nav">${tabsHtml}</div>
            </div>
            <div class="di-table-wrap">${contentHtml}</div>
        </div>
    `;
}

// ==================== 图片预览渲染 ====================
function renderImagePreview(fileObj) {
    const imgData = fileObj.imageData;
    if (!imgData || !imgData.url) {
        dataPreviewEl.innerHTML = '<div class="di-empty"><span class="di-empty-icon">🖼️</span><div class="di-empty-text">图片未加载</div></div>';
        return;
    }

    const sheets = fileObj.sheets || [];
    const activeSheetIdx = state.activeSheet;
    const activeOcrSheet = sheets[activeSheetIdx] || sheets[0];

    // 构建tab导航: 图片原图 + OCR结果Sheet
    const tabsHtml = sheets.map((s, idx) =>
        `<button class="di-tab ${idx === activeSheetIdx ? 'active' : ''}" onclick="switchSheet(${idx})">${escapeHtml(s.name)}</button>`
    ).join('');

    // 判断当前是显示原图还是OCR结果
    let contentHtml = '';
    const isShowingOcr = activeOcrSheet && activeOcrSheet.name === 'OCR结果' && activeOcrSheet.rows.length > 0;

    if (isShowingOcr) {
        // 显示 OCR 文本表
        contentHtml = `
            <div style="padding: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-size:0.9rem; font-weight:600;">
                        🧠 OCR 识别置信度: <span style="color:#6d28d9;">${imgData.confidence ? imgData.confidence.toFixed(1) : 'N/A'}%</span>
                    </span>
                    <span style="font-size:0.78rem; color:#6b7a95;">
                        图片尺寸: ${imgData.width} × ${imgData.height} px
                    </span>
                </div>
                <div class="di-pdf-text" style="max-height:450px; background:white; border:1px solid #e2edf7; border-radius:16px; padding:16px; font-size:0.85rem; line-height:1.8;">
                    ${escapeHtml(imgData.text)}
                </div>
            </div>
        `;
    } else {
        // 显示原图
        contentHtml = `
            <div style="padding: 16px; text-align: center;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-size:0.9rem; font-weight:600;">
                        🖼️ 图片预览
                    </span>
                    <span style="font-size:0.78rem; color:#6b7a95;">
                        ${imgData.width} × ${imgData.height} px
                    </span>
                </div>
                <div style="background:#fafbfc; border-radius:16px; padding:12px; border:1px solid #e2edf7; display:inline-block; max-width:100%;">
                    <img src="${imgData.url}" alt="图片预览" style="max-width:100%; max-height:500px; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
                </div>
            </div>
        `;
    }

    dataPreviewEl.innerHTML = `
        <div class="di-data-section">
            <div class="di-data-header">
                <div class="di-data-title">
                    🖼️ ${escapeHtml(fileObj.name)}
                    <span class="di-data-badge">${imgData.width}×${imgData.height}</span>
                </div>
                <div class="di-data-nav">${tabsHtml}</div>
            </div>
            ${contentHtml}
        </div>
    `;
}

function updateProgress() {
    const total = state.files.length;
    const done = state.files.filter(f => f.status === 'done' || f.status === 'error').length;
    const percent = total > 0 ? Math.round(done / total * 100) : 0;

    if (progressContainer) {
        progressContainer.style.display = total > 0 ? 'block' : 'none';
    }
    if (progressBar) progressBar.style.width = percent + '%';
    if (progressText) progressText.textContent = `解析进度: ${done}/${total} (${percent}%)`;
}

// ==================== 4. 操作函数 ====================
function removeFile(fileId) {
    const idx = state.files.findIndex(f => f.id === fileId);
    if (idx === -1) return;
    
    // 释放图片URL
    const file = state.files[idx];
    if (file.imageData && file.imageData.url) {
        URL.revokeObjectURL(file.imageData.url);
    }
    
    state.files.splice(idx, 1);
    
    if (state.activeFileId === fileId) {
        state.activeFileId = state.files.length > 0 ? state.files[0].id : null;
        state.activeSheet = 0;
        state.activePage = 0;
    }
    
    renderFileList();
    renderToolbar();
    renderPreview();
    updateProgress();
}

function clearAllFiles() {
    // 释放所有图片URL (包括嵌入式Excel图片)
    state.files.forEach(f => {
        if (f.imageData && f.imageData.url) {
            URL.revokeObjectURL(f.imageData.url);
        }
        if (f.embeddedImages) {
            f.embeddedImages.forEach(img => {
                if (img.url) URL.revokeObjectURL(img.url);
            });
        }
    });
    
    state.files = [];
    state.activeFileId = null;
    state.activeSheet = 0;
    state.activePage = 0;
    renderFileList();
    renderToolbar();
    renderPreview();
    updateProgress();
}

function switchSheet(idx) {
    state.activeSheet = idx;
    renderPreview();
}

function switchPage(idx) {
    state.activePage = idx;
    renderPreview();
}

async function parseAllFiles() {
    const pending = state.files.filter(f => f.status === 'pending');
    if (pending.length === 0) return;

    for (const file of pending) {
        await parseFile(file);
    }
    renderPreview();
}

function exportToCsv() {
    const activeFile = state.files.find(f => f.id === state.activeFileId);
    if (!activeFile) return;

    let csvContent = '';
    let filename = 'export.csv';

    if (activeFile.type === 'excel' || activeFile.type === 'csv') {
        const sheets = activeFile.sheets || [];
        const sheet = sheets[state.activeSheet] || sheets[0];
        if (!sheet) return;

        const headerLine = sheet.headers.map(h => `"${h}"`).join(',') + '\n';
        const dataLines = sheet.rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        csvContent = headerLine + dataLines;
        filename = activeFile.name.replace(/\.[^.]+$/, '') + '_' + sheet.name + '.csv';
    } else if (activeFile.type === 'pdf') {
        const pages = activeFile.pages || [];
        const page = pages[state.activePage] || pages[0];
        csvContent = page.text;
        filename = activeFile.name.replace(/\.[^.]+$/, '') + '_page' + (page.pageNum || 1) + '.csv';
    } else if (activeFile.type === 'image') {
        // 图片 OCR 结果导出
        if (activeFile.imageData && activeFile.imageData.text) {
            csvContent = activeFile.imageData.text;
            filename = activeFile.name.replace(/\.[^.]+$/, '') + '_ocr.txt';
        } else {
            const sheets = activeFile.sheets || [];
            const sheet = sheets[state.activeSheet] || sheets[0];
            if (sheet) {
                const dataLines = sheet.rows.map(row =>
                    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                ).join('\n');
                csvContent = dataLines;
                filename = activeFile.name.replace(/\.[^.]+$/, '') + '_' + sheet.name + '.csv';
            }
        }
    }

    if (!csvContent) return;

    // 下载
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// ==================== 5. 事件绑定 ====================
function initEventListeners() {
    // 拖拽上传
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dz-dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dz-dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dz-dragover');
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            addFiles(e.target.files);
        }
        fileInput.value = '';
    });

    // 工具栏按钮
    clearAllBtn.addEventListener('click', clearAllFiles);
    exportCsvBtn.addEventListener('click', exportToCsv);
    parseAllBtn.addEventListener('click', parseAllFiles);
}

// ==================== 6. 初始化 ====================
function init() {
    // 检查外部库是否加载
    if (typeof XLSX === 'undefined') {
        console.warn('SheetJS (xlsx) 库未加载，Excel解析将不可用');
    }
    if (typeof pdfjsLib === 'undefined') {
        console.warn('PDF.js 库未加载，PDF解析将不可用');
    }
    if (typeof Tesseract === 'undefined') {
        console.warn('Tesseract.js 库未加载，图片OCR解析将不可用');
    }

    initEventListeners();
    renderToolbar();
    renderPreview();
    updateProgress();
}

// DOM 就绪
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}