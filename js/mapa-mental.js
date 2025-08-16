document.addEventListener('DOMContentLoaded', () => {
    
    // FORMA CORRETA de acessar as ferramentas da biblioteca Markmap
    const { Transformer, Markmap } = window.markmap;

    // Elementos da página
    const mindmapContainer = document.getElementById('mindmap-container');
    const markdownUpload = document.getElementById('markdown-upload');
    const initialMessage = document.getElementById('initial-message');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    // Instância do Transformer para converter Markdown
    const transformer = new Transformer();
    let mm; // Variável para guardar a instância do mapa mental

    // Verifica se os elementos essenciais existem
    if (mindmapContainer && markdownUpload && initialMessage && exportPdfBtn) {
        
        const renderMindmap = (markdownContent) => {
            initialMessage.style.display = 'none';
            mindmapContainer.innerHTML = '';

            const { root, features } = transformer.transform(markdownContent);
            
            // Cria a visualização do mapa mental no nosso <svg>
            mm = Markmap.create(mindmapContainer, null, root);

            exportPdfBtn.classList.remove('hidden');
        };

        markdownUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const markdownContent = e.target.result;
                renderMindmap(markdownContent);
            };

            reader.readAsText(file);
        });

        // Lógica para exportação de PDF será adicionada aqui no próximo passo.

    } else {
        console.error("Não foi possível encontrar um ou mais elementos essenciais na página do mapa mental.");
    }
});