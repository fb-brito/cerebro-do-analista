document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // LÓGICA DO PLAYER DE ÁUDIO E CARROSSEL
    // =========================================================================
    const podcastComponent = document.getElementById('podcast-component');

    // Princípio do "Componente Isolado": se o container do podcast não existir, nada abaixo roda.
    if (podcastComponent) {

        const audioPlayer = {
            // Elementos da UI
            audioElement: document.getElementById('audio-element'),
            trackNameEl: document.getElementById('track-name'),
            playlistContainer: document.getElementById('playlist-container'),
            albumCoversContainer: document.getElementById('album-covers-container'),
            prevBtn: document.getElementById('prev-track'),
            nextBtn: document.getElementById('next-track'),
            swiperInstance: null,

            // Nova estrutura de dados: cada item tem áudio, imagem e título
            playlist: [
                { audioSrc: 'audio/1. O Analista de Dados 4.0.mp3', imgSrc: 'img/1.jpg', title: '1. O Analista de Dados 4.0' },
                { audioSrc: 'audio/2. [Aula 1] Visão Geral da Formação SQL Database Specialist.wav', imgSrc: 'img/2.jpg', title: '2. [Aula 1] Visão Geral da Formação SQL Database Specialist' },
                { audioSrc: 'audio/3. [Aula 1] Podcast.wav', imgSrc: 'img/3.jpg', title: '3. [Aula 1] Podcast' },
                { audioSrc: 'audio/4. [Aula 2] Pré-requisitos para essa formação.wav', imgSrc: 'img/4.jpg', title: '4. [Aula 2] Pré-requisitos para essa formação' },
                { audioSrc: 'audio/5. [Aula 2] Podcast.wav', imgSrc: 'img/5.jpg', title: '5. [Aula 2] Podcast' }
            ],

            currentTrackIndex: 0,

            // Renderiza a playlist mostrando apenas a faixa atual e a próxima
            renderPlaylist() {
                this.playlistContainer.innerHTML = '';
                // Mostra a faixa atual
                this.renderPlaylistItem(this.currentTrackIndex, true);
                // Se não for a última, mostra a próxima
                if (this.currentTrackIndex < this.playlist.length - 1) {
                    this.renderPlaylistItem(this.currentTrackIndex + 1, false);
                }
            },

            // Função auxiliar para criar cada item da playlist
            renderPlaylistItem(index, isPlaying) {
                const track = this.playlist[index];
                if (!track) return;

                const trackElement = document.createElement('button');
                trackElement.className = 'w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors playlist-item flex items-center gap-3';
                trackElement.dataset.index = index;

                // Adiciona um ícone de "tocando agora"
                const icon = isPlaying ? '<i class="fas fa-volume-up accent-color"></i>' : '<i class="fas fa-headphones text-gray-400"></i>';
                trackElement.innerHTML = `<div>${icon}</div><div>${track.title}</div>`;

                if (isPlaying) {
                    trackElement.classList.add('playing');
                }

                trackElement.addEventListener('click', () => {
                    this.loadTrack(index);
                    this.audioElement.play();
                });

                this.playlistContainer.appendChild(trackElement);
            },

            // Carrega as imagens de capa no carrossel
            renderAlbumCovers() {
                this.playlist.forEach(track => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `<img src="${track.imgSrc}" alt="Capa para ${track.title}">`;
                    this.albumCoversContainer.appendChild(slide);
                });
            },

            loadTrack(index) {
                if (index >= 0 && index < this.playlist.length) {
                    this.currentTrackIndex = index;
                    const track = this.playlist[index];
                    this.audioElement.src = track.audioSrc;
                    this.trackNameEl.textContent = track.title;

                    this.updateButtons();
                    this.renderPlaylist();

                    // Sincroniza o carrossel com a faixa
                    if (this.swiperInstance) {
                        this.swiperInstance.slideTo(index, 300); // 300ms de animação
                    }
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

            // Inicializa tudo: player e carrossel
            init() {
                this.renderAlbumCovers();

                this.swiperInstance = new Swiper('.swiper', {
                    effect: 'coverflow', // Um efeito visual legal
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    },
                });

                this.loadTrack(0); // Carrega a primeira faixa

                // ... dentro da função init()
                this.audioElement.addEventListener('error', (e) => {
                    console.log("Ocorreu um erro ao tentar carregar o áudio.");
                    console.log("Detalhes do erro:", this.audioElement.error);
                });

                this.nextBtn.addEventListener('click', () => this.playNext());
                this.prevBtn.addEventListener('click', () => this.playPrev());

                this.audioElement.addEventListener('ended', () => this.playNext());

                // Sincroniza o player quando o usuário arrasta a imagem
                this.swiperInstance.on('slideChange', () => {
                    const newIndex = this.swiperInstance.activeIndex;
                    if (newIndex !== this.currentTrackIndex) {
                        this.loadTrack(newIndex);
                        this.audioElement.play();
                    }
                });
            }
        };

        audioPlayer.init();
    }


    // =========================================================================
    // LÓGICA DO ACORDEÃO CRISP-DM (INALTERADA)
    // =========================================================================
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