document.addEventListener('DOMContentLoaded', () => {
    // A estrutura de dados foi simplificada para refletir o layout padrão
    const pythonGuideData = {
        sectionTitle: 'Snippets Essenciais com Pandas',
        sectionDescription: 'Comandos fundamentais para iniciar a manipulação e exploração de dados com a biblioteca Pandas.',
        commands: [
            { title: 'Ler um arquivo CSV', command: "import pandas as pd\ndf = pd.read_csv('caminho/para/seu/arquivo.csv')", explanation: 'Usa a biblioteca Pandas para carregar dados de um arquivo CSV em um DataFrame, a estrutura de dados principal para análise.' },
            { title: 'Visualizar Primeiras Linhas', command: "df.head()", explanation: 'Mostra as primeiras 5 linhas do DataFrame. É o primeiro passo para ter uma visão rápida da estrutura e dos tipos de dados.' },
            { title: 'Verificar Informações Gerais', command: "df.info()", explanation: 'Fornece um resumo conciso do DataFrame, incluindo o tipo de cada coluna, valores não nulos e uso de memória.' },
            { title: 'Agrupar e Agregar', command: "df.groupby('categoria')['valor'].sum()", explanation: 'Agrupa o DataFrame por uma coluna categórica e calcula uma agregação (neste caso, a soma) para uma coluna numérica.' },
            { title: 'Filtrar Linhas por Condição', command: "df[df['idade'] > 30]", explanation: 'Seleciona e retorna um novo DataFrame contendo apenas as linhas onde a condição especificada (idade maior que 30) é verdadeira.' }
        ]
    };

    // Agora procuramos pelo contêiner correto, que existe no HTML
    const mainContainer = document.getElementById('python-guide-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = ''; // Limpa o container

    // Cria o bloco da seção, título e parágrafo, seguindo o padrão das outras páginas
    const sectionBlock = document.createElement('div');
    sectionBlock.className = 'mb-12';

    const sectionTitleEl = document.createElement('h3');
    sectionTitleEl.className = 'section-title';
    sectionTitleEl.textContent = pythonGuideData.sectionTitle;

    const sectionParagraphEl = document.createElement('p');
    sectionParagraphEl.className = 'text-gray-600 mb-6';
    sectionParagraphEl.textContent = pythonGuideData.sectionDescription;

    sectionBlock.appendChild(sectionTitleEl);
    sectionBlock.appendChild(sectionParagraphEl);

    // Cria o card que conterá os acordeões
    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'card p-6 md:p-8';

    pythonGuideData.commands.forEach(item => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item border-b border-gray-200 last:border-b-0';
        accordionItem.innerHTML = `
            <button class="accordion-button w-full text-left p-4 font-semibold dark-accent-color focus:outline-none flex justify-between items-center">
                <span>${item.title}</span>
                <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
            </button>
            <div class="accordion-content px-4 text-gray-700" style="max-height: 0px; overflow: hidden;">
                <p class="py-4">${item.explanation}</p>
                <div class="code-block mb-4">
                    <button class="copy-icon" title="Copiar comando"><i class="far fa-copy"></i></button>
                    <pre><code class="language-python">${item.command}</code></pre>
                </div>
            </div>
        `;
        accordionContainer.appendChild(accordionItem);

        accordionItem.querySelector('.copy-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(item.command).then(() => {
                showCopyNotification('Comando copiado!');
            });
        });
    });

    sectionBlock.appendChild(accordionContainer);
    mainContainer.appendChild(sectionBlock);

    // Inicializa todos os acordeões dentro do container principal
    initializeAccordions('#python-guide-container');
});