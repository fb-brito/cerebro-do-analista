document.addEventListener('DOMContentLoaded', () => {
    // Objeto com as descrições adicionado para padronização
    const sectionDescriptions = {
        'Seleção e Filtragem': 'Comandos para escolher, filtrar e ordenar os dados que você deseja ver.',
        'Agregação e Agrupamento': 'Funções para resumir dados e realizar cálculos em grupos de linhas.',
        'Junção de Tabelas (JOINs)': 'Técnicas para combinar linhas de duas ou mais tabelas com base em uma coluna relacionada.',
        'Funções Avançadas e Condicionais': 'Operadores e funções para manipulações complexas e lógicas condicionais dentro das suas consultas.'
    };

    const sqlGuideData = [
        {
            category: 'Seleção e Filtragem',
            commands: [
                { title: 'SELECT / FROM / WHERE', explanation: 'A estrutura mais fundamental. Seleciona colunas específicas de uma tabela, aplicando filtros para retornar apenas as linhas que atendem a uma condição.', code: "SELECT nome_cliente, valor_pedido\nFROM pedidos\nWHERE status = 'Concluído';" },
                { title: 'ORDER BY', explanation: 'Ordena os resultados com base em uma ou mais colunas, de forma ascendente (ASC) ou descendente (DESC).', code: "SELECT produto, vendas\nFROM relatorio_vendas\nORDER BY vendas DESC;" },
                { title: 'DISTINCT', explanation: 'Retorna apenas os valores únicos de uma coluna, eliminando duplicatas.', code: "SELECT DISTINCT pais\nFROM clientes;" }
            ]
        },
        {
            category: 'Agregação e Agrupamento',
            commands: [
                { title: 'GROUP BY', explanation: 'Agrupa linhas que têm os mesmos valores em colunas especificadas em um registro de resumo. É quase sempre usado com funções de agregação.', code: "SELECT categoria, AVG(preco)\nFROM produtos\nGROUP BY categoria;" },
                { title: 'COUNT / SUM / AVG', explanation: 'Funções de agregação que contam o número de linhas (COUNT), somam os valores (SUM) ou calculam a média (AVG) de uma coluna.', code: "SELECT COUNT(id_pedido) AS total_pedidos,\n       SUM(valor_total) AS faturamento_total\nFROM vendas;" },
                { title: 'HAVING', explanation: 'Filtra os resultados de um agrupamento. Enquanto o WHERE filtra linhas antes da agregação, o HAVING filtra grupos depois da agregação.', code: "SELECT pais, COUNT(*)\nFROM clientes\nGROUP BY pais\nHAVING COUNT(*) > 10;" }
            ]
        },
        {
            category: 'Junção de Tabelas (JOINs)',
            commands: [
                { title: 'INNER JOIN', explanation: 'Retorna apenas os registros que têm valores correspondentes em ambas as tabelas que estão sendo unidas.', code: "SELECT pedidos.id, clientes.nome\nFROM pedidos\nINNER JOIN clientes ON pedidos.id_cliente = clientes.id;" },
                { title: 'LEFT JOIN', explanation: 'Retorna todos os registros da tabela da esquerda (a primeira mencionada) e os registros correspondentes da tabela da direita. Se não houver correspondência, o resultado é NULL no lado direito.', code: "SELECT clientes.nome, pedidos.id\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.id_cliente;" }
            ]
        },
        {
            category: 'Funções Avançadas e Condicionais',
            commands: [
                { title: 'CASE WHEN', explanation: 'Permite criar uma lógica condicional diretamente na sua consulta, retornando valores diferentes com base nas condições especificadas. Similar a um if-then-else.', code: "SELECT nome_produto,\n  CASE\n    WHEN preco < 50 THEN 'Barato'\n    WHEN preco BETWEEN 50 AND 150 THEN 'Médio'\n    ELSE 'Caro'\n  END AS faixa_preco\nFROM produtos;" },
                { title: 'Window Functions (Ex: ROW_NUMBER)', explanation: 'Executa um cálculo sobre um conjunto de linhas que estão relacionadas à linha atual. Útil para criar rankings, calcular somas acumuladas, etc., sem colapsar as linhas como um GROUP BY.', code: "SELECT nome, setor, salario,\n  ROW_NUMBER() OVER(PARTITION BY setor ORDER BY salario DESC) as ranking_salario_setor\nFROM funcionarios;" }
            ]
        }
    ];

    const container = document.getElementById('sql-guide-container');
    if (!container) return;

    container.innerHTML = '';

    sqlGuideData.forEach(section => {
        const sectionBlock = document.createElement('div');
        sectionBlock.className = 'mb-12';

        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = section.category;

        const sectionParagraph = document.createElement('p');
        sectionParagraph.className = 'text-gray-600 mb-6';
        sectionParagraph.textContent = sectionDescriptions[section.category] || '';
        
        sectionBlock.appendChild(sectionTitle);
        sectionBlock.appendChild(sectionParagraph);
        
        const accordionContainer = document.createElement('div');
        accordionContainer.className = 'card p-6 md:p-8';
        
        section.commands.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item border-b border-gray-200 last:border-b-0';
            accordionItem.innerHTML = `
                <button class="accordion-button w-full text-left py-4 font-semibold dark-accent-color focus:outline-none flex justify-between items-center">
                    <span>${item.title}</span>
                    <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
                </button>
                <div class="accordion-content px-4 text-gray-700" style="max-height: 0px; overflow: hidden;">
                    <p class="py-4">${item.explanation}</p>
                    <div class="code-block mb-4">
                        <button class="copy-icon" title="Copiar comando"><i class="far fa-copy"></i></button>
                        <pre><code>${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                    </div>
                </div>
            `;
            accordionContainer.appendChild(accordionItem);

            accordionItem.querySelector('.copy-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(item.code).then(() => {
                    showCopyNotification('Comando copiado!');
                });
            });
        });
        sectionBlock.appendChild(accordionContainer);
        container.appendChild(sectionBlock);
    });

    initializeAccordions('#sql-guide-container');
});