document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const filenameInput = document.getElementById('filename-input'); // <-- NOVO ELEMENTO

    // Verifica se todos os elementos essenciais existem
    if (markdownInput && htmlPreview && exportMdBtn && exportPdfBtn && filenameInput) {
        
        // --- LÓGICA EXISTENTE DO EDITOR ---
        const updatePreview = () => {
            const markdownText = markdownInput.value;
            const htmlContent = marked.parse(markdownText);
            htmlPreview.innerHTML = htmlContent;
        };
        markdownInput.addEventListener('input', updatePreview);
        updatePreview();

        // --- LÓGICA DE EXPORTAÇÃO ATUALIZADA ---

        // Função auxiliar para obter o nome do arquivo
        const getSanitizedFilename = () => {
            // Pega o valor do campo e remove espaços extras
            const rawName = filenameInput.value.trim();
            // Se o campo estiver vazio, usa 'documento'. Caso contrário, usa o nome digitado.
            return rawName === '' ? 'documento' : rawName;
        };

        // 1. Exportar como Markdown (.md)
        exportMdBtn.addEventListener('click', () => {
            const markdownContent = markdownInput.value;
            const filename = getSanitizedFilename(); // Pega o nome do arquivo do campo

            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.md`; // Usa o nome dinâmico com a extensão .md
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // 2. Exportar como PDF
        exportPdfBtn.addEventListener('click', () => {
            const elementToExport = document.getElementById('html-preview');
            const filename = getSanitizedFilename(); // Pega o nome do arquivo do campo

            const options = {
                margin:       1,
                filename:     `${filename}.pdf`, // Usa o nome dinâmico com a extensão .pdf
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(options).from(elementToExport).save();
        });
    }
});