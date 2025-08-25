document.addEventListener('DOMContentLoaded', () => {
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

    const mainContainer = document.getElementById('python-guide-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = ''; 

    const sectionBlock = document.createElement('div');
    sectionBlock.className = 'mb-12';

    // Os elementos de título e parágrafo são mantidos, pois o HTML já os exibe estaticamente.
    // O JS só precisa renderizar o acordeão.

    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'glass-card rounded-2xl p-6 md:p-8 hover-lift';

    pythonGuideData.commands.forEach(item => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item border-b border-gray-200 dark:border-white/10 last:border-b-0';
        accordionItem.innerHTML = `
            <button class="accordion-button w-full text-left p-4 font-semibold text-primary focus:outline-none flex justify-between items-center">
                <span>${item.title}</span>
                <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
            </button>
            <div class="accordion-content px-4 text-gray-700 dark:text-gray-300" style="max-height: 0px; overflow: hidden;">
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

    initializeAccordions('#python-guide-container');
});