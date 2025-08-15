document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');

    // Verifica se os dois painéis (editor e visualização) existem na página.
    if (markdownInput && htmlPreview) {

        // Função que converte o Markdown em HTML e atualiza a visualização.
        const updatePreview = () => {
            // Pega o texto do campo de Markdown.
            const markdownText = markdownInput.value;

            // Usa a biblioteca 'marked' (já inclusa no seu HTML) para converter o texto.
            const htmlContent = marked.parse(markdownText);

            // Insere o HTML convertido na área de visualização.
            htmlPreview.innerHTML = htmlContent;
        };

        // Adiciona um "ouvinte" que chama a função de atualização
        // toda vez que o usuário digita, cola ou altera o texto.
        markdownInput.addEventListener('input', updatePreview);

        // Executa a função uma vez no início para renderizar
        // o texto de exemplo que já está na caixa.
        updatePreview();
    }
});