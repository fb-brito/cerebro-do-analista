document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const filenameInput = document.getElementById('filename-input');
    const lineNumbers = document.getElementById('line-numbers');

    if (markdownInput && htmlPreview && exportMdBtn && exportPdfBtn && filenameInput && lineNumbers) {
        
        // --- LÓGICA DE NÚMERO DE LINHAS CORRIGIDA DEFINITIVAMENTE ---
        const updateLineNumbers = () => {
            const lineCount = markdownInput.value.split('\n').length;
            lineNumbers.innerHTML = '';
            
            // Cria um fragmento de documento para melhor performance
            const fragment = document.createDocumentFragment();
            for (let i = 1; i <= lineCount; i++) {
                // TROCADO <span> POR <div> PARA GARANTIR A QUEBRA DE LINHA
                const lineNumberElement = document.createElement('div');
                lineNumberElement.textContent = i;
                fragment.appendChild(lineNumberElement);
            }
            // Adiciona todos os números de uma vez
            lineNumbers.appendChild(fragment);
        };

        const updatePreview = () => {
            const markdownText = markdownInput.value;
            const htmlContent = marked.parse(markdownText);
            htmlPreview.innerHTML = htmlContent;
        };
        
        markdownInput.addEventListener('input', () => {
            updatePreview();
            updateLineNumbers();
        });
        
        markdownInput.addEventListener('scroll', () => {
            lineNumbers.scrollTop = markdownInput.scrollTop;
        });

        updatePreview();
        updateLineNumbers();

        const getSanitizedFilename = () => {
            const rawName = filenameInput.value.trim();
            return rawName === '' ? 'documento' : rawName;
        };

        exportMdBtn.addEventListener('click', () => {
            const markdownContent = markdownInput.value;
            const filename = getSanitizedFilename();
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        exportPdfBtn.addEventListener('click', () => {
            const elementToExport = document.getElementById('html-preview');
            const filename = getSanitizedFilename();
            const options = {
                margin:       1,
                filename:     `${filename}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(options).from(elementToExport).save();
        });
    }
});