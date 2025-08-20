document.addEventListener('DOMContentLoaded', () => {
    
    const { Transformer, Markmap } = window.markmap;
    const mindmapContainer = document.getElementById('mindmap-container');
    const markdownUpload = document.getElementById('markdown-upload');
    const initialMessage = document.getElementById('initial-message');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    const transformer = new Transformer();

    const postProcessTree = (node) => { if (!node || !node.children) return; node.children.forEach(postProcessTree); const newChildren = []; node.children.forEach(child => { if (!child.content.trim() && child.children && child.children.length > 0) { newChildren.push(...child.children); } else { newChildren.push(child); } }); node.children = newChildren; node.children = node.children.filter(child => { const hasContent = child.content && child.content.trim() !== ''; const hasChildren = child.children && child.children.length > 0; return hasContent || hasChildren; }); };
    const sanitizeMarkdown = (rawText) => { if (!rawText) return ''; let sanitizedText = rawText.trim(); sanitizedText = sanitizedText.replace(/\t/g, '    '); const lines = sanitizedText.split('\n'); const processedLines = []; for (const line of lines) { let processedLine = line.trimEnd(); if (/^\s*[-*+]\s*$/.test(processedLine)) continue; processedLines.push(processedLine); } return processedLines.join('\n'); };

    const renderMindmap = (markdownContent) => {
        if (!mindmapContainer || !initialMessage) return;
        initialMessage.style.display = 'none';
        mindmapContainer.innerHTML = '';
        try {
            const sanitizedText = sanitizeMarkdown(markdownContent);
            const { root } = transformer.transform(sanitizedText);
            postProcessTree(root);
            Markmap.create(mindmapContainer, null, root);
        } catch (error) {
            console.error("Erro ao renderizar mapa mental:", error);
            initialMessage.innerHTML = 'Ocorreu um erro ao processar o arquivo.<br>Verifique a formatação do seu Markdown.';
            initialMessage.style.display = 'flex';
        }
    };

    const exportAsPdf = () => {
        const svgElement = mindmapContainer;

        if (!svgElement || !svgElement.children.length === 0) {
            alert("Não há mapa mental para exportar. Por favor, carregue um arquivo primeiro.");
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const scale = 2.5;
            
            // Mede as dimensões reais do conteúdo (bbox) e do container (clientWidth)
            const bbox = svgElement.getBBox();
            const clientWidth = svgElement.clientWidth;
            const clientHeight = svgElement.clientHeight;

            // --- CORREÇÃO DE ALINHAMENTO APLICADA AQUI ---
            // Calcula o offset (deslocamento) necessário para centralizar o conteúdo do bbox
            // dentro do espaço visível do container.
            const offsetX = (clientWidth - bbox.width) / 2;
            const offsetY = (clientHeight - bbox.height) / 2;
            
            // Define o tamanho final do PDF baseado no container visível
            const pdfWidth = clientWidth;
            const pdfHeight = clientHeight;
            
            // O canvas precisa ser escalado para a alta resolução
            const canvasWidth = pdfWidth * scale;
            const canvasHeight = pdfHeight * scale;

            const svgString = new XMLSerializer().serializeToString(svgElement);
            const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                const ctx = canvas.getContext('2d');
                
                ctx.scale(scale, scale);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, pdfWidth, pdfHeight);

                // Desenha a imagem usando o novo offset para garantir a centralização
                ctx.drawImage(img, -bbox.x + offsetX, -bbox.y + offsetY);

                const pngDataUrl = canvas.toDataURL('image/png');

                const doc = new jsPDF({
                    orientation: pdfWidth > pdfHeight ? 'l' : 'p',
                    unit: 'pt',
                    format: [pdfWidth, pdfHeight]
                });
                doc.addImage(pngDataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                doc.save('mapa-mental.pdf');
            };
            img.onerror = function() {
                console.error("Erro ao carregar a Data URL do SVG na imagem.");
                alert("Ocorreu um erro ao preparar a imagem do mapa mental para exportação.");
            };
            img.src = svgDataUrl;

        } catch (error) {
            console.error('ERRO CRÍTICO NA EXPORTAÇÃO FINAL:', error);
            alert('Ocorreu um erro inesperado durante a exportação para PDF.');
        }
    };
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportAsPdf);
    }
    
    const contentFromEditor = localStorage.getItem('markdownForMindmap');
    if (contentFromEditor) {
        renderMindmap(contentFromEditor);
        localStorage.removeItem('markdownForMindmap');
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