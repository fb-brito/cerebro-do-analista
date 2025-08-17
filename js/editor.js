document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente sem alteração) ...
    marked.setOptions({
        breaks: true
    });

    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    // ... (restante das declarações de variáveis) ...

    // ***** INÍCIO DA CORREÇÃO DEFINITIVA *****

    // NOVA FUNÇÃO: Percorre a árvore de dados e remove nós vazios
    const pruneEmptyNodes = (node) => {
        if (!node || !node.children) {
            return; // Se não tem filhos, não há o que fazer aqui
        }

        // Primeiro, limpa os filhos dos filhos (recursão)
        node.children.forEach(pruneEmptyNodes);

        // Depois, filtra os filhos do nó atual
        node.children = node.children.filter(child => {
            // Mantém o nó se ele tiver conteúdo OU se ele tiver filhos que não foram removidos
            const hasContent = child.content && child.content.trim() !== '';
            const hasChildren = child.children && child.children.length > 0;
            return hasContent || hasChildren;
        });
    };

    // ***** FIM DA CORREÇÃO DEFINITIVA *****

    const processMarkdown = (text) => {
        updateBadgeUI('analyzing');
        setTimeout(() => {
            const sanitizedText = sanitizeMarkdown(text);
            if (markdownInput.value !== sanitizedText) {
                markdownInput.value = sanitizedText;
            }
            renderPreview(sanitizedText);
            updateLineNumbers();
            
            try {
                const { Transformer } = window.markmap;
                const transformer = new Transformer();
                const { root } = transformer.transform(sanitizedText);

                // ***** CHAMA A NOVA FUNÇÃO DE LIMPEZA AQUI *****
                pruneEmptyNodes(root);

                console.log("--- ESTRUTURA DE NÓS (CORRIGIDA) ---");
                console.log(JSON.stringify(root, null, 2));
            } catch (e) {
                console.error("Erro ao transformar para depuração:", e);
            }

            updateBadgeUI('success');
        }, 100);
    };

    // --- RESTANTE DO CÓDIGO (sem alterações) ---
    const lineNumbers = document.getElementById('line-numbers');
    // ... (todo o resto do código permanece idêntico) ...
    const generateMapBtn = document.getElementById('generate-map-btn');
    const documentTitleInput = document.getElementById('document-title');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const gfmBadge = document.getElementById('gfm-badge');
    const gfmBadgeText = document.getElementById('gfm-badge-text');
    const gfmBadgeSpinner = document.getElementById('gfm-badge-spinner');
    const statusMessage = document.getElementById('status-message');
    let debounceTimer;
    const updateLineNumbers = () => { if (!markdownInput || !lineNumbers) return; const lineCount = markdownInput.value.split('\n').length; lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => `<span>${i + 1}</span>`).join(''); };
    const renderPreview = (text) => { if (!htmlPreview) return; htmlPreview.innerHTML = marked.parse(text); };
    if(markdownInput && lineNumbers) { markdownInput.addEventListener('scroll', () => { lineNumbers.scrollTop = markdownInput.scrollTop; }); }
    const sanitizeMarkdown = (rawText) => { if (!rawText) return ''; let sanitizedText = rawText.trim(); sanitizedText = sanitizedText.replace(/\t/g, '    '); const lines = sanitizedText.split('\n'); const processedLines = []; for (const line of lines) { let processedLine = line.trimEnd(); if (/^\s*[-*+]\s*$/.test(processedLine)) continue; processedLines.push(processedLine); } return sanitizedText; };
    const updateBadgeUI = (state) => { if (!gfmBadge || !gfmBadgeText || !gfmBadgeSpinner || !statusMessage) return; gfmBadge.classList.remove('bg-gray-400', 'bg-green-500', 'bg-orange-400', 'text-white'); gfmBadgeSpinner.classList.add('hidden'); switch (state) { case 'analyzing': gfmBadge.classList.add('bg-gray-400', 'text-white'); gfmBadgeSpinner.classList.remove('hidden'); gfmBadge.title = 'Analisando...'; statusMessage.textContent = 'Analisando e adequando ao padrão GFM...'; break; case 'success': gfmBadge.classList.add('bg-green-500', 'text-white'); gfmBadge.title = 'Selo de Qualidade GFM Conquistado!'; statusMessage.textContent = 'Validação concluída com sucesso!'; break; case 'modified': gfmBadge.classList.add('bg-orange-400', 'text-white'); gfmBadge.title = 'Conteúdo modificado. Revalidando...'; statusMessage.textContent = 'Revalidando...'; break; case 'neutral': default: gfmBadge.classList.add('bg-gray-400', 'text-white'); gfmBadge.title = 'Aguardando conteúdo para análise GFM.'; statusMessage.textContent = 'Cole seu texto ou carregue um arquivo para obter o selo de qualidade GFM.'; break; } };
    if (exportMdBtn) { exportMdBtn.addEventListener('click', () => { const content = markdownInput.value; let filename = (documentTitleInput.value.trim() || 'documento') + '.md'; const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }); }
    if (exportPdfBtn) { exportPdfBtn.addEventListener('click', () => { let filename = (documentTitleInput.value.trim() || 'documento') + '.pdf'; const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }); pdf.html(htmlPreview, { callback: function (pdf) { pdf.save(filename); }, margin: [15, 15, 15, 15], autoPaging: 'text', width: 180, windowWidth: htmlPreview.scrollWidth, }); }); }
    if (markdownInput) { markdownInput.addEventListener('input', () => { renderPreview(markdownInput.value); updateLineNumbers(); updateBadgeUI('modified'); clearTimeout(debounceTimer); debounceTimer = setTimeout(() => { processMarkdown(markdownInput.value); }, 800); }); markdownInput.addEventListener('paste', (event) => { event.preventDefault(); const pastedText = (event.clipboardData || window.clipboardData).getData('text'); processMarkdown(pastedText); }); }
    if (generateMapBtn) { generateMapBtn.addEventListener('click', () => { const sanitizedContent = markdownInput.value; if (sanitizedContent.trim()) { localStorage.setItem('markdownForMindmap', sanitizedContent); window.open('mapa-mental.html', '_blank'); } else { alert('Insira um conteúdo Markdown antes de gerar o mapa mental.'); } }); }
    updateBadgeUI('neutral');
    updateLineNumbers();
    renderPreview('');
});