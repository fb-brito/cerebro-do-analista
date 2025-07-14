document.addEventListener('DOMContentLoaded', () => {
    // LÓGICA DO PLAYER DE ÁUDIO (ATUALIZADA PARA PLAYLIST)
    const audioPlayer = {
        audioElement: document.getElementById('audio-element'),
        trackNameEl: document.getElementById('track-name'),
        prevBtn: document.getElementById('prev-track'),
        nextBtn: document.getElementById('next-track'),
        
        playlist: [
            'audio/1. O Analista de Dados 4.0.mp3',
            'audio/2. [Aula 1] Visão Geral da Formação SQL Data Science.mp3',
            'audio/3. [Aula 1] Podcast.wav',
            'audio/4. [Aula 2] Pré-requisitos para essa formação.mp3',
            'audio/5. [Aula 2] Podcast.wav'
        ],
        
        currentTrackIndex: 0,

        loadTrack(index) {
            if (index >= 0 && index < this.playlist.length) {
                this.currentTrackIndex = index;
                const trackPath = this.playlist[index];
                this.audioElement.src = trackPath;
                
                // LÓGICA CORRIGIDA: Apenas remove a extensão do arquivo, mantendo o nome completo.
                let trackName = trackPath.split('/').pop().replace(/\.mp3|\.wav/gi, '');
                this.trackNameEl.textContent = trackName;
                
                this.updateButtons();
            }
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

    // LÓGICA DO ACORDEÃO CRISP-DM (Inalterada)
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
        crispDmContainer.innerHTML = '';
        crispDmData.forEach((step) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'accordion-item border-b border-gray-200';
            stepEl.innerHTML = `
                <button class="accordion-button w-full text-left p-4 font-semibold accent-color focus:outline-none flex justify-between items-center">
                    <span>${step.title}</span>
                    <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
                </button>
                <div class="accordion-content px-4 text-gray-600" style="max-height: 0px; overflow: hidden;">
                    <p class="py-4">${step.content}</p>
                </div>
            `;
            crispDmContainer.appendChild(stepEl);
        });
        initializeAccordions('#crisp-dm-container', true);
    }
});