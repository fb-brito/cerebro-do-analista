document.addEventListener('DOMContentLoaded', () => {
    const markdownData = [
        { title: 'Títulos', code: '# Título 1\n## Título 2\n### Título 3', preview: '<h1>Título 1</h1><h2>Título 2</h2><h3>Título 3</h3>' },
        { title: 'Estilos de Texto', code: '**Texto em negrito**\n*Texto em itálico*\n***Negrito e itálico***', preview: '<p><strong>Texto em negrito</strong><br><em>Texto em itálico</em><br><strong><em>Negrito e itálico</em></strong></p>' },
        { title: 'Listas', code: '* Item 1\n* Item 2\n\n1. Primeiro item\n2. Segundo item', preview: '<ul><li>Item 1</li><li>Item 2</li></ul><ol><li>Primeiro item</li><li>Segundo item</li></ol>' },
        { title: 'Links e Imagens', code: '[Visite o Google](https://google.com)\n\n![Texto alternativo](https://placehold.co/100x40?text=Imagem)', preview: '<p><a href="https://google.com" target="_blank">Visite o Google</a></p><img src="https://placehold.co/100x40?text=Imagem" alt="Texto alternativo">' },
        { title: 'Citações', code: '> Esta é uma citação.', preview: '<blockquote>Esta é uma citação.</blockquote>' },
        { title: 'Código', code: 'Código inline: `console.log("Olá")`\n\nBloco de código:\n```python\ndef main():\n  return "Olá"\n```', preview: '<p>Código inline: <code>console.log("Olá")</code></p><p>Bloco de código:</p><pre><code>def main():\n  return "Olá"</code></pre>' },
        { title: 'Tabelas', code: '| Cabeçalho 1 | Cabeçalho 2 |\n|---|---|\n| Célula 1 | Célula 2 |\n| Célula 3 | Célula 4 |', preview: '<table><thead><tr><th>Cabeçalho 1</th><th>Cabeçalho 2</th></tr></thead><tbody><tr><td>Célula 1</td><td>Célula 2</td></tr><tr><td>Célula 3</td><td>Célula 4</td></tr></tbody></table>' },
        { title: 'Lista de Tarefas', code: '- [x] Tarefa concluída\n- [ ] Tarefa pendente', preview: '<ul><li><input type="checkbox" checked disabled> Tarefa concluída</li><li><input type="checkbox" disabled> Tarefa pendente</li></ul>' }
    ];

    const container = document.getElementById('markdown-guide');
    const notification = document.getElementById('copy-notification');

    markdownData.forEach(item => {
        const element = document.createElement('div');
        element.innerHTML = `
                    <h2 class="text-2xl font-bold mb-4">${item.title}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        <div class="flex flex-col">
                            <h3 class="font-semibold mb-2">Sintaxe Markdown</h3>
                            <div class="code-block h-full flex-grow">
                                <button class="copy-icon" title="Copiar sintaxe">📋</button>
                                <pre><code>${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <h3 class="font-semibold mb-2">Resultado</h3>
                            <div class="preview-block h-full flex-grow">${item.preview}</div>
                        </div>
                    </div>
                `;
        container.appendChild(element);

        element.querySelector('.copy-icon').addEventListener('click', () => {
            navigator.clipboard.writeText(item.code).then(() => {
                // Nova chamada à função centralizada
                showCopyNotification('Comando copiado!');
            });
        });
    });
});