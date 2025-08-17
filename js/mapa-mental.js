document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const { Transformer, Markmap } = window.markmap;
    const mindmapContainer = document.getElementById('mindmap-container');
    const markdownUpload = document.getElementById('markdown-upload');
    const initialMessage = document.getElementById('initial-message');
    const uploadToolbar = document.getElementById('upload-toolbar');
    
    const transformer = new Transformer();

    // --- FUNÇÕES CENTRAIS ---

    // 1. LIMPA A ÁRVORE DE DADOS DE NÓS VAZIOS
    const pruneEmptyNodes = (node) => {
        if (!node || !node.children) {
            return;
        }
        node.children.forEach(pruneEmptyNodes);
        node.children = node.children.filter(child => {
            const hasContent = child.content && child.content.trim() !== '';
            const hasChildren = child.children && child.children.length > 0;
            return hasContent || hasChildren;
        });
    };

    // 2. HIGIENIZA O TEXTO MARKDOWN
    const sanitizeMarkdown = (rawText) => {
        if (!rawText) return '';
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

    // 3. RENDERIZA O MAPA MENTAL NA TELA
    const renderMindmap = (markdownContent) => {
        if(initialMessage) initialMessage.style.display = 'none';
        if(mindmapContainer) mindmapContainer.innerHTML = '';
        
        try {
            const sanitizedText = sanitizeMarkdown(markdownContent);
            const { root } = transformer.transform(sanitizedText);
            
            pruneEmptyNodes(root); // Limpeza final da estrutura de dados

            Markmap.create(mindmapContainer, null, root);

        } catch (error) {
            console.error("Erro ao renderizar mapa mental:", error);
            if(initialMessage) {
                initialMessage.textContent = 'Ocorreu um erro ao processar o arquivo. Verifique a formatação do Markdown.';
                initialMessage.style.display = 'block';
            }
        }
    };

    // --- LÓGICA DE INICIALIZAÇÃO DA PÁGINA ---

    // VERIFICA SE A PÁGINA FOI ACESSADA A PARTIR DO EDITOR
    const contentFromEditor = localStorage.getItem('markdownForMindmap');

    if (contentFromEditor) {
        // JORNADA 1: Veio do Editor
        localStorage.removeItem('markdownForMindmap');
        if(uploadToolbar) uploadToolbar.style.display = 'flex';
        renderMindmap(contentFromEditor);
    }
    
    // JORNADA 2: Adiciona o "ouvinte" para o botão de upload
    if(markdownUpload) {
        markdownUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => renderMindmap(e.target.result);
            reader.readAsText(file);
        });
    }
});