document.addEventListener('DOMContentLoaded', () => {
    const { Transformer, Markmap } = window.markmap;
    const mindmapContainer = document.getElementById('mindmap-container');
    const markdownUpload = document.getElementById('markdown-upload');
    const initialMessage = document.getElementById('initial-message');
    const uploadToolbar = document.getElementById('upload-toolbar');
    
    const transformer = new Transformer();

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
        return sanitizedText;
    };

    const renderMindmap = (markdownContent) => {
        if(initialMessage) initialMessage.style.display = 'none';
        if(mindmapContainer) mindmapContainer.innerHTML = '';
        
        try {
            const sanitizedText = sanitizeMarkdown(markdownContent);
            const { root } = transformer.transform(sanitizedText);
            
            postProcessTree(root);
            Markmap.create(mindmapContainer, null, root);

        } catch (error) {
            console.error("Erro ao renderizar mapa mental:", error);
            if(initialMessage) {
                initialMessage.textContent = 'Ocorreu um erro ao processar o arquivo. Verifique a formatação do Markdown.';
                initialMessage.style.display = 'block';
            }
        }
    };

    const contentFromEditor = localStorage.getItem('markdownForMindmap');
    if (contentFromEditor) {
        localStorage.removeItem('markdownForMindmap');
        if(uploadToolbar) uploadToolbar.style.display = 'flex';
        renderMindmap(contentFromEditor);
    }
    
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