document.addEventListener('DOMContentLoaded', () => {
    // --- TEXTO PADRÃO DO GUIA RÁPIDO ---
    const defaultMarkdownText = `# Guia: Como Criar seu Mapa Mental

- ## O Título Principal (Nó Raiz)
    - O texto que começa com \`#\` se torna o nó central do seu mapa mental.
    - Você só deve ter um \`#\` por mapa para manter a clareza.

- ## Ramificações Principais (Filhos)
    - Cada item que começa com um traço \`-\` (seguido de um espaço) cria uma ramificação principal, conectada ao título.
    - Estes são os tópicos principais que saem do centro.

- ## Sub-ramificações (Netos e Bisnetos)
    - Para criar um nível mais profundo (um "neto"), adicione uma indentação.
    - A regra de ouro é usar **4 espaços** antes do traço \`-\`.
        - Este é um exemplo de "neto". Repare nos 4 espaços antes do \`-\`.
            - E este é um "bisneto", com **8 espaços** (4+4) antes do \`-\`.
                - Você pode continuar criando níveis ainda mais profundos.

- ## Dicas de Formatação
    - Você pode usar **negrito** para destacar um texto, envolvendo-o com \`**dois asteriscos**\`.
    - E também pode usar *itálico* com \`*um asterisco*\`.

- ## Agora é a sua vez!
    - Apague este guia e cole seu próprio texto.
    - Ou simplesmente edite este para começar a criar o seu mapa.
    - Quando terminar, clique em **"Gerar Mapa Mental"** para ver a mágica acontecer!`;

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

    const updateLineNumbers = () => { if (!markdownInput || !lineNumbers) return; const lineCount = markdownInput.value.split('\n').length; lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => `<span>${i + 1}</span>`).join(''); };
    const renderPreview = (text) => { if (!htmlPreview) return; htmlPreview.innerHTML = marked.parse(text); };
    if(markdownInput && lineNumbers) { markdownInput.addEventListener('scroll', () => { lineNumbers.scrollTop = markdownInput.scrollTop; }); }
    const sanitizeMarkdown = (rawText) => { if (!rawText) return ''; let sanitizedText = rawText.trim(); sanitizedText = sanitizedText.replace(/\t/g, '    '); const lines = sanitizedText.split('\n'); const processedLines = []; for (const line of lines) { let processedLine = line.trimEnd(); if (/^\s*[-*+]\s*$/.test(processedLine)) continue; processedLines.push(processedLine); } return sanitizedText; };
    const updateBadgeUI = (state) => { if (!gfmBadge || !gfmBadgeText || !gfmBadgeSpinner || !statusMessage) return; gfmBadge.classList.remove('bg-gray-400', 'bg-green-500', 'bg-orange-400', 'text-white'); gfmBadgeSpinner.classList.add('hidden'); switch (state) { case 'analyzing': gfmBadge.classList.add('bg-gray-400', 'text-white'); gfmBadgeSpinner.classList.remove('hidden'); gfmBadge.title = 'Analisando...'; statusMessage.textContent = 'Analisando e adequando ao padrão GFM...'; break; case 'success': gfmBadge.classList.add('bg-green-500', 'text-white'); gfmBadge.title = 'Selo de Qualidade GFM Conquistado!'; statusMessage.textContent = 'Validação concluída com sucesso!'; break; case 'modified': gfmBadge.classList.add('bg-orange-400', 'text-white'); gfmBadge.title = 'Conteúdo modificado. Revalidando...'; statusMessage.textContent = 'Revalidando...'; break; case 'neutral': default: gfmBadge.classList.add('bg-gray-400', 'text-white'); gfmBadge.title = 'Aguardando conteúdo para análise GFM.'; statusMessage.textContent = 'Cole seu texto ou carregue um arquivo para obter o selo de qualidade GFM.'; break; } };
    
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
                postProcessTree(root);
            } catch (e) {
                console.error("Erro ao transformar Markdown:", e);
            }
            updateBadgeUI('success');
        }, 100);
    };

    const postProcessTree = (node) => {
        if (!node || !node.children) return;
        node.children.forEach(postProcessTree);
        const newChildren = [];
        node.children.forEach(child => {
            if (!child.content.trim() && child.children && child.children.length > 0) {
                newChildren.push(...child.children);
            } else {
                newChildren.push(child);
            }
        });
        node.children = newChildren;
        node.children = node.children.filter(child => {
            const hasContent = child.content && child.content.trim() !== '';
            const hasChildren = child.children && child.children.length > 0;
            return hasContent || hasChildren;
        });
    };

    // --- LÓGICA DOS BOTÕES DE EXPORTAÇÃO ---
    if (exportMdBtn) { exportMdBtn.addEventListener('click', () => { const content = markdownInput.value; let filename = (documentTitleInput.value.trim() || 'documento') + '.md'; const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }); }
    if (exportPdfBtn) { exportPdfBtn.addEventListener('click', () => { let filename = (documentTitleInput.value.trim() || 'documento') + '.pdf'; const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }); pdf.html(htmlPreview, { callback: function (pdf) { pdf.save(filename); }, margin: [15, 15, 15, 15], autoPaging: 'text', width: 180, windowWidth: htmlPreview.scrollWidth, }); }); }

    // --- EVENT LISTENERS (OUVINTES DE AÇÕES DO USUÁRIO) ---
    if (markdownInput) {
        markdownInput.addEventListener('input', () => {
            renderPreview(markdownInput.value);
            updateLineNumbers();
            updateBadgeUI('modified');
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                processMarkdown(markdownInput.value);
            }, 800);
        });
        markdownInput.addEventListener('paste', (event) => {
            event.preventDefault();
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');
            processMarkdown(pastedText);
        });
    }

    if (generateMapBtn) { generateMapBtn.addEventListener('click', () => { const sanitizedContent = markdownInput.value; if (sanitizedContent.trim()) { localStorage.setItem('markdownForMindmap', sanitizedContent); window.open('mapa-mental.html', '_blank'); } else { alert('Insira um conteúdo Markdown antes de gerar o mapa mental.'); } }); }
    
    // --- INICIALIZAÇÃO DA PÁGINA COM GUIA RÁPIDO ---
    if (markdownInput) {
        markdownInput.value = defaultMarkdownText; // Preenche a textarea com o guia
        processMarkdown(defaultMarkdownText);    // Roda o processo completo para popular tudo
    }
});