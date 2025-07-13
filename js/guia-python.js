document.addEventListener('DOMContentLoaded', () => {
    const toolkitData = {
        pandas: [
            { title: 'Ler um arquivo CSV', code: "import pandas as pd\ndf = pd.read_csv('caminho/para/seu/arquivo.csv')" },
            { title: 'Visualizar primeiras linhas', code: "df.head()" },
            { title: 'Verificar informações do DataFrame', code: "df.info()" },
            { title: 'Agrupar por uma coluna e agregar', code: "df.groupby('coluna_categoria')['coluna_valor'].sum()" }
        ],
        sql: [
            { title: 'Seleção básica com filtro', code: "SELECT coluna1, coluna2\nFROM sua_tabela\nWHERE condicao = 'valor';" },
            { title: 'Junção de duas tabelas (JOIN)', code: "SELECT a.*, b.coluna\nFROM tabela_a a\nJOIN tabela_b b ON a.id = b.id_tabela_a;" },
            { title: 'Agrupamento com contagem', code: "SELECT categoria, COUNT(*)\nFROM sua_tabela\nGROUP BY categoria;" },
            { title: 'Lógica condicional com CASE', code: "SELECT nome,\n  CASE\n    WHEN salario > 5000 THEN 'Alto'\n    ELSE 'Baixo'\n  END AS nivel_salario\nFROM funcionarios;" }
        ]
    };

    const pandasContainer = document.getElementById('pandas-content');
    const sqlContainer = document.getElementById('sql-content');
    const notification = document.getElementById('copy-notification');

    function createSnippetElement(snippet) {
        const element = document.createElement('div');
        element.className = 'mb-6';
        element.innerHTML = `
            <h4 class="font-semibold mb-2 text-gray-700">${snippet.title}</h4>
            <div class="code-block">
                <button class="copy-icon" title="Copiar comando"><i class="far fa-copy"></i></button>
                <pre><code>${snippet.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            </div>
        `;
        element.querySelector('.copy-icon').addEventListener('click', () => {
            navigator.clipboard.writeText(snippet.code).then(() => {
                if (notification) {
                    notification.textContent = 'Comando copiado!';
                    notification.classList.add('show');
                    setTimeout(() => notification.classList.remove('show'), 2000);
                }
            });
        });
        return element;
    }

    if (pandasContainer && sqlContainer) {
        toolkitData.pandas.forEach(snippet => pandasContainer.appendChild(createSnippetElement(snippet)));
        toolkitData.sql.forEach(snippet => sqlContainer.appendChild(createSnippetElement(snippet)));

        const tabs = document.querySelectorAll('.toolkit-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                document.querySelectorAll('.toolkit-content').forEach(content => {
                    if (content.id === `${target}-content`) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }
});