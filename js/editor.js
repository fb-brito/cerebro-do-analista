document.addEventListener('DOMContentLoaded', () => {
    // Configuração inicial da biblioteca Marked.js
    marked.setOptions({
        breaks: true
    });

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    const lineNumbers = document.getElementById('line-numbers');
    const generateMapBtn = document.getElementById('generate-map-btn');
    const documentTitleInput = document.getElementById('document-title');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const gfmBadge = document.getElementById('gfm-badge');
    const gfmBadgeText = document.getElementById('gfm-badge-text');
    const gfmBadgeSpinner = document.getElementById('gfm-badge-spinner');
    const statusMessage = document.getElementById('status-message');

    let debounceTimer;

    // --- FUNÇÕES CENTRAIS ---

    // 1. ATUALIZA A NUMERAÇÃO DE LINHAS
    const updateLineNumbers = () => {
        if (!markdownInput || !lineNumbers) return;
        const lineCount = markdownInput.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => `<span>${i + 1}</span>`).join('');
    };

    // 2. RENDERIZA O HTML NA ÁREA DE VISUALIZAÇÃO
    const renderPreview = (text) => {
        if (!htmlPreview) return;
        htmlPreview.innerHTML = marked.parse(text);
    };
    
    // 3. SANITIZA O CÓDIGO MARKDOWN
    const sanitizeMarkdown = (rawText) => {
        if (!rawText) return '';
        // CORREÇÃO: Remove linhas em branco no início e no fim do texto
        let sanitizedText = rawText.trim();
        sanitizedText = sanitizedText.replace(/\t/g, '    ');
        
        const lines = sanitizedText.split('\n');
        const processedLines = [];
        for (const line of lines) {
            let processedLine = line.trimEnd();
            if (/^\s*[-*+]\s*$/.test(processedLine)) continue;
            processedLines.push(processedLine);
        }
        return processedLines.join('\n');
    };

    // 4. ATUALIZA A INTERFACE DO BADGE GFM E MENSAGENS DE STATUS
    const updateBadgeUI = (state) => {
        if (!gfmBadge || !gfmBadgeText || !gfmBadgeSpinner || !statusMessage) return;
        gfmBadge.classList.remove('bg-gray-400', 'bg-green-500', 'bg-orange-400', 'text-white');
        gfmBadgeSpinner.classList.add('hidden');
        switch (state) {
            case 'analyzing':
                gfmBadge.classList.add('bg-gray-400', 'text-white');
                gfmBadgeSpinner.classList.remove('hidden');
                gfmBadge.title = 'Analisando...';
                statusMessage.textContent = 'Analisando e adequando ao padrão GFM...';
                break;
            case 'success':
                gfmBadge.classList.add('bg-green-500', 'text-white');
                gfmBadge.title = 'Selo de Qualidade GFM Conquistado! Este Markdown segue o padrão GitHub Flavored Markdown.';
                statusMessage.textContent = 'Validação concluída com sucesso!';
                break;
            case 'modified':
                gfmBadge.classList.add('bg-orange-400', 'text-white');
                gfmBadge.title = 'Conteúdo modificado. Revalidando...';
                statusMessage.textContent = 'Revalidando...';
                break;
            case 'neutral':
            default:
                gfmBadge.classList.add('bg-gray-400', 'text-white');
                gfmBadge.title = 'Aguardando conteúdo para análise GFM.';
                statusMessage.textContent = 'Cole seu texto ou carregue um arquivo para obter o selo de qualidade GFM.';
                break;
        }
    };
    
    // 5. PROCESSO PRINCIPAL: ORQUESTRA A SANITIZAÇÃO E ATUALIZAÇÃO DA UI
    const processMarkdown = (text) => {
        updateBadgeUI('analyzing');
        setTimeout(() => {
            const sanitizedText = sanitizeMarkdown(text);
            if (markdownInput.value !== sanitizedText) {
                markdownInput.value = sanitizedText;
            }
            renderPreview(sanitizedText);
            updateLineNumbers();
            updateBadgeUI('success');
        }, 100);
    };

    // --- LÓGICA DOS BOTÕES DE EXPORTAÇÃO ---
    if (exportMdBtn) {
        exportMdBtn.addEventListener('click', () => {
            const content = markdownInput.value;
            let filename = (documentTitleInput.value.trim() || 'documento') + '.md';
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            let filename = (documentTitleInput.value.trim() || 'documento') + '.pdf';
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

            pdf.html(htmlPreview, {
                callback: function (pdf) {
                    pdf.save(filename);
                },
                margin: [15, 15, 15, 15],
                autoPaging: 'text',
                width: 180,
                windowWidth: htmlPreview.scrollWidth,
            });
        });
    }

    // --- EVENT LISTENERS (OUVINTES DE AÇÕES DO USUÁRIO) ---
    if (markdownInput) {
        // Ao digitar no editor
        markdownInput.addEventListener('input', () => {
            renderPreview(markdownInput.value);
            updateLineNumbers();
            updateBadgeUI('modified');
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                processMarkdown(markdownInput.value);
            }, 800);
        });
        // Ao colar texto no editor
        markdownInput.addEventListener('paste', (event) => {
            event.preventDefault();
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');
            processMarkdown(pastedText);
        });
        // Sincroniza o scroll das linhas com o scroll do texto
        if(lineNumbers) {
            markdownInput.addEventListener('scroll', () => {
                lineNumbers.scrollTop = markdownInput.scrollTop;
            });
        }
    }

    // Ao clicar em Gerar Mapa Mental
    if (generateMapBtn) {
        generateMapBtn.addEventListener('click', () => {
            const sanitizedContent = markdownInput.value;
            if (sanitizedContent.trim()) {
                localStorage.setItem('markdownForMindmap', sanitizedContent);
                window.open('mapa-mental.html', '_blank');
            } else {
                alert('Insira um conteúdo Markdown antes de gerar o mapa mental.');
            }
        });
    }
    
    // --- INICIALIZAÇÃO DA PÁGINA ---
    updateBadgeUI('neutral');
    updateLineNumbers();
    renderPreview('');
});