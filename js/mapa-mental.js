document.addEventListener('DOMContentLoaded', () => {
    
    const { Transformer } = window.markmap;
    const mindmapContainer = document.getElementById('mindmap-container');
    const markdownUpload = document.getElementById('markdown-upload');
    const initialMessage = document.getElementById('initial-message');
    const uploadToolbar = document.getElementById('upload-toolbar');
    
    const transformer = new Transformer();

    // A MESMA FUNÇÃO SANITIZADORA DO EDITOR
    const sanitizeMarkdown = (rawText) => {
        if (!rawText) return '';
        let sanitizedText = rawText.replace(/\t/g, '    ');
        const lines = sanitizedText.split('\n');
        const processedLines = [];
        for (const line of lines) {
            let processedLine = line.trimEnd();
            if (/^\s*[-*+]\s*$/.test(processedLine)) continue;
             if (/^\s+[-*+]/.test(processedLine)) {
                const indent = processedLine.match(/^\s+/)[0];
                const content = processedLine.trimStart();
                const indentLevel = Math.ceil(indent.length / 4);
                processedLine = '    '.repeat(indentLevel) + content;
            }
            processedLines.push(processedLine);
        }
        return processedLines.join('\n');
    };

    const renderMindmap = (markdownContent) => {
        initialMessage.style.display = 'none';
        mindmapContainer.innerHTML = '';
        
        try {
            const sanitizedText = sanitizeMarkdown(markdownContent);
            const { root } = transformer.transform(sanitizedText);
            window.markmap.Markmap.create(mindmapContainer, null, root);
        } catch (error) {
            console.error("Erro ao renderizar mapa mental:", error);
            initialMessage.textContent = 'Ocorreu um erro ao processar o arquivo. Verifique a formatação do Markdown.';
            initialMessage.style.display = 'block';
        }
    };

    // VERIFICA AS DUAS JORNADAS DO USUÁRIO
    const contentFromEditor = localStorage.getItem('markdownForMindmap');

    if (contentFromEditor) {
        // JORNADA 1: Veio do Editor
        localStorage.removeItem('markdownForMindmap'); // Limpa para não recarregar
        // A LINHA QUE ESCONDIA O BOTÃO FOI REMOVIDA DAQUI
        renderMindmap(contentFromEditor);
    }
    
    // A LÓGICA DE UPLOAD AGORA SEMPRE ESTARÁ ATIVA
    markdownUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => renderMindmap(e.target.result);
        reader.readAsText(file);
    });
});