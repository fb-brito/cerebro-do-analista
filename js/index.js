document.addEventListener('DOMContentLoaded', () => {
    // LÓGICA DO PLAYER DE ÁUDIO (EXISTENTE)
    const audioPlayer = {
        audioElement: document.getElementById('audio-element'),
        trackNameEl: document.getElementById('track-name'),
        prevBtn: document.getElementById('prev-track'),
        nextBtn: document.getElementById('next-track'),
        playlist: ['audio/1. O Analista de Dados 4.0.mp3'],
        currentTrackIndex: 0,
        loadTrack(index) {
            this.currentTrackIndex = index;
            const trackPath = this.playlist[index];
            this.audioElement.src = trackPath;
            this.trackNameEl.textContent = trackPath.split('/').pop().replace('.mp3', '');
            this.updateButtons();
        },
        playNext() {
            if (this.currentTrackIndex < this.playlist.length - 1) {
                this.loadTrack(this.currentTrackIndex + 1);
                this.audioElement.play();
            }
        },
        playPrev() {
            if (this.currentTrackIndex > 0) {
                this.loadTrack(this.currentTrackIndex - 1);
                this.audioElement.play();
            }
        },
        updateButtons() {
            this.prevBtn.disabled = this.currentTrackIndex === 0;
            this.nextBtn.disabled = this.currentTrackIndex === this.playlist.length - 1;
        },
        init() {
            if (this.audioElement) {
                this.loadTrack(0);
                this.nextBtn.addEventListener('click', () => this.playNext());
                this.prevBtn.addEventListener('click', () => this.playPrev());
                this.audioElement.addEventListener('ended', () => this.playNext());
            }
        }
    };
    if (document.getElementById('audio-player')) {
        audioPlayer.init();
    }

    // LÓGICA DO ACORDEÃO CRISP-DM (EXISTENTE)
    const crispDmData = [
        { title: "1. Compreensão do Negócio", content: "Definir os objetivos de negócio e traduzir um desafio empresarial em uma questão analítica clara. Fase mais crítica." },
        { title: "2. Compreensão dos Dados", content: "Coletar dados iniciais, explorá-los para identificar padrões e verificar a qualidade geral. Formar hipóteses." },
        { title: "3. Preparação dos Dados", content: "Fase mais demorada. Limpar dados, tratar valores nulos, criar novas variáveis (feature engineering) e formatar." },
        { title: "4. Modelagem", content: "Aplicar técnicas analíticas ou de machine learning para extrair insights e construir modelos preditivos." },
        { title: "5. Avaliação", content: "Avaliar os resultados técnicos no contexto dos objetivos de negócio. A solução resolve o problema original?" },
        { title: "6. Implementação", content: "Colocar a solução (dashboard, modelo) em produção, treinar os usuários e planejar o monitoramento contínuo." }
    ];
    const crispDmContainer = document.getElementById('crisp-dm-container');
    if (crispDmContainer) {
        crispDmData.forEach((step) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'border-b border-gray-200';
            stepEl.innerHTML = `
                <button class="w-full text-left p-4 font-semibold accent-color focus:outline-none flex justify-between items-center">
                    <span>${step.title}</span>
                    <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
                </button>
                <div class="process-step-content px-4 text-gray-600">
                    <p class="py-4">${step.content}</p>
                </div>
            `;
            crispDmContainer.appendChild(stepEl);
            const button = stepEl.querySelector('button');
            const content = stepEl.querySelector('.process-step-content');
            const icon = button.querySelector('.accordion-icon');
            button.addEventListener('click', () => {
                const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
                crispDmContainer.querySelectorAll('.process-step-content').forEach(c => {
                    if (c !== content) {
                        c.style.maxHeight = '0px';
                        c.previousElementSibling.querySelector('.accordion-icon').textContent = '+';
                    }
                });
                if (!isOpen) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.textContent = '−';
                } else {
                    content.style.maxHeight = '0px';
                    icon.textContent = '+';
                }
            });
        });
    }

    // NOVA LÓGICA PARA A CAIXA DE FERRAMENTAS (ADICIONADA E CORRIGIDA)
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